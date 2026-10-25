const express = require('express');
const db = require('../db');
const crud = require('./crud');

const STATUSES = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const NEXT = { PENDING: ['CONFIRMED', 'CANCELLED'], CONFIRMED: ['IN_PROGRESS', 'CANCELLED'], IN_PROGRESS: ['COMPLETED'], COMPLETED: [], CANCELLED: [] };

const router = express.Router();

// Conflict detection: a doctor cannot have two active appointments in the same slot.
async function checkConflict(body, excludeId = 0) {
  const [rows] = await db.query(
    `SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?
     AND status <> 'CANCELLED' AND id <> ?`,
    [body.doctor_id, body.appointment_date, body.appointment_time, excludeId]
  );
  if (rows.length) { const e = new Error('This doctor is already booked for that slot.'); e.status = 409; throw e; }
}

router.post('/', async (req, res, next) => { try { await checkConflict(req.body); next(); } catch (e) { next(e); } });
router.put('/:id', async (req, res, next) => {
  try { if (req.body.doctor_id) await checkConflict(req.body, req.params.id); next(); } catch (e) { next(e); }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const [rows] = await db.query('SELECT status FROM appointments WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    if (!NEXT[rows[0].status].includes(status))
      return res.status(400).json({ message: `Cannot move from ${rows[0].status} to ${status}` });
    await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ id: Number(req.params.id), status });
  } catch (e) { next(e); }
});

router.use(crud({
  table: 'appointments',
  columns: ['patient_id', 'doctor_id', 'appointment_date', 'appointment_time', 'reason', 'status'],
  select: `SELECT t.*, p.name AS patient_name, d.name AS doctor_name FROM appointments t
           JOIN patients p ON p.id = t.patient_id JOIN doctors d ON d.id = t.doctor_id`,
  searchable: ['p.name', 'd.name', 't.status'],
  order: 'appointment_date DESC, t.appointment_time DESC',
}));

module.exports = router;
