function AwsSection({ aws }) {
  return (
    <section className="section">
      <div>
        <h2>Db (AWS)</h2>
        <p>AWS 배포/데이터 저장 전략입니다.</p>
      </div>
      <article className="card">
        <p>
          <strong>Runtime:</strong> {aws.runtime}
        </p>
        <p>
          <strong>Data Store:</strong> {aws.dataStore}
        </p>
        <p>
          <strong>Static Asset:</strong> {aws.staticAsset}
        </p>
        <p>
          <strong>CI/CD:</strong> {aws.cicd}
        </p>
      </article>
    </section>
  );
}
