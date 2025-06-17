# TalkTalk 개발 가이드 v2.0

## 🚀 빠른 시작

### 1. 프로젝트 설정

```bash
# 레포지토리 클론
git clone https://github.com/woojung1234/talktalk.git
cd talktalk

# 의존성 설치
npm install

# Expo CLI 설치 (글로벌)
npm install -g expo-cli @expo/cli

# EAS CLI 설치 (배포용)
npm install -g eas-cli
```

### 2. 환경 설정

```bash
# .env 파일 생성
cp .env.example .env

# 환경변수 설정
# .env 파일에서 다음 항목들을 실제 값으로 변경:
# - WEATHER_API_KEY: 기상청 API 키
# - DEFAULT_CITY: 기본 도시 (선택사항)
```

### 3. 개발 서버 실행

```bash
# Expo 개발 서버 시작
npx expo start

# 또는
npm start
```

## ✨ v2.0 새로운 기능

### 🌤️ 오늘의 날씨 톡
```javascript
// 실시간 날씨 기반 대화 주제 생성
const weatherService = new WeatherService(WEATHER_API_KEY);
const topics = await weatherService.getCurrentWeather('서울');
```

### 💕 연애 코치 톡
```javascript
// 단계별 연애 가이드
const loveCoach = new LoveCoachService();
const guide = loveCoach.generateLoveTopics('some', 'flirting');
```

### 👥 관계별 대화 (통합)
```javascript
// 통합된 관계별 대화 서비스
const relationshipService = new RelationshipConversationService();
const topics = relationshipService.generateRelationshipTopics('workplace', 'professional');
```

## 🔧 핵심 기능 구현 상태

### ✅ v2.0에서 완료된 기능
- [x] 기상청 API 연동 서비스
- [x] 실시간 날씨 기반 대화 주제 생성
- [x] 연애 코치 서비스 (5단계 세분화)
- [x] 관계별 대화 서비스 통합
- [x] WeatherTalkScreen 구현
- [x] LoveCoachScreen 구현
- [x] 새로운 홈 화면 UI/UX
- [x] 네비게이션 스택 업데이트
- [x] Mock 데이터 시스템
- [x] 에러 처리 강화

### ✅ v1.0에서 완료된 기능
- [x] 프로젝트 기본 구조
- [x] 네비게이션 설정
- [x] 홈 화면 (상황별 카드)
- [x] 대화 생성 폼 화면
- [x] 결과 표시 화면
- [x] 기본 AI 서비스 구조
- [x] UI/UX 디자인 시스템
- [x] 애니메이션 효과

### 🚧 진행 중인 작업
- [ ] 추가 날씨 패턴 대화 주제
- [ ] 연애 코치 응급 상황 가이드
- [ ] 오프라인 모드 지원
- [ ] 사용자 피드백 시스템

### 📱 배포 준비 작업
- [x] 앱 아이콘 및 브랜딩
- [x] 플레이 스토어 메타데이터
- [ ] 앱 서명 및 보안 설정
- [ ] 최종 성능 최적화

## 🔑 중요한 API 설정

### 1. 기상청 API 키 설정
```bash
# 1. https://data.go.kr 회원가입
# 2. "기상청_단기예보 조회서비스" 신청
# 3. .env 파일에 키 설정
WEATHER_API_KEY=your_actual_weather_api_key_here
```

### 2. 환경별 설정
```javascript
// 개발 환경
WEATHER_API_KEY=development_key
USE_MOCK_DATA=false

// 프로덕션 환경
WEATHER_API_KEY=production_key
USE_MOCK_DATA=false
```

## 📅 v2.0 개발 완료 및 다음 단계

### v2.0 완료사항 ✅
- 기상청 API 완전 연동
- 연애 코치 시스템 구축
- 관계별 대화 통합
- 새로운 UI/UX 구현
- 네비게이션 시스템 업데이트

### v2.1 계획 (다음 단계)
- [ ] 추가 도시 지원 확장
- [ ] 연애 코치 MBTI 연동
- [ ] 대화 히스토리 기능
- [ ] 사용자 설정 저장
- [ ] 푸시 알림 (날씨 변화시)

