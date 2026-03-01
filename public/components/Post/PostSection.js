function PostSection({ posts }) {
  return (
    <section className="section">
      <div>
        <h2>Post</h2>
        <p>공부 기록(로그) + 게시물(코드 포함) 두 가지 형식으로 운영합니다.</p>
      </div>

      <div className="section-inner">
        <h3>1) Study Log 형식</h3>
        <div className="grid">
          {posts.studyLogs.map((log) => (
            <article key={log.id} className="card">
              <p>
                <strong>{log.date}</strong>
              </p>
              <h3>{log.topic}</h3>
              <p>{log.summary}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="section-inner">
        <h3>2) Board Post 형식 (코드 게시 가능)</h3>
        <div className="grid">
          {posts.boardPosts.map((post) => (
            <article key={post.id} className="card">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <div className="stack">
                {post.stack.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <p>
                <strong>{post.codeTitle}</strong>
              </p>
              <pre className="code-block">
                <code>{post.codeSnippet}</code>
              </pre>
              <p className="code-lang">language: {post.codeLanguage}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
