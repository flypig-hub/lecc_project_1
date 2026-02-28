function UserSection({ profile }) {
  return (
    <section className="contact">
      <h2>User</h2>
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
  );
}
