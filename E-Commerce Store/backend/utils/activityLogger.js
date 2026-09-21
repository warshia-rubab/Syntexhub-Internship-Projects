const db = require('../config/db');
const logger = require('../config/logger');

async function logActivity(userId, action, ip = null) {
  console.log('>>> logActivity CALLED:', { userId, action, ip });

  try {
    const [result] = await db.query(
      'INSERT INTO activity_logs (user_id, action, ip) VALUES (?,?,?)',
      [userId, action, ip]
    );
    console.log('>>> INSERT OK. InsertId:', result.insertId);
  } catch (e) {
    console.error('>>> DB FAILED:', e.message);
    console.error('>>> error code:', e.code);
    console.error('>>> sql message:', e.sqlMessage);
  }

  logger.info('ACTIVITY | user=' + userId + ' | ' + action + ' | ip=' + ip);
}

module.exports = { logActivity };
