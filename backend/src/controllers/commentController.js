const commentService = require('../services/commentService');
const { toPositiveInt } = require('../utils/validators');

async function listComments(req, res) {
  const comments = await commentService.listByPost(toPositiveInt(req.params.postId, 'post id'));
  res.json({ comments });
}

async function createComment(req, res) {
  const comment = await commentService.create(
    toPositiveInt(req.params.postId, 'post id'),
    req.user.id,
    req.body.content
  );
  res.status(201).json({ comment });
}

async function updateComment(req, res) {
  const comment = await commentService.update(
    toPositiveInt(req.params.commentId, 'comment id'),
    req.user.id,
    req.body.content
  );
  res.json({ comment });
}

async function deleteComment(req, res) {
  await commentService.remove(toPositiveInt(req.params.commentId, 'comment id'), req.user.id);
  res.status(204).send();
}

module.exports = { listComments, createComment, updateComment, deleteComment };
