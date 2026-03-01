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

const posts = {
  studyLogs: [
    {
      id: 'log-1',
      date: '2026-02-10',
      topic: 'Node.js 라우팅 구조 정리',
      summary: '정적 파일 라우팅과 API 라우팅 분리 방법을 학습하고 포트폴리오 서버에 적용했습니다.'
    },
    {
      id: 'log-2',
      date: '2026-02-12',
      topic: 'React 컴포넌트 폴더 설계',
      summary: 'App/User/Post/Db 기능 단위로 분리하여 유지보수성을 높이는 패턴을 정리했습니다.'
    }
  ],
  boardPosts: [
    {
      id: 'post-1',
      title: 'API 응답 표준화 경험 공유',
      description: 'SES 현장에서 재사용 가능한 JSON 응답 형식을 만들어 협업 속도를 높인 사례입니다.',
      stack: ['Node.js', 'REST API', 'Git'],
      codeTitle: '응답 포맷 헬퍼 예시',
      codeLanguage: 'javascript',
      codeSnippet: "function ok(data) {\n  return { success: true, data };\n}\n\nfunction fail(message) {\n  return { success: false, message };\n}"
    },
    {
      id: 'post-2',
      title: 'React 데이터 패칭 최적화 노트',
      description: 'Promise.all 기반 병렬 요청으로 초기 로딩 시간을 줄인 게시물입니다.',
      stack: ['React', 'JavaScript'],
      codeTitle: '병렬 패칭 예시',
      codeLanguage: 'javascript',
      codeSnippet:
        "const [profileRes, postsRes] = await Promise.all([\n  fetch('/api/profile'),\n  fetch('/api/posts')\n]);"
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
