const db = require('../config/db');
const logger = require('../config/logger');
const { logActivity } = require('../utils/activityLogger');

exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category) { sql += ' AND category = ?'; params.push(category); }
    if (search)   { sql += ' AND name LIKE ?';  params.push('%' + search + '%'); }
    if (sort === 'price_asc')  sql += ' ORDER BY price ASC';
    if (sort === 'price_desc') sql += ' ORDER BY price DESC';
    if (sort === 'newest')     sql += ' ORDER BY created_at DESC';

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.log('getProducts error:', e.message, '| code:', e.code);
    logger.error('getProducts failed: ' + e.message + ' | code=' + e.code);
    res.status(500).json({
      message: 'Server error',
      detail: e.message,
      code: e.code
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id=?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    console.log('getProduct error:', e.message);
    logger.error('getProduct failed: ' + e.message);
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    const [r] = await db.query(
      'INSERT INTO products (name,description,price,stock,category,image_url) VALUES (?,?,?,?,?,?)',
      [name, description, price, stock, category, image_url]
    );
    logger.info('Product created: ' + name);
    await logActivity(req.user.id, 'Created product #' + r.insertId, req.ip);
    res.status(201).json({ id: r.insertId, message: 'Created' });
  } catch (e) {
    console.log('createProduct error:', e.message);
    logger.error('createProduct failed: ' + e.message);
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    await db.query(
      'UPDATE products SET name=?,description=?,price=?,stock=?,category=?,image_url=? WHERE id=?',
      [name, description, price, stock, category, image_url, req.params.id]
    );
    logger.info('Product updated: #' + req.params.id);
    await logActivity(req.user.id, 'Updated product #' + req.params.id, req.ip);
    res.json({ message: 'Updated' });
  } catch (e) {
    console.log('updateProduct error:', e.message);
    logger.error('updateProduct failed: ' + e.message);
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
    logger.warn('Product deleted: #' + req.params.id);
    await logActivity(req.user.id, 'Deleted product #' + req.params.id, req.ip);
    res.json({ message: 'Deleted' });
  } catch (e) {
    console.log('deleteProduct error:', e.message);
    logger.error('deleteProduct failed: ' + e.message);
    res.status(500).json({ message: 'Server error', detail: e.message });
  }
};