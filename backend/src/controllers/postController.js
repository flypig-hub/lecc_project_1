const postService = require('../services/postService');
const { toPositiveInt } = require('../utils/validators');

async function listPosts(_req, res) {
  const posts = await postService.getPosts();
  res.json({ posts });
}

async function getPost(req, res) {
  const post = await postService.getPost(toPositiveInt(req.params.id, 'post id'));
  res.json({ post });
}

async function createPost(req, res) {
  const { title, content } = req.body;
  const post = await postService.createPost(req.user.id, title, content);
  res.status(201).json({ post });
}

async function updatePost(req, res) {
  const { title, content } = req.body;
  const post = await postService.updatePost(
    req.user.id,
    toPositiveInt(req.params.id, 'post id'),
    title,
    content
  );
  res.json({ post });
}

async function deletePost(req, res) {
  await postService.deletePost(req.user.id, toPositiveInt(req.params.id, 'post id'));
  res.status(204).send();
}

module.exports = { listPosts, getPost, createPost, updatePost, deletePost };
