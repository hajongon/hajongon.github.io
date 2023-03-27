---
layout: post
title: React Virtual DOM 리액트 가상 돔
date: 2023-03-24 00:00:00 +0900
category: React
published: true
---

<br/>
## Real DOM (DOM)

---


DOM은 `Document Object Model`의 약자로, 뜻을 그대로 풀자면 '문서 객체 모델'이다.  
여기서 Document Object(문서 객체)란, 브라우저는 JavaScript가 `<html>, <head>, <body>`와 같은 태그들에 접근해 조작할 수 있도록 문서를 **트리 구조**로 객체화한 것을 의미한다. 즉, DOM은 브라우저가 HTML 문서를 조작할 수 있도록 트리 구조화한 객체 모델이다.
<br/>
<br/>
아무튼 그냥 실제로 렌더링되는 요소들!!!
<br>
<br>

    🐤 트리와 그래프의 차이점: 루트 노드의 유무. 트리에는 부모 자식 관계가 있다.

<br>
<br>
<br>
![DOM Tree](/public/img/dom.gif){: width="80%" height="80%"}{: .center}
<br>
<br>
<br>
우리는 `querySelector`, `addEventListener`와 같은 DOM API를 통해 문서의 요소들을 조작할 수 있다.
<br>
<br>
DOM은 계층적 형태의 트리 구조로 구성되어 있는데, 자료구조 중에서도 특히 트리는 "데이터 저장"보다는 **"저장된 데이터를 효과적으로 빠르게 탐색"**하는 것에 특화되어 있다. 그렇기 때문에 DOM은 JavaScript와 같은 스크립팅 언어가 접근, 변경, 업데이트하는 데 있어 유리하다. (시간적으로)
<br>
<br>
![rendering process](/public/img/rendering-process.png){: width="80%" height="80%"}{: .center}
<br>
<br>
탐색하기 쉽다는 건 접근하기도 쉽다는 것.
<br>
<br>
자바스크립트 객체로 DOM 객체 조작이 쉽다   
&rarr; 너무 자주 접근, 조작해서 자주 렌더링된다.   
&rarr; reflow & repaint 자주 발생  
<span style="color: grey">`이게 논리 구조가 맞는지는 잘 모르겠음..`</span>
<br>
<br>
## Virtual DOM
---
<br>
<br>
![Virtual DOM & DOM](/public/img/VDvsD.png){: width="80%" height="80%"}{: .center}
<br>
<br>
JavaScript 객체로 이루어진 가상의 DOM 트리를 사용하여, 실제 DOM 조작을 최소화하고 성능을 최적화하는 기술. 상태가 변경될 때마다 가상 DOM을 새로 생성해서 이전 상태와 비교한다. 필요한 부분만 렌더링.

<br>
<br>
### Virtual DOM의 형태

<br>
가상 DOM은 추상화된 JavaScript 객체의 형태를 가지고 있다. 우리 눈에 안 보일 뿐이지 Real DOM을 카피한 객체 형태임.

### Virtual DOM의 동작 과정

<br>

![reconciliation](/public/img/reconciliation.jpeg){: width="80%" height="80%"}{: .center}
<br>
<br>
리액트는 상태를 변경하는 작업(e.g. 이벤트)이 발생했을 때, 가상 DOM에 저장된 이전 상태와 현재 상태를 비교한다. (by diffing algorithm) 그리고 바뀐 부분, 즉 변경이 필요한 부분만 실제 DOM에 반영해 업데이트한다. 이것을 `Reconciliation`, 즉 재조정이라고 한다.
<br>
<br>


      
      가상돔을 조작하면 항상 빠르다? ㄴㄴ

      1. 복잡한 UI를 가진 경우 -> 가상돔이 돔 트리를 생성하고 비교하는 시간이 오래 걸린다.
      2. 동적 데이터를 자주 업데이트하는 경우


<br>
<br>
휴리스틱 알고리즘: 문제를 효율적으로 해결하기 위한 방식. 추론을 기반으로 구상됨.
<br>
<br>
추론
<br>
1. 각기 서로 다른 두 요소는 다른 트리를 구축할 것이다. &rarr; 각 요소가 고유한 `id`나 `class`를 가지고 있다는 걸 전제로 한다.
2. 개발자가 제공하는 `key` 프로퍼티를 가지고, 여러 번 렌더링을 거쳐도 변경되지 말아야 하는 자식 요소가 무엇인지 알아낼 수 있을 것이다. &rarr; 각 요소에 고유한 `key` 값이 존재한다는 걸 전제로 한다.

<br>
<br>
위와 같은 가정 및 추론을 통해 기존에 `O(n^3)` 이었던 시간 복잡도를 `O(n)` 으로 개선했다.
<br>
<br>


### React가 DOM 트리를 순회하는 방식
<br>
BFS의 일종. 같은 레벨끼리 비교한다.

부모가 업데이트되면 자식은 다 파괴된다. 변화가 없는 자식들은 계속 변하지 않을 수 있게끔 하는 로직을 만들어 두는 것이 좋다.
부모가 업데이트 안 되면 자식들까지 순회(재귀적 처리, DFS)

비교는 BFS. 자식 처리는 DFS.

<br>

