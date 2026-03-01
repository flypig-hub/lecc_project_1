const { pool } = require('../config/db');

async function findByEmail(email) {
  const query = 'SELECT id, email, password, created_at FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

async function createUser(email, passwordHash) {
  const query = `
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING id, email, created_at
  `;
  const { rows } = await pool.query(query, [email, passwordHash]);
  return rows[0];
}

module.exports = { findByEmail, createUser };
