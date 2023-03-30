---
layout: post
title: Lighthouse
date: 2023-03-30 00:00:00 +0900
category: Interview
published: true
---

# Lighthouse란 무엇인가?
---
<br>

![lighthouse image](/public/img/interview/optimization/lighthouse.png){: width="800px"}
<br>
Lighthouse는 Google에서 개발한 오픈소스 웹 개발 도구다. 이는 웹 페이지의 품질과 성능을 평가하는 데 사용되며, 다양한 성능 지표와 최적화 기능을 제공한다. <br>Lighthouse는 크롬 개발자 도구 내에 내장되어 있으며, 콘솔 명령을 사용하여도 실행할 수 있다.
<br>
<br>

## Lighthouse가 제공하는 성능 평가 항목
Lighthouse는 여러 가지 성능 평가 항목을 제공한다. 항목은 다음과 같다.

  - 성능: 웹 페이지의 로드 시간, 데이터 전송 속도, CPU 사용량 등을 측정한다.
  - 접근성: 웹 페이지의 접근성을 평가하고, 장애인들이 웹 페이지를 사용할 수 있는지 확인한다.
  - 최적화: 웹 페이지의 성능을 최적화하는 데 필요한 조치를 제시한다.
  - PWA(Progressive Web App) 지원: PWA 지원 여부를 검사하고, PWA를 개발할 때 유용한 정보를 제공한다.
<br>
<br>

## Lighthouse Performance의 Opportunities 항목이란?
Lighthouse Performance의 Opportunities 항목은 웹 페이지의 성능 개선을 위한 제안 사항을 제공하는 성능 평가 항목 중 하나다.<br> 
Opportunities 항목은 웹 페이지의 성능 문제를 식별하고, 개선할 수 있는 방법을 제시해준다. 
<br>
<br>Opportunities 항목에서 제공되는 제안 사항은 다음과 같다.

### Opportunities에서 제공하는 성능 개선 제안 사항
  - 리소스 용량 최적화
    - 이미지 최적화: 이미지의 크기를 줄이고, 압축률을 높여 이미지 로딩 속도를 향상시킨다.
    - CSS/JS 최적화: CSS와 JavaScript 파일의 크기를 줄이고, 불필요한 코드를 제거하여 파일 다운로드 속도를 향상시킨다.
  - 렌더링 최적화
    - 위치 변경: 위에 있는 콘텐츠가 먼저 로드되도록 위치를 변경하거나, 미리 렌더링할 수 있는 콘텐츠를 미리 렌더링한다.
    - 렌더링 차단 리소스 제거: 렌더링 차단 리소스를 제거하여 브라우저가 웹 페이지를 보다 빠르게 로드할 수 있도록 한다.
  - 캐싱 최적화
    - 캐시 가능한 리소스 캐싱: 반복적으로 로드되는 리소스를 캐시하여 로딩 속도를 향상시킨다.
    - 영구 캐싱: 정적인 리소스를 영구 캐싱하여 웹 페이지의 로딩 속도를 더욱 빠르게 한다.



### Opportunities 항목 사용 방법
Opportunities 항목은 Lighthouse Performance 결과 보고서에서 확인할 수 있다. <br>결과 보고서에서 Opportunities 항목을 선택하면, 각각의 성능 개선 제안 사항에 대한 상세한 내용과, 개선 사항에 대한 구체적인 조치 방법을 확인할 수 있다.
<br>
<br>

## Lighthouse를 사용하는 방법
Lighthouse를 사용하려면, 크롬 개발자 도구를 열고, Lighthouse 탭을 선택한다. 그런 다음, Lighthouse를 실행하려는 웹 페이지의 URL을 입력하고, 실행 버튼을 클릭한다. <br>Lighthouse는 웹 페이지를 분석하고, 결과 보고서를 생성한다. 결과 보고서는 다양한 성능 평가 항목에 대한 평가 결과와, 해당 항목에 대한 개선 사항을 제공한다.

<br>

![lighthouse test](/public/img/interview/optimization/lighthouse-test.png){: width="800px"}
<br>

## Lighthouse의 장점
Lighthouse는 여러 가지 장점을 가지고 있다. 이러한 장점은 다음과 같다.

  - 오픈소스: Lighthouse는 오픈소스로 개발되었기 때문에, 누구나 자유롭게 사용하고, 개선할 수 있다.
  - 다양한 성능 평가 항목: Lighthouse는 다양한 성능 평가 항목을 제공하며, 웹 페이지의 성능을 전면적으로 분석할 수 있다.
  - 쉬운 사용: Lighthouse는 크롬 개발자 도구 내에 내장되어 있기 때문에, 쉽게 실행하고 결과 보고서를 확인할 수 있다.
  <br>
<br>

# 마무리
---
Lighthouse는 웹 개발자들이 웹 페이지의 성능을 쉽게 평가하고 최적화할 수 있는 강력한 도구다. 
<br>우리는 Lighthouse를 통해 웹 페이지의 성능을 개선하고, 유저의 만족도를 높일 수 있다.