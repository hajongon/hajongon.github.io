---
layout: post
title: stack overflow 클론 코딩 프로젝트 01.
date: 2023-04-13 00:00:00 +0900
category: clone
published: true
---

# 개요 
--- 
stack overflow 클론 코딩 프로젝트를 진행하게 되었다.<br>
팀원은 프론트엔드 3명, 백엔드 3명으로 구성되었다.<br>

일정 관리나 요구 사항 점검, 회의록 작성은 노션으로 하려 한다.<br>
<br>
[프로젝트 관리 페이지](https://lemon-scribe-6b6.notion.site/clone-c4ad9255713c46298f7e5b21b9704b91){: target="blank"}
<br>
<br>


# 1차 회의
---


1️⃣ Git Flow
  - 최상위 branch: `main`
  - 프론트 개발 branch: `dev`
  - 기능 개발 branch: `feat`. ex) feat/log-in
  - merge는 무조건 모여서 한다.
  <br><br>
  
2️⃣ 코드 컨벤션
  - 들여쓰기 2칸
  - 세미콜론 O
  - "문자열"
  - trailing comma O
  - ...
  <br><br>

3️⃣ 목표 기술 스택(프론트엔드)

  ![프론트엔드-기술-스택](/public/img/project/stackoverflow/front-stack.png){: width="600px"}

  - React(CRA)
  - react-router-dom
  - styled-components
  - Redux
  - ESLint, Prettier
  - Axios
  - json-server

<br>


4️⃣ 커밋 컨벤션<br>
  - `Feat` : 새로운 기능 추가
  - `Fix` : 버그 수정
  - `Docs` : 문서 수정
  - `Style` : 코드
  - `Formatting` : 세미콜론 누락 등. 코드 자체에는 변경이 없는 경우.
  - `Refactor` : 코드 리팩토링
  - `Test` : 테스트 코드, 리팩토링 테스트 코드 추가.
  - `Chore` : 패키지 매니저 수정 및 기타 수정. ex) `.gitignore`
  - `Design` : styled-components 등 UI 디자인 수정.
  - `Comment` : 필요한 주석 추가 및 변경
  - `Rename` : 파일 또는 폴더 명을 수정하거나 옮기는 작업만 수행한 경우
  - `Remove` : 파일을 수정하는 작업만 수행한 경우
  - `!BREAKING CHANGE` : API 변경을 크게 한 경우
  - `!HOTFIX` : 급하게 치명적인 버그를 고치는 경우
  - `Setting` : 기본 세팅 변경의 경우(ESLint 등)
<br><br>

5️⃣ 폴더 구조<br>
  - `/src`
    - `/assets` : 이미지, 폰트 등 정적인 assets
    - `/components` : 재사용 가능한 UI 컴포넌트
    - `/pages` : 각 페이지의 탑 레벨 컴포넌트
    - `/redux` : 리덕스 관련 파일
    - `/services` : API 서비스 기능 관련
    - `/utils` : 유틸리티 functions
    <br><br>

6️⃣ 구현할 기능<br>
  - 요구 사항 포스트 참조

<br><br>


<br>
어쩌다보니 팀장이 됐네요.. 삶이란 건 생각한 대로 흘러가지만은 않죠.<br>
하지만 내심 팀장이라는 역할을 수행해보고 싶었을지도 모르겠습니다..<br>
여러분들의 삶은 어떤가요? 행복하십니까? 항상 화이팅입니다.<br>
그래도 팀원 5분 모두 너무 좋은 분들 같아서 다행입니다. 저의 인복은 어디까지일까요?<br>
하종승의 인복스토리.. to be continued..<br>

