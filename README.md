# TalkTalk 📱💬

소통의 새로운 경험을 제공하는 모바일 앱

## 🚀 새로운 기능 업데이트 (v2.0.0)

### 🌤️ 오늘의 날씨 톡 (신규)
- **실시간 날씨 연동**: 기상청 단기예보 조회서비스 API 활용
- **날씨 기반 대화 주제**: 현재 날씨 상황에 맞는 맞춤형 대화 추천
- **동적 주제 생성**: 온도, 강수량, 습도 등을 고려한 지능형 추천 시스템

### 💕 연애 코치 톡 (신규)
- **단계별 가이드**: 첫 만남부터 장기 연애까지 5단계 세분화
- **상황별 대화법**: 아이스브레이커, 깊은 대화, 플러팅, 갈등 해결, 로맨틱
- **실전 예시**: 각 단계별 실제 사용 가능한 대화 예시 제공
- **팁 & 주의사항**: 관계 발전을 위한 조언과 피해야 할 행동 가이드

### 👥 관계별 대화 (통합 개선)
- **4가지 관계 통합**: 세대별, 직장 내, 모임 & 네트워킹, 가족 간 대화
- **상황별 전략**: 회의, 갈등, 축하 등 특수 상황 대응법
- **문화적 고려**: 한국 문화 특성을 반영한 대화법
- **계층별 소통**: 상하관계, 동료관계 등 위치에 따른 차별화된 접근

## 📁 프로젝트 구조

```
talktalk/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js              # 메인 화면 (업데이트)
│   │   ├── ConversationGeneratorScreen.js  # 기존 대화 생성
│   │   ├── WeatherTalkScreen.js       # 날씨 기반 대화 (신규)
│   │   ├── LoveCoachScreen.js         # 연애 코치 (신규)
│   │   └── ResultScreen.js            # 결과 화면
│   └── services/
│       ├── ConversationAI.js          # 기존 AI 서비스
│       ├── WeatherService.js          # 기상청 API 서비스 (신규)
│       ├── LoveCoachService.js        # 연애 코치 서비스 (신규)
│       └── RelationshipConversationService.js  # 관계별 대화 서비스 (신규)
├── assets/
│   ├── icon.png                       # 앱 아이콘 (512×512px)
│   ├── adaptive-icon.png              # 안드로이드 적응형 아이콘
│   ├── splash.png                     # 스플래시 스크린
│   └── icons/                         # 추가 아이콘 에셋
└── README.md
```

## 🎨 앱 아이콘 및 에셋

### 준비 완료된 에셋
- ✅ **앱 아이콘**: `assets/icon.png` (512×512px)
- ✅ **적응형 아이콘**: `assets/adaptive-icon.png` (안드로이드용)
- ✅ **스플래시 스크린**: `assets/splash.png`
- ✅ **SVG 원본**: `TalkTalk 앱 아이콘 SVG.svg`

