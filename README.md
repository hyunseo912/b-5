# 당장만나

> 모임 날짜·장소·메뉴를 정하느라 카톡이 수십 개 오가는 문제를 **링크 하나**로 해결하는 웹앱
> 삼일회계법인 2026 Discover 신규입사자 연수 사전 미션 · B-5조

**🔗 배포 주소 (최종 제출 링크): https://b-5-one.vercel.app/**

## 실행

`index.html`을 더블클릭하면 브라우저에서 바로 열립니다. (설치·빌드 없음)
⚡ 심사위원용 데모 버튼을 누르면 테스트 참여자 10명의 결과 대시보드로 바로 이동합니다.

## 폴더 구조

```
index.html                  화면 틀 (스크립트 로드 순서 유지)
img/hero.jpg                진입 화면 그림 (AI 생성)
css/style.css               스타일
js/data.js                  설정값 + 데모 데이터 10명
js/core.js                  공통 상태·유틸·화면 그리기
js/rank.js                  순위·만장일치·추천·요약 계산
js/screens/01_home.js       01 진입 + ⚡ 데모
js/screens/02_create.js     02 모임 생성
js/screens/03_join.js       03 초대장 열기
js/screens/04_respond.js    04 응답 + 접수 팝업
js/screens/05_dashboard.js  05 대시보드
js/screens/06_detail.js     06 상세 시트
js/app.js                   시작
CLAUDE.md                   Claude Code 공통 규칙 (작업 전 꼭 읽기)
컨텐츠팀전달파일/             콘텐츠팀 원본 (수정 금지)
  당장만나_모의앱_v4.1.html    디자인 기준 모의 앱
  화면별_샘플데이터_명세_v4.1.md  화면별 데이터·계산 규칙 명세
  화면별_샘플데이터_v4.1.json    설정값 + 테스트 참여자 10명
  테스트_입력데이터_v4.1.xlsx    테스트 입력값 + 집계 정답지
  KakaoTalk_…_00~12.png        화면 캡처 13장
```

## 작업 규칙

- 브랜치 없이 `main`에서만 작업합니다.
- 시작 전 "GitHub에서 최신 내용 받아와줘", 끝나면 바로 "main에 올려줘"
- 각자 **맡은 화면 파일만** 수정. 공용 파일(`css/`, `js/data.js`, `js/core.js`, `js/rank.js`)은 톡방에 먼저 공유
- 커밋 메시지: `[이름] 무엇을 바꿨는지 한 줄`
- API 키·비밀번호·실제 개인정보는 절대 올리지 않습니다. (Public 저장소)

※ 샘플 데이터의 이름·숫자·알레르기 정보는 모두 테스트용 가상 데이터입니다.
