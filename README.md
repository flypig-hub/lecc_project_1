# lecc_project_1

HTML/CSS/JS + React + Node.js + Git + AWS를 기반으로 한 **LECC 일본 IT SES 회사 제출용 포트폴리오** 프로토타입입니다.

## 구성

- **Node.js HTTP API**: 프로필/스터디저니/포스트/기술스택/AWS 구성 데이터 제공
- **React(CDN + Babel)**: 크리에이티브 메인페이지 + 포스트 스튜디오 UI 렌더링
- **Study Journey 보드**: 요청한 3번째 이미지 톤을 참고한 파스텔 저널 스타일 카드 레이아웃
- **Post 2가지 형식 지원**
  - Study Journey 카드형 학습 대시보드
  - Board Post 형식: 일반 게시물 + 코드 스니펫 게시 (갤러리 스타일)

## 실행 방법

```bash
npm start
```

실행 후 브라우저에서 `http://localhost:3000` 접속.

## npm start 이후 동작 흐름

1. `node server.js` 실행
2. `/` 접속 시 `public/index.html` 반환
3. 컴포넌트 스크립트(App/User/Post/Db) 로드
4. `public/app.js`에서 `/api/profile`, `/api/study-journey`, `/api/posts`, `/api/skills`, `/api/aws` 동시 fetch
5. Post 섹션에서 Study Journey 보드 + 코드형 게시물 렌더링

## AWS 배포(권장)

1. EC2 인스턴스 생성 후 Node.js 설치
2. Git으로 저장소 clone
3. `npm start`
4. 프로덕션 환경에서는 PM2/Nginx와 함께 운영
5. 정적 자산 분리 시 S3 + CloudFront 구성 가능