### 디자인 특징
- 💬 말풍선을 활용한 소통 테마
- 🎨 인디고-보라 그라데이션 (#6366f1 → #8b5cf6)
- ✨ 3개의 말풍선으로 다양한 대화 표현
- 🌈 각 말풍선 내부 텍스트 라인 표시

## 🛠️ 새로운 서비스 아키텍처

### WeatherService.js
```javascript
// 기상청 단기예보 조회서비스 API 활용
- getCurrentWeather(city): 현재 날씨 정보 조회
- getWeatherForecast(city): 단기 예보 정보 조회
- generateWeatherTopics(weatherData): 날씨 기반 대화 주제 생성
```

### LoveCoachService.js
```javascript
// 연애 단계별 맞춤 가이드 제공
- generateLoveTopics(stage, type): 단계별 대화 주제 생성
- getEmergencyTopics(situation): 응급 상황 대화법
- getLocationBasedTopics(location): 데이트 장소별 주제
```

### RelationshipConversationService.js
```javascript
// 다양한 관계에서의 소통법 제공
- generateRelationshipTopics(type, mode): 관계별 대화 생성
- getSituationStrategy(situation): 상황별 전략
```

## 🚀 개발 환경 설정

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 기상청 API 키 설정
WEATHER_API_KEY=your_kma_api_key_here

# 개발 서버 실행
npm start

# 프로덕션 빌드 (Android App Bundle)
eas build --platform android --profile production
```

## 🔧 API 연동 가이드

### 기상청 API 설정
1. [공공데이터포털](https://data.go.kr)에서 계정 생성
2. "기상청_단기예보 조회서비스" 신청 및 승인
3. 발급받은 서비스키를 환경변수에 설정

### 지원 도시 좌표
- 서울: (60, 127) | 부산: (98, 76) | 대구: (89, 90)
- 인천: (55, 124) | 광주: (58, 74) | 대전: (67, 100)
- 울산: (102, 84) | 세종: (66, 103) | 제주: (52, 38)

## 📱 플레이스토어 배포 준비

### 현재 상태
- ✅ 앱 아이콘 512×512px PNG
- ✅ 적응형 아이콘 PNG
- ✅ 버전 정보 동기화 (v2.0.0, versionCode: 3)
- ✅ EAS Build 설정 완료
- ✅ 새로운 기능 구현 완료

### 추가 필요 사항
- [ ] 스크린샷 (폰/태블릿)
- [ ] 앱 설명 및 키워드 업데이트
- [ ] 개인정보 처리방침 검토

## 🎯 브랜딩 가이드

### 컬러 팔레트
- **Primary**: #6366f1 (인디고)
- **Secondary**: #8b5cf6 (보라)
- **Accent**: #a855f7 (밝은 보라)
- **Weather**: #00d2ff → #3a7bd5 (하늘색 그라데이션)
- **Love**: #ff6b9d → #c44569 (핑크 그라데이션)

## 🔄 업데이트 내역

### v2.0.0 (2025.06.17) - 현재 버전
- ✨ **신규**: 오늘의 날씨 톡 - 기상청 API 연동
- ✨ **신규**: 연애 코치 톡 - 단계별 연애 가이드
- 🔀 **통합**: 4개 관계 카테고리를 1개로 효율화
- 🎨 **개선**: 메인 화면 UI/UX 대폭 개선
- 📱 **추가**: 실시간 날씨 정보 표시
- 💡 **향상**: AI 기반 맞춤 대화 주제 생성
- 🔧 **업데이트**: 앱 아이콘 리디자인

### v1.1.0 (2025.06.10)
- 🐛 버그 수정 및 안정성 향상
- 🎨 UI 개선

### v1.0.0 (2025.06.01)
- 🎉 초기 버전 출시
- 📱 기본 대화 주제 생성 기능

## 🛠️ 기술 스택

### Frontend
- **React Native**: 크로스 플랫폼 모바일 앱
- **Expo**: 개발 환경 및 빌드 도구
- **React Navigation**: 화면 네비게이션
- **Expo Linear Gradient**: 그라데이션 UI

### Backend Services
- **기상청 Open API**: 실시간 날씨 데이터
- **Custom AI Services**: 대화 주제 생성 로직

### Development Tools
- **EAS Build**: 프로덕션 빌드
- **Git**: 버전 관리
- **GitHub**: 코드 저장소

## 🔒 개인정보 처리방침

TalkTalk은 사용자의 개인정보를 수집하지 않습니다:
- 위치 정보: 날씨 서비스를 위한 도시 선택만 저장 (로컬)
- 대화 내용: 기기 내부에만 저장, 외부 전송 없음
- 분석 데이터: 개인 식별 불가능한 사용 통계만 수집

자세한 내용은 `privacy-policy.html` 파일을 참조하세요.

---

🔧 **개발자**: woojung1234  
📅 **최근 업데이트**: 2025년 6월 17일  
🏷️ **버전**: 2.0.0  
📄 **라이선스**: MIT License