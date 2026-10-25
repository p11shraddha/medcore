const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const one = async (sql) => (await db.query(sql))[0][0].v;
    const [weekly] = await db.query(
      `SELECT appointment_date AS date, COUNT(*) AS count FROM appointments
       WHERE appointment_date >= CURDATE() - INTERVAL 6 DAY GROUP BY appointment_date ORDER BY appointment_date`);
    const [lowStock] = await db.query('SELECT id, name, stock, reorder_level FROM medicines WHERE stock <= reorder_level');
    const [expiring] = await db.query(
      'SELECT id, name, expiry_date FROM medicines WHERE expiry_date <= CURDATE() + INTERVAL 30 DAY ORDER BY expiry_date');
    res.json({
      patients: await one('SELECT COUNT(*) v FROM patients'),
      doctors: await one('SELECT COUNT(*) v FROM doctors'),
      appointmentsToday: await one('SELECT COUNT(*) v FROM appointments WHERE appointment_date = CURDATE()'),
      revenue: await one("SELECT COALESCE(SUM(amount),0) v FROM invoices WHERE status = 'PAID'"),
      pendingLabs: await one("SELECT COUNT(*) v FROM lab_orders WHERE status <> 'APPROVED'"),
      weekly, lowStock, expiring,
    });
  } catch (e) { next(e); }
});

module.exports = router;
