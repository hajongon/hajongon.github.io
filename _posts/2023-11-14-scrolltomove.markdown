---
layout: post
title: 버튼 클릭 시 스크롤 가장 아래로 이동 (리액트)
date: 2023-11-14 10:00:00 +0900
category: React
published: true
---

## 개요

버튼 클릭 시 스크롤을 가장 아래로 내리는 기능을 구현하고자 한다.

## 기존

![화면이동안됨](/public/img/scroll/%ED%99%94%EB%A9%B4%EC%9D%B4%EB%8F%99%EC%95%88%EB%90%A8.gif){:width="800px"}

## 수정 방안

`useRef`로 왼쪽 컬럼 전체를 참조한다.<br>
`useEffect`에서 `showResult`가 true가 되는 순간 <br>참조한 컬럼의 `scrollTop` 속성에 `scrollHeight`를 할당한다.<br>
이게 무슨 말인가 대체?<br>
<br>

### 🐥 `scrollTop`
- 이 속성은 요소의 스크롤 바 상단 위치를 나타낸다.
- 값이 0이면 스크롤이 맨 위에 있음을 의미한다.
- 값을 변경하면 스크롤 위치가 조정된다.

### 🐥 `scrollHeight`
- 요소의 전체 내용 높이를 나타내고, 스크롤을 통해 볼 수 있는 부분을 포함한다.
- 예를 들어, 스크롤 영역의 실제 높이가 500px이고, 스크롤 바로 볼 수 있는 영역의 높이가 200px이라면 `scrollHeight`는 500px이다.

즉, `scrollRef.current.scrollTop = scrollRef.current.scrollHeight` 이라는 코드는 "현재 스크롤 가능한 영역의 맨 아래로 스크롤하라"는 의미인 것이다.

### 🐥 응용

그럼 `showResult`가 false가 되면 scroll이 다시 맨 위로 와야하는 것 아닌가?<br>
현재로서는, result 카드가 사라지면 scroll이 위로 올 필요 없이 한 화면에 모든 요소가 보이기 때문에 굳이 필요한 기능은 아니지만, <br> 추후 카드가 추가될 수도 있기 때문에 코드를 수정해놓기로 결정했다.

```jsx
useEffect(() => {
  if (scrollRef.current) {
    if (showResult) {
      // 결과가 표시될 때 스크롤을 맨 아래로 이동
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    } else {
      // 결과가 숨겨질 때 스크롤을 맨 위로 이동
      scrollRef.current.scrollTop = 0;
    }
  }
}, [showResult]);
```

## 수정 후 

![화면이동됨](/public/img/scroll/%ED%99%94%EB%A9%B4%EC%9D%B4%EB%8F%99%EB%90%A8.gif){:width="800px"}

## 코드

```jsx
import React, { useState, useEffect, useRef } from 'react'

const Main = () => {
  const [showResult, setShowResult] = useState(false)
  const scrollRef = useRef(null)

useEffect(() => {
  if (scrollRef.current) {
    if (showResult) {
      // 결과가 표시될 때 스크롤을 맨 아래로 이동
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    } else {
      // 결과가 숨겨질 때 스크롤을 맨 위로 이동
      scrollRef.current.scrollTop = 0;
    }
  }
}, [showResult]);

  return (
    <div>
      <Row>
        <Col
          ref={scrollRef}
        >
          <Row
            className="sticky-top" // 해당 요소는 스크롤과 무관하게 고정
            style={ {
              top: 'calc(100vh - var(--falcon-top-nav-height) - 54.1rem)'
            } }
          >
            <Col>
              <PatientInfo
                showResult={showResult}
                setShowResult={setShowResult}
                setIsPatientSelected={setIsPatientSelected}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <PatientSymptom />
            </Col>
            <Col>
              <SymptomSite />
            </Col>
          </Row>

          {isPatientSelected ? (
              <Row >
                <Col>
                  <TestResults />
                </Col>
              </Row>
          ) : null}
          {!showResult ? (
            <Row>
              <Button
                onClick={() => setShowResult(true)}
              >
                항생제 내성 판단
              </Button>
            </Row>
          ) : (
            <Row>
              <Col>
                <DiagnosticResult setShowResult={setShowResult} />
              </Col>
            </Row>
          )}
        </Col>

        <Col>
          {/* ... */}
        </Col>
      </Row>
    </div>
  )
}

export default Main

```