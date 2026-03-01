# LECC Fullstack Portfolio (React + Express + PostgreSQL)

실무 제출용 포트폴리오 구조로 작성된 풀스택 프로젝트입니다.

## 1) 전체 프로젝트 구조 트리

```text
.
├── backend
│   ├── .env.example
│   ├── package.json
│   ├── sql
│   │   └── schema.sql
│   └── src
│       ├── app.js
│       ├── server.js
│       ├── config
│       │   ├── db.js
│       │   └── env.js
│       ├── controllers
│       │   ├── authController.js
│       │   ├── commentController.js
│       │   └── postController.js
│       ├── docs
│       │   └── swagger.js
│       ├── middlewares
│       │   ├── authMiddleware.js
│       │   ├── errorMiddleware.js
│       │   └── validateMiddleware.js
│       ├── repositories
│       │   ├── commentRepository.js
│       │   ├── postRepository.js
│       │   └── userRepository.js
│       ├── routes
│       │   ├── authRoutes.js
│       │   └── postRoutes.js
│       ├── services
│       │   ├── authService.js
│       │   ├── commentService.js
│       │   └── postService.js
│       └── utils
│           ├── asyncHandler.js
│           └── httpError.js
├── frontend
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src
│       ├── App.jsx
│       ├── main.jsx
│       ├── styles.css
│       ├── api
│       │   └── client.js
│       ├── components
│       │   ├── AuthPanel.jsx
│       │   └── PostBoard.jsx
│       └── context
│           └── AuthContext.jsx
└── package.json
```

## 2) DB 스키마 SQL

`backend/sql/schema.sql` 참고

- users / posts / comments
- 모든 FK는 `ON DELETE CASCADE`
- 인덱스 포함

## 3) 아키텍처

```text
React (Vite)
  -> HTTPS (Cloudflare Tunnel)
  -> Express API (localhost:3000)
  -> PostgreSQL (127.0.0.1:5432 only)
```

- DB는 백엔드에서만 접근
- CORS는 프론트 URL만 허용
- JWT + bcrypt + parameterized query 사용

## 4) ERD 설명

- users(1) : posts(N)
- users(1) : comments(N)
- posts(1) : comments(N)
- posts 삭제 시 comments 자동 cascade
- users 삭제 시 posts/comments cascade

## 5) 실행 순서 가이드

### Backend

```bash
cd backend
cp .env.example .env
npm install
psql -U postgres -d lecc_portfolio -f sql/schema.sql
npm start
```

- Swagger: `http://localhost:3000/docs`
- Health: `http://localhost:3000/health`

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

- Frontend: `http://localhost:5173`

## 6) Cloudflare Tunnel 연결 가이드

1. cloudflared 설치 (mac)

```bash
brew install cloudflare/cloudflare/cloudflared
```

2. 로컬 API를 HTTPS로 노출

```bash
cloudflared tunnel --url http://localhost:3000
```

3. 출력된 `https://xxxx.trycloudflare.com` URL 확인
4. 프론트 `.env`의 `VITE_API_BASE_URL`을 해당 URL로 변경

## 7) GitHub Pages 배포 가이드 (Frontend)

```bash
cd frontend
npm install
npm run build
```

- 생성된 `dist/`를 `gh-pages` 브랜치에 배포
- API URL은 `VITE_API_BASE_URL`로 관리

## 8) 보안 설계 요약

- `.env`로 민감 정보 분리
- JWT 인증 미들웨어
- bcrypt 해시 저장
- SQL Injection 방지: `$1`, `$2` 파라미터 바인딩
- 작성자 권한 검증 (게시글/댓글)
- 글로벌 에러 핸들러 + 상태코드 구분
- DB host는 `127.0.0.1` 기본값


## 9) 릴리스

- 최신 디버깅 릴리스: `v1.0.1 (debug-fix)`
- 변경사항: `RELEASE_NOTES.md` 참고

## 10) ChatGPT 실행 가이드 프롬프트

- 파일: `docs/CHATGPT_EXECUTION_PROMPT.md`
- 목적: 설치/설정/실행/디버깅/Cloudflare Tunnel 연결까지 1부터 설명받기 위한 프롬프트
