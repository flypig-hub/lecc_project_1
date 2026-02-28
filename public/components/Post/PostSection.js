function PostSection({ posts, journey }) {
  return (
    <section id="post" className="section">
      <div>
        <h2>My Study Journey</h2>
        <p>요청하신 3번째 카드 스타일을 참고한 파스텔 저널 보드 형식입니다.</p>
      </div>

      <article className="journey-board">
        <header className="journey-header">
          <h3>{journey.title}</h3>
          <p>{journey.subtitle}</p>
        </header>

        <div className="journey-grid">
          <section className="journey-card peach">
            <h4>Today's Progress</h4>
            <p>
              <strong>Study Time:</strong> {journey.today.studyTime}
            </p>
            <p>
              <strong>Tasks Done:</strong> {journey.today.tasksDone}
            </p>
          </section>

          <section className="journey-card sand">
            <h4>My Goals</h4>
            <ul>
              {journey.currentGoals.map((goal) => (
                <li key={goal}>✅ {goal}</li>
              ))}
            </ul>
          </section>

          <section className="journey-card coral">
            <h4>To Do List</h4>
            <ul>
              {journey.todoList.map((todo) => (
                <li key={todo}>📝 {todo}</li>
              ))}
            </ul>
          </section>

          <section className="journey-card lavender">
            <h4>Daily Journal</h4>
            <p>
              오늘은 API 설계와 UI 일관성을 맞추는 작업에 집중했습니다. 컴포넌트 분리와 카드 스타일
              재사용 패턴을 문서화했습니다.
            </p>
          </section>
        </div>

        <footer className="journey-tabs">
          {journey.footerTabs.map((tab) => (
            <span key={tab} className="journey-tab">
              {tab}
            </span>
          ))}
        </footer>
      </article>

      <div className="section-inner">
        <h3>Code Post Gallery</h3>
        <div className="grid">
          {posts.boardPosts.map((post) => (
            <article key={post.id} className="card board-card">
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
