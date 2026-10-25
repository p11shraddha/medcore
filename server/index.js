const express = require('express');
const cors = require('cors');
require('dotenv').config();
const crud = require('./routes/crud');
const resources = require('./routes/resources');
const appointments = require('./routes/appointments');
const dashboard = require('./routes/dashboard');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/dashboard', dashboard);
app.use('/api/appointments', appointments); // custom rules first
for (const [path, cfg] of Object.entries(resources)) app.use(`/api/${path}`, crud(cfg));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MedCore API running on http://localhost:${PORT}`));