### v3.0 장기 계획
- [ ] AI 개인화 학습
- [ ] 소셜 기능 (대화 주제 공유)
- [ ] 다국어 지원
- [ ] 웹 버전 출시

## 🛠 개발 도구 및 명령어

### 개발
```bash
# 개발 서버 시작
npm start

# 안드로이드 에뮬레이터
npm run android

# iOS 시뮬레이터 (Mac에서만)
npm run ios

# 웹 브라우저
npm run web
```

### 디버깅
```bash
# 로그 확인
npx react-native log-android
npx react-native log-ios

# 캐시 클리어
npx expo start --clear
```

### 빌드 및 배포
```bash
# EAS 프로젝트 설정
eas login
eas init

# 안드로이드 빌드 (AAB)
eas build --platform android

# iOS 빌드 (IPA)
eas build --platform ios

# 플레이 스토어 제출
eas submit --platform android
```

## 📋 플레이 스토어 출시 체크리스트

### 앱 정보
- [x] 앱 이름: TalkTalk
- [x] 패키지명: com.woojung1234.talktalk  
- [x] 카테고리: 라이프스타일
- [x] 연령 등급: 전체 이용가
- [x] 버전: 2.0.0

### 필요한 자산
- [x] 앱 아이콘 (512x512 PNG)
- [x] 기능 그래픽 (1024x500 PNG)
- [ ] 스크린샷 (최소 2장, 최대 8장)
- [x] 앱 설명 (한국어, 영어)
- [x] 개인정보처리방침 URL

### 기술적 요구사항
- [x] Target SDK 34 (Android 14)
- [x] 64비트 지원
- [ ] 앱 서명 키
- [ ] AAB 파일 업로드

## 🎯 핵심 기능 상세 설명

### 1. 실시간 날씨 기반 대화 (신규)
- 기상청 공공데이터 API 활용
- 온도, 강수량, 습도별 맞춤 주제
- 시간대별 Mock 데이터 제공 (API 오류시)
- 9개 주요 도시 지원

### 2. 연애 코치 시스템 (신규)
- 5단계 관계 발전 과정
- 5가지 대화 유형 분류
- 실전 예시 및 팁 제공
- 단계별 주의사항 안내

### 3. 관계별 대화 통합 (개선)
- 세대별, 직장, 모임, 가족 → 하나로 통합
- 상황별 전략 가이드
- 문화적 특성 고려
- 계층별 소통법 제공

### 4. 향상된 UI/UX (개선)
- 기능별 차별화된 색상
- 실시간 정보 표시
- 부드러운 애니메이션
- 직관적인 네비게이션

## 🔍 코드 구조

### 새로운 서비스들
```
src/services/
├── WeatherService.js          # 기상청 API 연동
├── LoveCoachService.js        # 연애 코치 로직
├── RelationshipConversationService.js  # 관계별 대화
└── ConversationAI.js          # 기존 AI 서비스
```

### 새로운 화면들
```
src/screens/
├── WeatherTalkScreen.js       # 날씨 기반 대화
├── LoveCoachScreen.js         # 연애 코치
├── HomeScreen.js              # 업데이트된 메인
├── ConversationGeneratorScreen.js  # 기존
└── ResultScreen.js            # 기존
```

## 🐛 트러블슈팅

### 일반적인 문제들

1. **날씨 API 에러**
```javascript
// WeatherService에서 자동으로 Mock 데이터로 대체
// 로그에서 "Using mock weather data" 확인
```

2. **네비게이션 에러**
```javascript
// App.js에서 모든 스크린이 등록되었는지 확인
// 화면 이름이 정확한지 확인
```

3. **빌드 에러**
```bash
# 캐시 클리어 후 재시도
npx expo start --clear
npm install
```

## 📊 성능 최적화

### 현재 최적화 사항
- Lazy loading 구현
- 이미지 최적화
- 애니메이션 최적화
- API 호출 캐싱

### 추가 최적화 계획
- [ ] Bundle 분석 및 최적화
- [ ] 메모리 사용량 최적화
- [ ] 배터리 사용량 최적화

이제 TalkTalk v2.0이 완전히 구현되었습니다! 🎉