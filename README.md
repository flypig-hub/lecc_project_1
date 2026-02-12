# lecc_project_1

HTML/CSS/JS + React + Node.js + Git + AWS를 기반으로 한 **LECC 일본 IT SES 회사 제출용 포트폴리오** 프로토타입입니다.

## 구성

- **Node.js + Express API**: 프로필/프로젝트/기술스택 데이터 제공
- **React(브라우저 CDN)**: 단일 페이지 포트폴리오 UI 렌더링
- **HTML/CSS/JS**: 반응형 UI, 프로젝트 카드, 기술 스택 섹션 구성

## 실행 방법

```bash
npm install
npm start
```

실행 후 브라우저에서 `http://localhost:3000` 접속.

## AWS 배포(권장)

1. EC2 인스턴스 생성 후 Node.js 설치
2. Git으로 저장소 clone
3. `npm install && npm start`
4. 프로덕션 환경에서는 PM2/Nginx와 함께 운영
5. 정적 자산 분리 시 S3 + CloudFront 구성 가능

