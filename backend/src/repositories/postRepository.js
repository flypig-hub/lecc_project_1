const { pool } = require('../config/db');

async function listPosts() {
  const query = `
    SELECT p.id, p.title, p.content, p.user_id, p.created_at, u.email AS author_email
    FROM posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function findPostById(id) {
  const query = `
    SELECT p.id, p.title, p.content, p.user_id, p.created_at, u.email AS author_email
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE p.id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function createPost(userId, title, content) {
  const query = `
    INSERT INTO posts (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, title, content, created_at
  `;
  const { rows } = await pool.query(query, [userId, title, content]);
  return rows[0];
}

async function updatePost(id, title, content) {
  const query = `
    UPDATE posts
    SET title = $2, content = $3
    WHERE id = $1
    RETURNING id, user_id, title, content, created_at
  `;
  const { rows } = await pool.query(query, [id, title, content]);
  return rows[0] || null;
}

async function deletePostWithTransaction(id) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM comments WHERE post_id = $1', [id]);
    const { rowCount } = await client.query('DELETE FROM posts WHERE id = $1', [id]);
    await client.query('COMMIT');
    return rowCount > 0;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  listPosts,
  findPostById,
  createPost,
  updatePost,
  deletePostWithTransaction
};
