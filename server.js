const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

const profile = {
  name: 'LECC Portfolio Candidate',
  role: 'Full-Stack Web Developer',
  target: 'Japanese IT SES Company',
  summary:
    'HTML/CSS/JavaScript, React, Node.js를 기반으로 실무형 서비스를 구축하며, Git 기반 협업과 AWS 배포 운영 경험을 강화하고 있습니다.',
  contact: {
    email: 'candidate@example.com',
    github: 'https://github.com/your-id'
  }
};

const studyJourney = {
  title: 'Career Passport',
  subtitle: 'My Study Journey',
  today: {
    studyTime: '4 hrs',
    tasksDone: '5 / 6'
  },
  currentGoals: ['Learn UI Design', 'Practice Coding'],
  todoList: ['Update Blog Project', 'Sketch New Ideas', 'Watch Tutorial'],
  footerTabs: ['Journal', 'Skills', 'Projects']
};

const posts = {
  studyLogs: [
    {
      id: 'log-1',
      date: '2026-02-10',
      topic: 'Tokyo Neon UI 레퍼런스 분석',
      summary: 'Awwwards와 Dribbble 사례를 분석해 포트폴리오 메인 컬러/그라디언트 방향을 정리했습니다.'
    },
    {
      id: 'log-2',
      date: '2026-02-12',
      topic: 'React 컴포넌트 폴더 설계',
      summary: 'App/User/Post/Db 기능 단위 분리를 진행하고 각 섹션 재사용 기준을 문서화했습니다.'
    },
    {
      id: 'log-3',
      date: '2026-02-15',
      topic: 'Code Post UX 개선',
      summary: '코드 블록 대비, 가독성, 수평 스크롤 동작을 개선하여 기술 공유형 게시물 포맷을 확정했습니다.'
    }
  ],
  boardPosts: [
    {
      id: 'post-1',
      title: 'Creative Hero 컴포넌트 제작기',
      description: '브랜드 문구, CTA 버튼, 현황 패널을 포함한 메인 히어로 레이아웃 구현 사례입니다.',
      stack: ['React', 'CSS', 'UI/UX'],
      codeTitle: '히어로 액션 버튼 렌더링 예시',
      codeLanguage: 'jsx',
      codeSnippet:
        "<div className=\"hero-actions\">\n  <a className=\"hero-btn primary\" href=\"#post\">Post 보기</a>\n  <a className=\"hero-btn ghost\" href={profile.contact.github}>GitHub 이동</a>\n</div>"
    },
    {
      id: 'post-2',
      title: 'Study Log + Board Post 이중 포맷 API',
      description: '학습 로그와 게시물 데이터를 단일 `/api/posts`로 통합 제공하는 구조를 설명합니다.',
      stack: ['Node.js', 'REST API', 'Architecture'],
      codeTitle: '/api/posts 응답 스키마',
      codeLanguage: 'javascript',
      codeSnippet:
        "const posts = {\n  studyLogs: [...],\n  boardPosts: [...]\n};\n\nif (req.url === '/api/posts') sendJson(res, posts);"
    },
    {
      id: 'post-3',
      title: 'AWS 배포용 간단 CI 플로우',
      description: 'GitHub Actions에서 빌드 후 EC2로 배포하는 최소 플로우 구성 예시입니다.',
      stack: ['AWS EC2', 'GitHub Actions', 'Node.js'],
      codeTitle: 'deploy job 예시',
      codeLanguage: 'yaml',
      codeSnippet:
        'jobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run build'
    }
  ]
};

const skills = [
  {
    category: 'Front-end',
    items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React']
  },
  {
    category: 'Back-end',
    items: ['Node.js', 'REST API', 'Basic Server Routing']
  },
  {
    category: 'Collaboration',
    items: ['Git', 'GitHub Flow', 'Code Review']
  },
  {
    category: 'Cloud / Infra',
    items: ['AWS EC2', 'AWS S3', 'AWS CloudFront (학습 중)']
  }
];

const aws = {
  runtime: 'EC2 (Node.js)',
  dataStore: 'RDS MySQL 또는 DynamoDB',
  staticAsset: 'S3 + CloudFront',
  cicd: 'GitHub Actions -> EC2 Deploy'
};

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function sendJson(res, data) {
  res.writeHead(200, { 'Content-Type': mimeTypes['.json'] });
  res.end(JSON.stringify(data));
}

function serveStaticFile(req, res) {
  const safePath = path.normalize(req.url === '/' ? '/index.html' : req.url).replace(/^\.\.(\/|\\|$)/, '');
  const filePath = path.join(publicDir, safePath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': mimeTypes[ext] || 'application/octet-stream'
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/profile') {
    sendJson(res, profile);
    return;
  }

  if (req.url === '/api/study-journey') {
    sendJson(res, studyJourney);
    return;
  }

  if (req.url === '/api/posts') {
    sendJson(res, posts);
    return;
  }

  if (req.url === '/api/projects') {
    sendJson(res, posts.boardPosts);
    return;
  }

  if (req.url === '/api/skills') {
    sendJson(res, skills);
    return;
  }

  if (req.url === '/api/aws') {
    sendJson(res, aws);
    return;
  }

  serveStaticFile(req, res);
});

server.listen(port, () => {
  console.log(`Portfolio server is running on http://localhost:${port}`);
});
