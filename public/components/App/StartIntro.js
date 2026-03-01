function StartIntro({ profile }) {
  return (
    <section className="hero">
      <span className="badge">LECC / Japan IT SES 제출용</span>
      <h1>{profile.name}</h1>
      <h3>{profile.role}</h3>
      <p>{profile.summary}</p>
    </section>
  );
}
