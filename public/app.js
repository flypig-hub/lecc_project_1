const { useEffect, useState } = React;

function SkillSection({ skills }) {
  return (
    <section className="section">
      <div>
        <h2>Skills</h2>
        <p>요구 기술(HTML/CSS/JS, React, Node.js, Git, AWS) 중심 구성</p>
      </div>
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
  );
}

function App() {
  const [profile, setProfile] = useState(null);
  const [journey, setJourney] = useState(null);
  const [posts, setPosts] = useState({ studyLogs: [], boardPosts: [] });
  const [skills, setSkills] = useState([]);
  const [aws, setAws] = useState(null);

  useEffect(() => {
    async function load() {
      const [profileRes, journeyRes, postsRes, skillsRes, awsRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/study-journey'),
        fetch('/api/posts'),
        fetch('/api/skills'),
        fetch('/api/aws')
      ]);

      const [profileData, journeyData, postsData, skillsData, awsData] = await Promise.all([
        profileRes.json(),
        journeyRes.json(),
        postsRes.json(),
        skillsRes.json(),
        awsRes.json()
      ]);

      setProfile(profileData);
      setJourney(journeyData);
      setPosts(postsData);
      setSkills(skillsData);
      setAws(awsData);
    }

    load();
  }, []);

  if (!profile || !aws || !journey) {
    return <div className="container loading">포트폴리오를 불러오는 중...</div>;
  }

  return (
    <main className="container">
      <StartIntro profile={profile} />
      <PostSection posts={posts} journey={journey} />
      <SkillSection skills={skills} />
      <AwsSection aws={aws} />
      <UserSection profile={profile} />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
