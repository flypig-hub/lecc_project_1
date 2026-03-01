const postRepository = require('../repositories/postRepository');
const { HttpError } = require('../utils/httpError');

async function getPosts() {
  return postRepository.listPosts();
}

async function getPost(id) {
  const post = await postRepository.findPostById(id);
  if (!post) throw new HttpError(404, '게시글을 찾을 수 없습니다.');
  return post;
}

async function createPost(userId, title, content) {
  return postRepository.createPost(userId, title, content);
}

async function updatePost(userId, id, title, content) {
  const post = await postRepository.findPostById(id);
  if (!post) throw new HttpError(404, '게시글을 찾을 수 없습니다.');
  if (post.user_id !== userId) throw new HttpError(403, '게시글 수정 권한이 없습니다.');

  return postRepository.updatePost(id, title, content);
}

async function deletePost(userId, id) {
  const post = await postRepository.findPostById(id);
  if (!post) throw new HttpError(404, '게시글을 찾을 수 없습니다.');
  if (post.user_id !== userId) throw new HttpError(403, '게시글 삭제 권한이 없습니다.');

  await postRepository.deletePostWithTransaction(id);
}

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };
