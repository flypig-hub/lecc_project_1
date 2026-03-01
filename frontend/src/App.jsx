import AuthPanel from './components/AuthPanel';
import PostBoard from './components/PostBoard';

export default function App() {
  return (
    <main className="container">
      <h1>LECC Fullstack Portfolio</h1>
      <p>React + Express + PostgreSQL + JWT + Cloudflare Tunnel 설계</p>
      <AuthPanel />
      <PostBoard />
    </main>
  );
}
