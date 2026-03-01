const { pool } = require('../config/db');

async function listCommentsByPost(postId) {
  const query = `
    SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, u.email AS author_email
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `;
  const { rows } = await pool.query(query, [postId]);
  return rows;
}

async function findCommentById(id) {
  const query = 'SELECT id, post_id, user_id, content, created_at FROM comments WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function createComment(postId, userId, content) {
  const query = `
    INSERT INTO comments (post_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, post_id, user_id, content, created_at
  `;
  const { rows } = await pool.query(query, [postId, userId, content]);
  return rows[0];
}

async function updateComment(id, content) {
  const query = `
    UPDATE comments
    SET content = $2
    WHERE id = $1
    RETURNING id, post_id, user_id, content, created_at
  `;
  const { rows } = await pool.query(query, [id, content]);
  return rows[0] || null;
}

async function deleteComment(id) {
  const { rowCount } = await pool.query('DELETE FROM comments WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = {
  listCommentsByPost,
  findCommentById,
  createComment,
  updateComment,
  deleteComment
};
