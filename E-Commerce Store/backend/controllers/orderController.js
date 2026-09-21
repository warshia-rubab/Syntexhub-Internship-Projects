const db = require('../config/db');
const logger = require('../config/logger');
const { logActivity } = require('../utils/activityLogger');

// CREATE order (user)
exports.createOrder = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const { items } = req.body; // [{ product_id, quantity }]
    let total = 0;
    const rows = [];

    for (const item of items) {
      const [p] = await conn.query('SELECT price, stock FROM products WHERE id=?', [item.product_id]);
      if (!p.length || p[0].stock < item.quantity) throw new Error('Stock issue');
      total += p[0].price * item.quantity;
      rows.push([item.product_id, item.quantity, p[0].price]);
    }

    const [order] = await conn.query(
      'INSERT INTO orders (user_id,total) VALUES (?,?)',
      [req.user.id, total]
    );

    for (const [pid, qty, price] of rows) {
      await conn.query(
        'INSERT INTO order_items (order_id,product_id,quantity,price) VALUES (?,?,?,?)',
        [order.insertId, pid, qty, price]
      );
      await conn.query('UPDATE products SET stock = stock - ? WHERE id=?', [qty, pid]);
    }

    await conn.commit();
    logger.info(`Order #${order.insertId} placed by user ${req.user.id} — total $${total}`);
    await logActivity(req.user.id, `Placed order #${order.insertId}`, req.ip);
    res.status(201).json({ orderId: order.insertId, total });
  } catch (e) {
    await conn.rollback();
    logger.error('createOrder failed', { error: e.message });
    res.status(500).json({ message: e.message });
  } finally {
    conn.release();
  }
};

// GET my orders
exports.myOrders = async (req, res) => {
  const [orders] = await db.query(
    'SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC',
    [req.user.id]
  );
  for (const o of orders) {
    const [items] = await db.query(
      `SELECT oi.*, p.name FROM order_items oi
       JOIN products p ON p.id = oi.product_id WHERE oi.order_id=?`, [o.id]
    );
    o.items = items;
  }
  res.json(orders);
};

// ADMIN: get all orders
exports.allOrders = async (req, res) => {
  const [orders] = await db.query(
    `SELECT o.*, u.name AS user_name FROM orders o
     JOIN users u ON u.id = o.user_id ORDER BY o.created_at DESC`
  );
  res.json(orders);
};

// ADMIN: update order status
exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  await db.query('UPDATE orders SET status=? WHERE id=?', [status, req.params.id]);
  logger.info(`Order #${req.params.id} status → ${status}`);
  await logActivity(req.user.id, `Updated order #${req.params.id} to ${status}`, req.ip);
  res.json({ message: 'Status updated' });
};