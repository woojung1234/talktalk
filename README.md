# TalkTalk 📱💬

소통의 새로운 경험을 제공하는 모바일 앱

## 🚀 새로운 기능 업데이트 (v2.0)

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
│   ├── icons/
│   │   └── talktalk_icon.svg          # 메인 앱 아이콘 (SVG)
│   └── tools/
│       ├── icon_converter.html        # SVG→PNG 변환 도구
│       └── feature_graphic_generator.html  # 그래픽 이미지 생성 도구
└── README.md
```

## 🎨 아이콘 및 그래픽 에셋

### 앱 아이콘
- **파일**: `assets/icons/talktalk_icon.svg`
- **크기**: 512×512px (벡터)
- **용도**: 구글 플레이 콘솔 앱 아이콘
- **특징**: 말풍선을 활용한 소통 테마 디자인

### 변환 도구들

#### 1. 아이콘 변환기 (`assets/tools/icon_converter.html`)
- SVG 아이콘을 PNG로 변환
- 다양한 크기 지원 (96px, 144px, 192px, 512px)
- 구글 플레이 콘솔 요구사항 준수
- 브라우저에서 바로 실행 가능

#### 2. 그래픽 이미지 생성기 (`assets/tools/feature_graphic_generator.html`)
- 구글 플레이 콘솔용 그래픽 이미지 (1024×500px) 생성
- 실시간 미리보기
- 커스터마이징 가능한 텍스트, 색상, 레이아웃
- PNG 형식으로 다운로드

## 🛠️ 새로운 서비스 아키텍처

### WeatherService.js
```javascript
// 기상청 단기예보 조회서비스 API 활용
- getCurrentWeather(city): 현재 날씨 정보 조회
- getWeatherForecast(city): 단기 예보 정보 조회
- generateWeatherTopics(weatherData): 날씨 기반 대화 주제 생성
- 좌표 변환 및 데이터 파싱 기능
```

### LoveCoachService.js
```javascript
// 연애 단계별 맞춤 가이드 제공
- generateLoveTopics(stage, type): 단계별 대화 주제 생성
- getEmergencyTopics(situation): 응급 상황 대화법
- getLocationBasedTopics(location): 데이트 장소별 주제
- getMBTIBasedTopics(mbti): MBTI별 맞춤 대화법
```

### RelationshipConversationService.js
```javascript
// 다양한 관계에서의 소통법 제공
- generateRelationshipTopics(type, mode): 관계별 대화 생성
- getSituationStrategy(situation): 상황별 전략
- getCulturalGuidelines(culture): 문화별 가이드라인
```

## 🚀 사용 방법

### 개발 환경 설정
```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에 기상청 API 키 설정
WEATHER_API_KEY=your_kma_api_key_here

