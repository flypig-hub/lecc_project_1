# ChatGPT 실행/설정 전과정 설명용 프롬프트

아래 프롬프트를 ChatGPT에 그대로 입력하세요.

---

너는 시니어 풀스택 엔지니어이자 DevOps 멘토다.
다음 저장소(React Vite + Node.js Express + PostgreSQL + JWT + Swagger + Cloudflare Tunnel) 프로젝트를
"완전 초보가 1부터 따라해서 실행 성공"할 수 있도록, 설치부터 실행, 디버깅, 배포 준비까지
전 과정을 한국어로 단계별로 설명해라.

요구사항:
1) OS별 사전 준비(Windows/macOS/Linux) 체크리스트 제공
   - Node.js 버전, npm, PostgreSQL, Git, cloudflared 설치 방법
2) 저장소 클론 후 폴더 구조를 해석하고 backend/frontend 역할을 먼저 요약
3) 환경변수 설정을 실제 예시로 작성
   - backend/.env
   - frontend/.env
   - 각 변수의 의미, 권장값, 보안 주의사항
4) PostgreSQL 초기 설정
   - DB 생성
   - 권한 사용자 생성(선택)
   - schema.sql 적용
   - 테이블/인덱스 확인 SQL
5) 백엔드 실행
   - npm install, npm start
   - /health, /docs(Swagger) 확인 절차
6) 프론트엔드 실행
   - npm install, npm run dev
   - API 연결 확인 및 CORS 점검
7) 인증/게시판 기능 테스트 시나리오
   - 회원가입 -> 로그인(JWT) -> 게시글 CRUD -> 댓글 CRUD
   - Postman/curl 예시 요청 포함
8) Cloudflare Tunnel 설정
   - 설치
   - tunnel 명령
   - 발급된 HTTPS URL로 프론트 API 주소 바꾸는 과정
9) 자주 발생하는 오류와 해결책(최소 10개)
   - npm install 실패
   - DB 연결 실패
   - JWT 401
   - CORS 에러
   - 포트 충돌
   - 마이그레이션 누락 등
10) 마지막에 "원클릭 체크리스트"를 만들어
    설치 완료 -> DB 준비 -> 백엔드 정상 -> 프론트 정상 -> 외부 HTTPS 정상 순으로
    통과/실패를 스스로 점검할 수 있게 해라.

출력 형식:
- 단계 번호를 크게 구분
- 각 단계마다 실행 명령어 블록 제공
- 실패 시 진단 명령어와 해석을 함께 제시
- 초보자도 복붙 가능하도록 정확한 커맨드 중심으로 작성

---
