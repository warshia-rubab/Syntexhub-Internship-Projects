const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const logger = require('../config/logger');
const { logActivity } = require('../utils/activityLogger');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const hash = await bcrypt.hash(password, 10);
    const [r] = await db.query(
      'INSERT INTO users (name,email,password) VALUES (?,?,?)',
      [name, email, hash]
    );
    console.log('>>> User inserted. insertId =', r.insertId);

    logger.info('New user registered: ' + email);
    console.log('>>> Calling logActivity now...');

    await logActivity(r.insertId, 'Registered new account', req.ip);
    console.log('>>> logActivity returned OK');

    res.json({ message: 'Registered successfully' });
  } catch (e) {
    console.error('>>> REGISTER ERROR:', e.message, '| code:', e.code);
    logger.error('Register error: ' + e.message);
    res.status(500).json({ message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, rows[0].password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: rows[0].id, role: rows[0].role, name: rows[0].name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '7d' }
    );
    logger.info('Login: ' + email);
    await logActivity(rows[0].id, 'Logged in', req.ip);
    res.json({
      token,
      user: { id: rows[0].id, name: rows[0].name, role: rows[0].role }
    });
  } catch (e) {
    logger.error('Login error', { error: e.message });
    res.status(500).json({ message: e.message });
  }
};