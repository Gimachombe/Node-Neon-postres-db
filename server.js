const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { Pool } = require('pg');
const app = express();


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

app.use(cors());
app.use(express.json());

pool.connect().then( client => {
  console.log("Connected to PostgreSQL");
  client.release();
})
.catch(err => console.log("Databse connection error:", err.stack));

//Get route
app.get('/', async (req, res) => {
  try {
    const { result } = await pool.query('SELECT * FROM posts ORDER BY id DESC');
  res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database query failed"});
  }
});

//Post route
app.post("/posts", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content)
  return res.status(400).json({ error: 'Title and content are required' });

  try {
    const result = await pool.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({ error: 'Failed to insert post' });
  }
});

app.listen(3000, () => console.log('Server Running on http://localhost:3000'));
