import { useEffect, useState } from 'react';
import api from '../api/client';

export default function PostBoard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commentInputs, setCommentInputs] = useState({});
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setError('');
      const { data } = await api.get('/api/posts');
      const withComments = await Promise.all(
        data.posts.map(async (p) => {
          const res = await api.get(`/api/posts/${p.id}/comments`);
          return { ...p, comments: res.data.comments };
        })
      );
      setPosts(withComments);
    } catch (e) {
      setError(e.response?.data?.message || '게시글 로딩 실패');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createPost = async () => {
    try {
      setError('');
      await api.post('/api/posts', { title, content });
      setTitle('');
      setContent('');
      await load();
    } catch (e) {
      setError(e.response?.data?.message || '게시글 작성 실패');
    }
  };

  const updatePost = async (post) => {
    const newTitle = prompt('새 제목', post.title);
    const newContent = prompt('새 내용', post.content);
    if (!newTitle || !newContent) return;

    try {
      setError('');
      await api.put(`/api/posts/${post.id}`, { title: newTitle, content: newContent });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || '게시글 수정 실패');
    }
  };

  const deletePost = async (postId) => {
    try {
      setError('');
      await api.delete(`/api/posts/${postId}`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || '게시글 삭제 실패');
    }
  };

  const createComment = async (postId) => {
    const contentValue = commentInputs[postId];
    if (!contentValue) return;

    try {
      setError('');
      await api.post(`/api/posts/${postId}/comments`, { content: contentValue });
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      await load();
    } catch (e) {
      setError(e.response?.data?.message || '댓글 작성 실패');
    }
  };

  const updateComment = async (comment) => {
    const newValue = prompt('댓글 수정', comment.content);
    if (!newValue) return;

    try {
      setError('');
      await api.put(`/api/posts/comments/${comment.id}`, { content: newValue });
      await load();
    } catch (e) {
      setError(e.response?.data?.message || '댓글 수정 실패');
    }
  };

  const deleteComment = async (commentId) => {
    try {
      setError('');
      await api.delete(`/api/posts/comments/${commentId}`);
      await load();
    } catch (e) {
      setError(e.response?.data?.message || '댓글 삭제 실패');
    }
  };

  return (
    <section className="card">
      <h2>게시판 CRUD</h2>
      {error && <p className="error-text">{error}</p>}

      <input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={createPost}>게시글 작성</button>

      {posts.map((post) => (
        <article key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>{post.author_email}</small>
          <div className="row">
            <button onClick={() => updatePost(post)}>수정</button>
            <button onClick={() => deletePost(post.id)}>삭제</button>
          </div>

          <div className="comment-box">
            <input
              placeholder="댓글 입력"
              value={commentInputs[post.id] || ''}
              onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
            />
            <button onClick={() => createComment(post.id)}>댓글 등록</button>
          </div>

          {post.comments?.map((comment) => (
            <div key={comment.id} className="comment">
              <span>{comment.content}</span>
              <div className="row">
                <button onClick={() => updateComment(comment)}>수정</button>
                <button onClick={() => deleteComment(comment.id)}>삭제</button>
              </div>
            </div>
          ))}
        </article>
      ))}
    </section>
  );
}
