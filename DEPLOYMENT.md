# 배포 가이드

## 사전 준비

### 1. GitHub 설정
- GitHub Repository 생성
- GitHub Secrets에 다음 시크릿 추가:
  - `RENDER_SERVICE_ID`: Render 서비스 ID
  - `RENDER_API_KEY`: Render API 키

### 2. GitHub Container Registry 설정
- GitHub Repository 설정 > Packages > 패키지 권한 설정
- GitHub Actions에서 패키지를 읽고 쓸 수 있도록 설정

### 3. Render 설정

#### 3.1 Render 계정 생성 및 로그인
1. [Render](https://render.com)에서 계정 생성 및 로그인

#### 3.2 웹 서비스 생성
1. Render 대시보드에서 "New Web Service" 선택
2. "Build and deploy from a Git repository" 선택
3. GitHub 저장소 연결
4. 서비스 이름을 "meetcycle-backend"로 설정
5. 환경 선택: "Docker"
6. 플랜 선택: "Free" 또는 필요에 따라 유료 플랜 선택
7. "Create Web Service" 클릭

#### 3.3 환경 변수 설정
1. 서비스 대시보드에서 "Environment" 탭 선택
2. 다음 환경 변수 추가:
   - `MONGODB_URI`: MongoDB 연결 URI (Secret)
   - `PORT`: 3000
   - `FRONTEND_URL`: 프론트엔드 URL

#### 3.4 API 키 및 서비스 ID 가져오기
1. Render 대시보드에서 Account Settings > API Keys로 이동하여 API 키 생성
2. 서비스 대시보드에서 서비스 ID 확인

## Docker 이미지 로컬 테스트

```bash
# 이미지 빌드
docker build -t meetcycle-backend .

# 이미지 실행
docker run -p 3000:3000 --env-file .env meetcycle-backend
```

## CI/CD 파이프라인

GitHub Actions를 통해 자동화된 CI/CD 파이프라인이 구성되어 있습니다:

1. **테스트 단계 (Test)**: 
   - 코드를 체크아웃하고 의존성 설치
   - 테스트 실행

2. **빌드 단계 (Build)**:
   - Docker 이미지 빌드
   - GitHub Container Registry에 이미지 푸시

3. **배포 단계 (Deploy)**:
   - Render 서비스에 배포 트리거

## 배포 흐름

1. 코드 변경 및 테스트
2. GitHub 메인 브랜치에 Push 또는 PR 머지
3. GitHub Actions가 자동으로 테스트, 빌드, 배포 실행
4. Render에서 최신 Docker 이미지로 서비스 업데이트

## 수동 배포 방법

1. Render 대시보드에서 해당 서비스 선택
2. "Manual Deploy" 버튼 클릭
3. "Clear build cache & deploy" 선택

## 모니터링 및 로그

- Render 대시보드에서 서비스 로그, 매트릭스, 이벤트 확인 가능
- "Logs" 탭에서 실시간 로그 확인 가능

## 문제 해결

- **MongoDB 연결 오류**: 환경 변수에 MONGODB_URI가 올바르게 설정되었는지 확인
- **배포 실패**: Render 로그에서 배포 단계 오류 확인
- **CI/CD 파이프라인 오류**: GitHub Actions 워크플로우 로그 확인
- **컨테이너 실행 오류**: Render 로그에서 애플리케이션 시작 오류 확인

## 보안 고려사항

### 민감한 환경 변수 관리

1. **Secret으로 설정**: MongoDB URI와 API 키와 같은 민감한 정보는 항상 Render 대시보드에서 Secret으로 설정하세요.

2. **환경 변수 노출 방지**:
   - Render 대시보드의 "Environment" 탭에서 환경 변수를 추가할 때 "Secret" 옵션을 선택하세요.
   - render.yaml 파일에 민감한 환경 변수의 실제 값을 포함하지 마세요.
   - 로그에 민감한 정보가 출력되지 않도록 애플리케이션 코드를 검토하세요.

3. **접근 제어**:
   - Render 대시보드 접근 권한을 제한하세요.
   - 팀원들에게 필요한 최소한의 권한만 부여하세요.
