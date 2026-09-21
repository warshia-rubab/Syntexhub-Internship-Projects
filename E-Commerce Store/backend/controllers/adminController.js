const db = require('../config/db');
const logger = require('../config/logger');

exports.stats = async (req, res) => {
  try {
    const [[users]]    = await db.query('SELECT COUNT(*) AS c FROM users');
    const [[products]] = await db.query('SELECT COUNT(*) AS c FROM products');
    const [[orders]]   = await db.query('SELECT COUNT(*) AS c FROM orders');
    const [[revenue]]  = await db.query('SELECT IFNULL(SUM(total),0) AS s FROM orders');

    const [sales] = await db.query(
      'SELECT DATE(created_at) AS day, SUM(total) AS total FROM orders GROUP BY DATE(created_at) ORDER BY day DESC LIMIT 7'
    );

    logger.info('Admin ' + req.user.id + ' viewed dashboard');
    res.json({
      users: users.c,
      products: products.c,
      orders: orders.c,
      revenue: revenue.s,
      salesChart: sales.reverse()
    });
  } catch (e) {
    logger.error('stats failed', { error: e.message });
    res.status(500).json({ message: e.message });
  }
};

exports.activityLogs = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT al.*, u.name FROM activity_logs al LEFT JOIN users u ON u.id = al.user_id ORDER BY al.created_at DESC LIMIT 100'
    );
    res.json(rows);
  } catch (e) {
    logger.error('activityLogs failed', { error: e.message });
    res.status(500).json({ message: e.message });
  }
};