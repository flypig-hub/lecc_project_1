const { useEffect, useState } = React;

function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    async function load() {
      const [profileRes, projectsRes, skillsRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/projects'),
        fetch('/api/skills')
      ]);

      const [profileData, projectsData, skillsData] = await Promise.all([
        profileRes.json(),
        projectsRes.json(),
        skillsRes.json()
      ]);

      setProfile(profileData);
      setProjects(projectsData);
      setSkills(skillsData);
    }

    load();
  }, []);

  if (!profile) {
    return <div className="container loading">포트폴리오를 불러오는 중...</div>;
  }

  return (
    <main className="container">
      <section className="hero">
        <span className="badge">LECC / Japan IT SES 제출용</span>
        <h1>{profile.name}</h1>
        <h3>{profile.role}</h3>
        <p>{profile.summary}</p>
      </section>

      <section className="section">
        <SectionTitle
          title="핵심 프로젝트"
          subtitle="실무 적응력과 협업 역량을 강조한 샘플 프로젝트입니다."
        />
        <div className="grid">
          {projects.map((project) => (
            <article key={project.id} className="card">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="stack">
                {project.stack.map((item) => (
                  <span className="tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
              <p>
                <strong>성과:</strong> {project.result}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionTitle
          title="기술 스택"
          subtitle="요구 기술(HTML/CSS/JS, React, Node.js, Git, AWS) 중심으로 구성했습니다."
        />
        <div className="grid">
          {skills.map((group) => (
            <article key={group.category} className="card">
              <h3>{group.category}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="contact">
        <p>
          <strong>지원 포지션:</strong> {profile.target}
        </p>
        <p>
          <strong>Email:</strong> {profile.contact.email}
        </p>
        <p>
          <strong>GitHub:</strong>{' '}
          <a href={profile.contact.github} target="_blank" rel="noreferrer">
            {profile.contact.github}
          </a>
        </p>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
