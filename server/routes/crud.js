// Generic CRUD router factory. Only whitelisted columns are writable.
const express = require('express');
const db = require('../db');

module.exports = function crud({ table, columns, select, searchable = [], order = 'id DESC' }) {
  const router = express.Router();
  const base = select || `SELECT * FROM ${table}`;
  const alias = select ? 't.' : '';
  const pick = (body) => {
    const data = {};
    for (const c of columns) if (body[c] !== undefined) data[c] = body[c] === '' ? null : body[c];
    return data;
  };

  router.get('/', async (req, res, next) => {
    try {
      let sql = base, params = [];
      if (req.query.search && searchable.length) {
        sql += ' WHERE ' + searchable.map((c) => `${c} LIKE ?`).join(' OR ');
        params = searchable.map(() => `%${req.query.search}%`);
      }
      sql += ` ORDER BY ${alias}${order}`;
      const [rows] = await db.query(sql, params);
      res.json(rows);
    } catch (e) { next(e); }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const [rows] = await db.query(`${base} WHERE ${alias}id = ?`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ message: 'Not found' });
      res.json(rows[0]);
    } catch (e) { next(e); }
  });

  router.post('/', async (req, res, next) => {
    try {
      if (req.validate) await req.validate(req.body);
      const [r] = await db.query(`INSERT INTO ${table} SET ?`, [pick(req.body)]);
      res.status(201).json({ id: r.insertId, ...pick(req.body) });
    } catch (e) { next(e); }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const data = pick(req.body);
      if (!Object.keys(data).length) return res.status(400).json({ message: 'No fields' });
      await db.query(`UPDATE ${table} SET ? WHERE id = ?`, [data, req.params.id]);
      res.json({ id: Number(req.params.id), ...data });
    } catch (e) { next(e); }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      await db.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
      res.json({ success: true });
    } catch (e) { next(e); }
  });

  return router;
};