# 개발 서버 실행
npm start
```

### 앱 아이콘 변환
1. `assets/tools/icon_converter.html` 파일을 브라우저에서 열기
2. 원하는 크기 선택 (구글 플레이 콘솔용: 512×512px)
3. "PNG로 변환하기" 버튼 클릭
4. 생성된 PNG 파일 다운로드

### 그래픽 이미지 생성
1. `assets/tools/feature_graphic_generator.html` 파일을 브라우저에서 열기
2. 배경색, 텍스트, 레이아웃 등 설정 조정
3. 실시간 미리보기 확인
4. "1024×500 PNG 다운로드" 버튼 클릭

## 🔧 API 연동 가이드

### 기상청 API 설정
1. [공공데이터포털](https://data.go.kr)에서 계정 생성
2. "기상청_단기예보 조회서비스" 신청 및 승인
3. 발급받은 서비스키를 환경변수에 설정
4. WeatherService에서 자동으로 API 호출 및 파싱

### 지원 도시 좌표
- 서울: (60, 127)
- 부산: (98, 76) 
- 대구: (89, 90)
- 인천: (55, 124)
- 광주: (58, 74)
- 대전: (67, 100)
- 울산: (102, 84)
- 세종: (66, 103)
- 제주: (52, 38)

## 📋 구글 플레이 콘솔 요구사항

### 앱 아이콘
- ✅ 크기: 512×512px
- ✅ 형식: PNG 또는 JPEG
- ✅ 최대 파일 크기: 1MB

### 그래픽 이미지 (Feature Graphic)
- ✅ 크기: 1024×500px
- ✅ 형식: PNG 또는 JPEG  
- ✅ 최대 파일 크기: 1MB
- ✅ 용도: 플레이 스토어 앱 페이지 상단 배너

## 🎯 브랜딩 가이드

### 컬러 팔레트
- **Primary**: #6366f1 (인디고)
- **Secondary**: #8b5cf6 (보라)
- **Accent**: #a855f7 (밝은 보라)
- **Weather**: #00d2ff → #3a7bd5 (하늘색 그라데이션)
- **Love**: #ff6b9d → #c44569 (핑크 그라데이션)
- **Background**: Linear gradient (#6366f1 → #8b5cf6)
- **Text**: #ffffff (흰색)

### 디자인 컨셉
- 💬 말풍선을 활용한 소통 테마
- 🎨 모던하고 친근한 그라데이션
- ✨ 깔끔한 미니멀 디자인
- 🔄 다양한 크기와 플랫폼 호환성
- 🌈 기능별 차별화된 색상 체계

## 📱 앱 스토어 준비 체크리스트

- [x] 앱 아이콘 512×512px PNG
- [x] 그래픽 이미지 1024×500px PNG
- [x] 새로운 기능 구현 (날씨 톡, 연애 코치)
- [x] 서비스 로직 완성
- [x] UI/UX 업데이트
- [ ] 스크린샷 (폰/태블릿)
- [ ] 앱 설명 및 키워드
- [ ] 개인정보 처리방침
- [ ] APK/AAB 파일

## 🔄 업데이트 내역

### v2.0.0 (2025.06.17)
- ✨ **신규**: 오늘의 날씨 톡 - 기상청 API 연동
- ✨ **신규**: 연애 코치 톡 - 단계별 연애 가이드
- 🔀 **통합**: 4개 관계 카테고리를 1개로 효율화
- 🎨 **개선**: 메인 화면 UI/UX 대폭 개선
- 📱 **추가**: 실시간 날씨 정보 표시
- 💡 **향상**: AI 기반 맞춤 대화 주제 생성

### v1.0.0 (2025.06.01)
- 🎉 초기 버전 출시
- 📱 기본 대화 주제 생성 기능
- 🎨 앱 아이콘 및 브랜딩 설계
- 📊 세대별 대화 카테고리 구성

## 🛠️ 기술 스택

### Frontend
- **React Native**: 크로스 플랫폼 모바일 앱
- **Expo**: 개발 환경 및 빌드 도구
- **React Navigation**: 화면 네비게이션
- **Expo Linear Gradient**: 그라데이션 UI
- **React Native Animatable**: 애니메이션 효과

### Backend Services
- **기상청 Open API**: 실시간 날씨 데이터
- **Custom AI Services**: 대화 주제 생성 로직

### Development Tools
- **Node.js**: 개발 환경
- **npm**: 패키지 관리
- **Git**: 버전 관리
- **GitHub**: 코드 저장소

## 🤝 기여 가이드

### 개발 참여 방법
1. Repository Fork
2. Feature Branch 생성
3. 개발 및 테스트
4. Pull Request 제출

### 코드 스타일 가이드
- **JavaScript**: ES6+ 문법 사용
- **React Native**: Functional Components 선호
- **파일명**: PascalCase (컴포넌트), camelCase (일반)
- **주석**: JSDoc 형식 사용

### 이슈 리포트
- 버그 리포트 시 재현 단계 명시
- 기능 제안 시 구체적인 사용 사례 제공
- 스크린샷 첨부 권장

## 📞 지원 및 문의

- **개발자**: woojung1234
- **GitHub**: [https://github.com/woojung1234/talktalk](https://github.com/woojung1234/talktalk)
- **이슈 트래커**: GitHub Issues 활용
- **라이선스**: MIT License

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