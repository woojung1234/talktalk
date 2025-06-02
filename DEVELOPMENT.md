# TalkTalk 개발 가이드

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

# OpenAI API 키 설정
# .env 파일에서 OPENAI_API_KEY를 실제 키로 변경
```

### 3. 개발 서버 실행

```bash
# Expo 개발 서버 시작
npx expo start

# 또는
npm start
```

## 🔧 핵심 기능 구현 상태

### ✅ 완료된 기능
- [x] 프로젝트 기본 구조
- [x] 네비게이션 설정
- [x] 홈 화면 (상황별 카드)
- [x] 대화 생성 폼 화면
- [x] 결과 표시 화면
- [x] GPT API 서비스 기본 구조
- [x] UI/UX 디자인 시스템
- [x] 애니메이션 효과

### 🚧 진행 중인 작업
- [ ] GPT API 실제 연동 및 테스트
- [ ] 프롬프트 엔지니어링 최적화
- [ ] 오프라인 모드 지원
- [ ] 사용자 피드백 시스템

### 📱 배포 준비 작업
- [ ] 앱 아이콘 및 스플래시 스크린
- [ ] 플레이 스토어 메타데이터
- [ ] 앱 서명 및 보안 설정
- [ ] 성능 최적화

## 🔑 중요한 다음 단계

### 1. OpenAI API 키 설정
```javascript
// src/services/ConversationAI.js에서
const OPENAI_API_KEY = 'your_actual_api_key_here';
```

### 2. ResultScreen에서 실제 API 호출로 변경
```javascript
// src/screens/ResultScreen.js의 generateTopics 함수에서
import ConversationAI from '../services/ConversationAI';

const generateTopics = async () => {
  setIsLoading(true);
  try {
    const topics = await ConversationAI.generateConversationTopics(conversationData);
    setTopics(topics);
  } catch (error) {
    // 에러 처리
  } finally {
    setIsLoading(false);
  }
};
```

### 3. ConversationGeneratorScreen에서 실제 API 호출로 변경
```javascript
// src/screens/ConversationGeneratorScreen.js의 generateConversation 함수에서
import ConversationAI from '../services/ConversationAI';

const generateConversation = async () => {
  // ... 유효성 검사
  
  setIsLoading(true);
  try {
    const topics = await ConversationAI.generateConversationTopics(conversationData);
    navigation.navigate('Result', { conversationData, topics });
  } catch (error) {
    Alert.alert('오류', '대화 주제 생성 중 오류가 발생했습니다.');
  } finally {
    setIsLoading(false);
  }
};
```

## 📅 3주 개발 일정

### 1주차 (현재 완료) ✅
- 프로젝트 초기 설정
- 기본 UI/UX 구현
- 네비게이션 구조
- 화면별 레이아웃

### 2주차 (진행해야 할 작업)
- [ ] OpenAI API 실제 연동
- [ ] 프롬프트 최적화 및 테스트
- [ ] 에러 처리 및 예외 상황 대응
- [ ] 앱 아이콘 및 스플래시 스크린 제작
- [ ] 성능 최적화

### 3주차 (배포 준비)
- [ ] Google Play Console 계정 설정
- [ ] 앱 서명 키 생성
- [ ] 스토어 메타데이터 작성
- [ ] EAS Build로 AAB 파일 생성
- [ ] 내부 테스트 배포
- [ ] 실제 플레이 스토어 출시

## 🛠 개발 도구 및 명령어

### 개발
```bash
# 개발 서버 시작
npm start

# 안드로이드 에뮬레이터
npm run android

# iOS 시뮬레이터 (Mac에서만)
npm run ios
```

### 빌드 및 배포
```bash
# EAS 프로젝트 설정
eas login
eas init

# 안드로이드 빌드 (AAB)
eas build --platform android

# 플레이 스토어 제출
eas submit --platform android
```

## 📋 플레이 스토어 출시 체크리스트

### 앱 정보
- [ ] 앱 이름: TalkTalk
- [ ] 패키지명: com.woojung1234.talktalk
- [ ] 카테고리: 라이프스타일 또는 소셜
- [ ] 연령 등급: 전체 이용가

### 필요한 자산
- [ ] 앱 아이콘 (512x512 PNG)
- [ ] 기능 그래픽 (1024x500 PNG)
- [ ] 스크린샷 (최소 2장, 최대 8장)
- [ ] 앱 설명 (한국어, 영어)
- [ ] 개인정보처리방침 URL

### 기술적 요구사항
- [ ] Target SDK 34 (Android 14)
- [ ] 64비트 지원
- [ ] 앱 서명 키
- [ ] AAB 파일 업로드

## 🎯 핵심 기능 설명

### 1. 세대별 맞춤 추천
- 사용자와 상대방의 나이를 기반으로 적절한 대화 주제 생성
- 세대 간 관심사 차이를 고려한 중간 지점 찾기

### 2. 상황별 최적화
- 직장, 가족, 친구, 첫 만남 등 다양한 관계 고려
- 캐주얼, 전문적, 친근함, 정중함 등 분위기 설정

### 3. 실시간 트렌드 반영
- 현재 인기 있는 콘텐츠 및 이슈 포함
- 계절성 및 시기별 적절한 주제 추천

### 4. 실용적인 대화 팁
- 구체적인 대화 시작 멘트 제공
- 대화를 이어가는 방법 안내
- 주의해야 할 점들 명시

이제 실제 개발을 계속 진행하시면 됩니다! 가장 중요한 것은 OpenAI API 키를 설정하고 실제 API 호출이 작동하도록 하는 것입니다.
