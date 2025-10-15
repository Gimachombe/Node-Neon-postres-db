const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGSSLMODE, PGCHANNELBINDING } = process.env;

const pool = new Pool({
  host: PGHOST,
  database: PGDATABASE,
  user: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

pool.connect().then(() => console.log("Connected to PostgreSQL"))
.catch(err => console.log("Databse connection error:", err.message));


app.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts');
  res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed"});
  }
});


app.listen(3000, () => console.log('Server Running on http://localhost:3000'));
