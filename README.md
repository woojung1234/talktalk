# TalkTalk - 세대별 대화 주제 생성 AI Agent

> 세대 간 소통을 돕는 AI 기반 대화 주제 추천 앱

## 🎯 프로젝트 개요

TalkTalk은 다양한 세대 간 원활한 소통을 위해 상황에 맞는 대화 주제를 AI가 추천해주는 모바일 애플리케이션입니다.

### 주요 기능
- 세대별 맞춤 대화 주제 생성
- 상황별 스몰토크 주제 추천
- 실시간 트렌드 반영
- 센스있는 대화 시작 가이드

### 타겟 상황
- 20대 사회 초년생 ↔ 40대 선배/상사와의 대화
- 50대 ↔ 20대 간 세대 소통
- 모임에서의 스몰토크
- 비즈니스 네트워킹 상황

## 🛠 기술 스택

- **Frontend**: React Native (Expo)
- **AI**: OpenAI GPT API
- **언어**: JavaScript/TypeScript
- **배포**: Google Play Store (EAS Build)

## 📱 배포 준비 완료

### 배포 에셋
- ✅ [앱 아이콘 SVG](/assets/icon.svg) - 512x512 벡터 이미지
- ✅ [개인정보처리방침](/privacy-policy.html) - GitHub Pages 호스팅 가능
- ✅ [플레이스토어 설명](/docs/playstore-description.md) - 완전한 스토어 등록 정보
- ✅ [빌드 가이드](/docs/build-guide.md) - 상세한 배포 매뉴얼

### 배포 체크리스트
- ✅ EAS 빌드 설정 완료 (eas.json)
- ✅ 앱 메타데이터 설정 (app.json)
- ✅ 패키지명 설정 (com.woojung1234.talktalk)
- ✅ 개인정보처리방침 준비
- ✅ 플레이스토어 등록 정보 준비
- ⏳ PNG 아이콘 변환 (SVG → PNG 512x512)
- ⏳ 스플래시 이미지 생성 (1284x2778)

## 🚀 빠른 배포 가이드

### 1. 아이콘 준비
```bash
# SVG를 PNG로 변환 (온라인 도구 사용)
# assets/icon.svg → assets/icon.png (512x512)
# 스플래시 이미지도 생성 → assets/splash.png (1284x2778)
```

### 2. 환경 설정
```bash
# EAS CLI 설치
npm install -g @expo/eas-cli

# 로그인
eas login

# API 키 설정
eas secret:create --scope project --name OPENAI_API_KEY --value "your-api-key"
```

### 3. 빌드 및 배포
```bash
# 테스트 빌드
eas build --platform android --profile preview

# 프로덕션 빌드
eas build --platform android --profile production

# 플레이스토어 업로드
eas submit --platform android --profile production
```

## 📋 필요한 준비물

### Google Play Console
- [ ] 개발자 계정 등록 ($25)
- [ ] 서비스 계정 키 생성 (자동 업로드용)

### 개인정보처리방침 URL
```
https://woojung1234.github.io/talktalk/privacy-policy.html
```
*(GitHub Pages 활용 시)*

## 📅 개발 일정 (3주)

### 1주차: 프로젝트 설정 및 기본 구조 ✅
- [x] Expo 프로젝트 초기 설정
- [x] 네비게이션 구조 설계
- [x] UI/UX 디자인 시스템
- [x] GPT API 연동 준비

### 2주차: 핵심 기능 개발
- [ ] AI Agent 로직 구현
- [ ] 프롬프트 엔지니어링
- [ ] 사용자 인터페이스 구현
- [ ] 대화 주제 생성 기능

### 3주차: 완성 및 배포 🎯
- [x] 앱 아이콘 및 스플래시 스크린 디자인
- [x] 플레이 스토어 배포 준비
- [x] 배포 문서화
- [ ] 실제 배포

## 🚀 시작하기

```bash
# 프로젝트 클론
git clone https://github.com/woojung1234/talktalk.git
cd talktalk

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 OPENAI_API_KEY 추가

# 개발 서버 시작
npx expo start
```

## 📝 개발 진행 상황

- [x] 프로젝트 기본 구조 설정
- [x] 배포 준비 완료 (아이콘, 문서, 가이드)
- [ ] Expo 앱 초기화
- [ ] 핵심 기능 개발
- [ ] 플레이 스토어 배포

## 📚 문서

- [빌드 및 배포 가이드](/docs/build-guide.md)
- [플레이스토어 등록 정보](/docs/playstore-description.md)
- [개발 진행 상황](/DEVELOPMENT.md)

## 🔗 링크

- **개인정보처리방침**: [privacy-policy.html](/privacy-policy.html)
- **앱 아이콘**: [assets/icon.svg](/assets/icon.svg)
- **배포 문서**: [docs/](/docs/)

---

**💡 배포 팁**: 현재 기본 기능으로도 배포가 가능합니다. 먼저 Internal Testing으로 출시한 후 사용자 피드백을 받아 점진적으로 개선하는 것을 권장합니다!
