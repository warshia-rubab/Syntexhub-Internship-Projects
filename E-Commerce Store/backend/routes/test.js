const router = require('express').Router();
const db = require('../config/db');

router.get('/db', async (req, res) => {
  try {
    const [r] = await db.query('SELECT 1 AS ok');
    const [tables] = await db.query('SHOW TABLES');
    res.json({
      db: 'connected',
      probe: r[0],
      tables: tables.map(t => Object.values(t)[0])
    });
  } catch (e) {
    res.status(500).json({
      db: 'failed',
      message: e.message,
      code: e.code
    });
  }
});

module.exports = router;