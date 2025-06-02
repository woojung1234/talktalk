# TalkTalk 빌드 및 배포 가이드

## 🚀 단계별 빌드 프로세스

### 1단계: 환경 설정 확인
```bash
# Node.js 버전 확인 (16.x 이상 권장)
node --version

# npm 업데이트
npm install -g npm@latest

# EAS CLI 설치/업데이트
npm install -g @expo/eas-cli@latest

# Expo CLI 설치 (필요시)
npm install -g @expo/cli@latest
```

### 2단계: 프로젝트 의존성 정리
```bash
# 기존 node_modules 삭제
rm -rf node_modules
rm package-lock.json

# 의존성 재설치
npm install

# 캐시 정리
npm cache clean --force
expo r -c  # Expo 캐시 정리
```

### 3단계: EAS 설정
```bash
# EAS 로그인
eas login

# 프로젝트 설정 (이미 있으면 스킵)
eas build:configure

# 환경 변수 설정 (OpenAI API Key)
eas secret:create --scope project --name OPENAI_API_KEY --value "your-api-key-here"
```

## ⚠️ 자주 발생하는 오류와 해결법

### 오류 1: "Metro bundler failed"
```
❌ Error: Metro bundler failed to load configuration
```
**해결법:**
```bash
# Metro 설정 파일 생성
echo 'module.exports = require("@expo/metro-config/metro.config");' > metro.config.js

# 또는 기존 설정 재설정
npx expo install --fix
```

### 오류 2: "Gradle build failed"
```
❌ Error: Gradle build failed with exit code 1
```
**해결법:**
```json
// app.json의 android 섹션에 추가
{
  "expo": {
    "android": {
      "gradle": {
        "buildToolsVersion": "33.0.0"
      },
      "compileSdkVersion": 33,
      "targetSdkVersion": 33
    }
  }
}
```

### 오류 3: "OpenAI API Key not found"
```
❌ Error: Environment variable OPENAI_API_KEY is not defined
```
**해결법:**
```bash
# 로컬 .env 파일 생성
echo "OPENAI_API_KEY=your-api-key" > .env

# EAS secrets에도 추가
eas secret:create --scope project --name OPENAI_API_KEY --value "your-api-key"

# babel.config.js에 dotenv 플러그인 확인
```

### 오류 4: "Package name conflict"
```
❌ Error: Package name 'com.woojung1234.talktalk' already exists
```
**해결법:**
```json
// app.json에서 패키지명 변경
{
  "expo": {
    "android": {
      "package": "com.woojung1234.talktalk.v2"
    }
  }
}
```

### 오류 5: "Icon/Splash missing"
```
❌ Error: Could not find icon.png or splash.png
```
**해결법:**
```bash
# assets 폴더 생성
mkdir -p assets

# 임시 아이콘 생성 (실제로는 디자인된 아이콘 사용)
# 512x512 PNG 파일을 assets/icon.png로 저장
# 1284x2778 PNG 파일을 assets/splash.png로 저장
```

## 📋 완벽한 빌드를 위한 체크리스트

### app.json 최종 확인
```json
{
  "expo": {
    "name": "TalkTalk",
    "slug": "talktalk-conversation-ai",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#6366f1"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.woojung1234.talktalk"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#6366f1"
      },
      "package": "com.woojung1234.talktalk",
      "versionCode": 1,
      "permissions": ["INTERNET"],
      "compileSdkVersion": 33,
      "targetSdkVersion": 33
    },
    "web": {
      "bundler": "metro"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 필수 파일 확인
```
✅ assets/icon.png (512x512)
✅ assets/splash.png (1284x2778)
✅ assets/adaptive-icon.png (1024x1024)
✅ .env (OPENAI_API_KEY 포함)
✅ app.json (완전한 설정)
✅ eas.json (빌드 설정)
```

## 🛠️ 실제 빌드 명령어

### 프로덕션 빌드
```bash
# 1. 빌드 시작 (Android AAB)
eas build --platform android --profile production

# 2. 빌드 상태 확인
eas build:list

# 3. 빌드 완료 후 다운로드
# EAS 대시보드에서 .aab 파일 다운로드 가능
```

### 테스트 빌드 (권장)
```bash
# 먼저 APK로 테스트 빌드
eas build --platform android --profile preview

# 성공하면 프로덕션 AAB 빌드
eas build --platform android --profile production
```

## 📱 플레이스토어 업로드

### 자동 업로드 (서비스 계정 키 필요)
```bash
# Google Play Console 서비스 계정 키 설정 후
eas submit --platform android --profile production
```

### 수동 업로드
1. EAS 대시보드에서 .aab 파일 다운로드
2. Google Play Console → 앱 번들 → 프로덕션으로 업로드
3. 스토어 등록 정보 입력 후 심사 요청

## 🔧 SVG를 PNG로 변환하기

### 온라인 도구 사용
1. **Canva** (https://canva.com)
   - 512x512 사이즈로 아이콘 생성
   - PNG 형식으로 다운로드

2. **SVGOMG** (https://jakearchibald.github.io/svgomg/)
   - SVG 최적화 후 PNG 변환

3. **CloudConvert** (https://cloudconvert.com/svg-to-png)
   - 대량 변환 지원

### 로컬 도구 (Node.js)
```bash
# svg2png 설치
npm install -g svg2png-cli

# 변환 실행
svg2png assets/icon.svg --output=assets/icon.png --width=512 --height=512
```

## 🎯 배포 전 최종 체크리스트

### 필수 준비물
- [ ] Google Play Console 개발자 계정 ($25)
- [ ] OpenAI API 키
- [ ] 앱 아이콘 PNG 파일 (512x512)
- [ ] 스플래시 이미지 PNG 파일 (1284x2778)
- [ ] 개인정보처리방침 URL

### 배포 단계
1. [ ] 로컬에서 앱 테스트
2. [ ] EAS 테스트 빌드 (APK)
3. [ ] 실제 기기에서 테스트
4. [ ] 프로덕션 빌드 (AAB)
5. [ ] Google Play Console 업로드
6. [ ] 스토어 정보 입력
7. [ ] Internal Testing 진행
8. [ ] Production 배포

## 🆘 문제 해결 연락처

### 공식 문서
- Expo 문서: https://docs.expo.dev/
- EAS 빌드 가이드: https://docs.expo.dev/build/introduction/
- Google Play Console 도움말: https://support.google.com/googleplay/android-developer/

### 커뮤니티
- Expo Discord: https://discord.gg/expo
- Stack Overflow: expo 태그 검색
- GitHub Issues: 관련 오류 검색

### 응급 상황
```bash
# 모든 캐시 삭제 (최후의 수단)
rm -rf node_modules
rm package-lock.json
npm cache clean --force
expo r -c
watchman watch-del-all  # macOS만
npm install
```

## 📊 배포 후 모니터링

### 성능 지표 확인
- Google Play Console → 통계
- 크래시 리포트 모니터링
- 사용자 리뷰 및 평점 확인

### 업데이트 전략
- 주요 버그 수정: 즉시 업데이트
- 새 기능 추가: 2주 간격 권장
- UI/UX 개선: 월 1회 업데이트