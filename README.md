# MeetCycle Backend

로테이션 소개팅 서비스 MeetCycle의 백엔드 API 서버입니다.

## 기술 스택

- **프레임워크**: NestJS
- **데이터베이스**: MongoDB
- **인증**: JWT
- **배포**: Docker + GitHub Actions + Render

## 프로젝트 설정

```bash
# 의존성 설치
yarn install

# 개발 모드 실행
yarn start:dev

# 빌드
yarn build

# 프로덕션 모드 실행
yarn start:prod
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 만들고 다음 변수를 설정하세요:

```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meetcycle
FRONTEND_URL=http://localhost:3001
```

## 프로젝트 구조

```
src/
├── modules/           # 기능별 모듈
│   ├── user/          # 사용자 관련 모듈
│   ├── participant/   # 참가자 관련 모듈
│   ├── meeting/       # 미팅 관련 모듈
│   ├── cycle/         # 사이클 관련 모듈
│   └── round/         # 라운드 관련 모듈
├── config/            # 설정 파일
└── common/            # 공통 유틸리티 및 미들웨어
```

## API 문서

API 문서는 `/api-docs` 엔드포인트에서 확인할 수 있습니다.

## 배포 구성

이 프로젝트는 다음과 같이 CI/CD가 구성되어 있습니다:

- **Docker**: 애플리케이션 컨테이너화
- **GitHub Actions**: CI/CD 파이프라인 자동화
- **GitHub Container Registry**: 컨테이너 이미지 저장소
- **Render**: 호스팅 및 배포 플랫폼

## 배포 방법

자세한 배포 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md) 파일을 참조하세요.

## CI/CD 파이프라인

GitHub Actions를 통한 CI/CD 파이프라인이 자동화되어 있습니다:

1. **테스트**: 코드 품질 및 기능 테스트
2. **빌드**: Docker 이미지 빌드 및 GitHub Container Registry 푸시
3. **배포**: Render 서비스 자동 업데이트

## 라이센스

MIT
