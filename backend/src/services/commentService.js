const commentRepository = require('../repositories/commentRepository');
const postRepository = require('../repositories/postRepository');
const { HttpError } = require('../utils/httpError');

async function listByPost(postId) {
  const post = await postRepository.findPostById(postId);
  if (!post) throw new HttpError(404, '게시글을 찾을 수 없습니다.');
  return commentRepository.listCommentsByPost(postId);
}

async function create(postId, userId, content) {
  const post = await postRepository.findPostById(postId);
  if (!post) throw new HttpError(404, '게시글을 찾을 수 없습니다.');
  return commentRepository.createComment(postId, userId, content);
}

async function update(commentId, userId, content) {
  const comment = await commentRepository.findCommentById(commentId);
  if (!comment) throw new HttpError(404, '댓글을 찾을 수 없습니다.');
  if (comment.user_id !== userId) throw new HttpError(403, '댓글 수정 권한이 없습니다.');
  return commentRepository.updateComment(commentId, content);
}

async function remove(commentId, userId) {
  const comment = await commentRepository.findCommentById(commentId);
  if (!comment) throw new HttpError(404, '댓글을 찾을 수 없습니다.');
  if (comment.user_id !== userId) throw new HttpError(403, '댓글 삭제 권한이 없습니다.');
  await commentRepository.deleteComment(commentId);
}

module.exports = { listByPost, create, update, remove };
