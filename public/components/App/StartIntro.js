function StartIntro({ profile }) {
  return (
    <section className="hero hero-creative">
      <div className="hero-content">
        <span className="badge">LECC / Japan IT SES 제출용</span>
        <h1>{profile.name}</h1>
        <h3>{profile.role}</h3>
        <p>{profile.summary}</p>
        <div className="hero-actions">
          <a className="hero-btn primary" href="#post">Post 보기</a>
          <a className="hero-btn ghost" href={profile.contact.github} target="_blank" rel="noreferrer">
            GitHub 이동
          </a>
        </div>
      </div>

      <div className="hero-panel">
        <p className="panel-title">Now Building</p>
        <ul>
          <li>🎨 Creative Frontend 경험</li>
          <li>🧠 학습 로그 자동 정리</li>
          <li>💻 코드 스니펫 공유형 포스트</li>
          <li>☁️ AWS 배포 파이프라인</li>
        </ul>
      </div>
    </section>
  );
}
