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

const projects = [
  {
    id: 1,
    title: '案件管理ダッシュボード',
    stack: ['React', 'Node.js', 'REST API', 'AWS EC2'],
    description:
      'SES 프로젝트 배정, 일정, 상태를 한 눈에 파악할 수 있는 대시보드. API 기반 구조와 컴포넌트 분리를 적용했습니다.',
    result: '업무 현황 확인 시간을 30% 단축'
  },
  {
    id: 2,
    title: 'エンジニアスキル可視化ツール',
    stack: ['JavaScript', 'React', 'AWS S3'],
    description:
      '엔지니어별 기술 스택과 프로젝트 이력을 시각화하여 배치 적합도를 빠르게 확인하도록 설계했습니다.',
    result: '배치 의사결정 리드타임 단축'
  },
  {
    id: 3,
    title: '業務報告自動化ミニサービス',
    stack: ['Node.js', 'REST API', 'GitHub Actions'],
    description:
      '주간 업무 보고 템플릿을 자동 생성하는 내부 도구. 반복 작업을 자동화하고 코드 리뷰 프로세스를 표준화했습니다.',
    result: '보고서 작성 시간 40% 절감'
  }
];

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

  if (req.url === '/api/projects') {
    sendJson(res, projects);
    return;
  }

  if (req.url === '/api/skills') {
    sendJson(res, skills);
    return;
  }

  serveStaticFile(req, res);
});

server.listen(port, () => {
  console.log(`Portfolio server is running on http://localhost:${port}`);
});
