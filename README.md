# TalkTalk 📱💬

소통의 새로운 경험을 제공하는 모바일 앱

## 📁 프로젝트 구조

```
talktalk/
├── assets/
│   ├── icons/
│   │   └── talktalk_icon.svg        # 메인 앱 아이콘 (SVG)
│   └── tools/
│       ├── icon_converter.html      # SVG→PNG 변환 도구
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

## 🚀 사용 방법

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
- **Background**: Linear gradient (#6366f1 → #8b5cf6)
- **Text**: #ffffff (흰색)

### 디자인 컨셉
- 💬 말풍선을 활용한 소통 테마
- 🎨 모던하고 친근한 그라데이션
- ✨ 깔끔한 미니멀 디자인
- 🔄 다양한 크기와 플랫폼 호환성

## 📱 앱 스토어 준비 체크리스트

- [x] 앱 아이콘 512×512px PNG
- [x] 그래픽 이미지 1024×500px PNG
- [ ] 스크린샷 (폰/태블릿)
- [ ] 앱 설명 및 키워드
- [ ] 개인정보 처리방침
- [ ] APK/AAB 파일

---

🔧 **개발자**: woojung1234  
📅 **생성일**: 2025년 6월  
🏷️ **버전**: 1.0.0