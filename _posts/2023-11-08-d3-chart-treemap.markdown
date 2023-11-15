---
layout: post
title: d3 차트 treemap 그리기
date: 2023-11-07 00:00:00 +0900
category: frontend
published: true
---

## 트리맵이란?

![treemap-example](/public/img/d3chart/treemap.png){:width="800px"}

**트리맵 차트(Tree Map Chart)**는 데이터를 사각형의 집합으로 시각화하는 방법이다. 이 차트는 대량의 데이터를 효율적으로 표현할 수 있으며, 특히 계층적 데이터 구조를 나타내기에 적합하다. <br> 각 사각형은 데이터 세트의 한 요소를 나타내며, 그 크기는 해당 요소의 수치적 값의 크기를 반영한다. 색상을 사용하여 다른 변수를 표시할 수도 있다.<br>
<br>

트리맵 차트의 주요 특징은 다음과 같다: <br>
<br>
계층적 구조: 트리맵은 데이터의 계층을 사각형의 중첩으로 표현한다. 큰 사각형이 하나의 카테고리를 나타내고, 그 안에 더 작은 사각형들이 서브 카테고리나 개별 항목을 나타낸다.<br>
<br>
크기 및 색상을 이용한 정보 표현: 각 사각형의 크기는 그 데이터 포인트의 중요도나 양을 나타낸다. 색상은 종종 다른 변수를 나타내며, 이를 통해 추가적인 정보 레이어를 제공한다.<br>
<br>
효율적인 공간 활용: 트리맵은 주어진 공간을 최대한 활용하여 많은 데이터 포인트를 표시합니다. 이로 인해 대량의 데이터를 한눈에 볼 수 있다.<br>
<br>
인사이트 도출: 크기와 색상 변화를 통해 데이터의 패턴, 비율, 상대적 중요도 등을 쉽게 파악할 수 있다.<br>
<br>
트리맵 차트는 비즈니스 인텔리전스, 데이터 분석, 재무 보고 등 다양한 분야에서 활용된다. <br> 예를 들어, 회사의 각 부서별 매출을 표현하거나 웹사이트의 트래픽 소스를 분석하는 데 사용할 수 있다.<br>
<br><br>
트리맵을 그리는 과정은 아래 페이지를 참고했다.<br>

<br>

[레퍼런스](https://medium.com/swlh/create-a-treemap-with-wrapping-text-using-d3-and-react-5ba0216c48ce)

## dummy data

<br>

```javascript
const data = {
    name: '내가 먹은 음식',
    children: [
        {
            name: '한식',
            children: [
                {
                    category: '한식',
                    name: '제육볶음',
                    value: 68,
                },
                {
                    category: '한식',
                    name: '된장찌개',
                    value: 45,
                },
                {
                    category: '한식',
                    name: '순두부찌개',
                    value: 32,
                },
                {
                    category: '한식',
                    name: '쌈밥',
                    value: 15,
                },
                {
                    category: '한식',
                    name: '불고기',
                    value: 6,
                },
                {
                    category: '한식',
                    name: '비빔밥',
                    value: 2,
                },
            ],
        },
        {
            name: '중식',
            children: [
                {
                    category: '중식',
                    name: '짜장면',
                    value: 56,
                },
                {
                    category: '중식',
                    name: '짬뽕',
                    value: 48,
                },
                {
                    category: '중식',
                    name: '볶음밥',
                    value: 17,
                },
                {
                    category: '중식',
                    name: '마파두부',
                    value: 3,
                },
                {
                    category: '중식',
                    name: '마라샹궈',
                    value: 34,
                },
                {
                    category: '중식',
                    name: '양꼬치',
                    value: 3,
                },
                {
                    category: '중식',
                    name: '쯔란양고기볶음',
                    value: 19,
                },
            ],
        },
        {
            name: '일식',
            children: [
                {
                    category: '일식',
                    name: '스시',
                    value: 16,
                },
                {
                    category: '일식',
                    name: '히레카츠',
                    value: 8,
                },
                {
                    category: '일식',
                    name: '카레',
                    value: 5,
                },
                {
                    category: '일식',
                    name: '사시미',
                    value: 18,
                },
            ],
        },
    ],
}

export default data
```

## 렌더링

```jsx
import { useRef, useEffect } from 'react'
import * as d3 from 'd3'

export default function Treemap({ data, width, height }) {
    const svgRef = useRef(null)

    function renderTreemap() {
        const svg = d3.select(svgRef.current)

        svg.attr('width', width).attr('height', height)

        const root = d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value)

        const treemapRoot = d3.treemap().size([width, height]).padding(1)(root)
    }

    useEffect(() => {
        renderTreemap()
    }, [data])

    return (
        <div>
            <svg ref={svgRef} />
        </div>
    )
}
```

트리맵의 셀을 렌더링하려면 우선 컴포넌트를 업데이트 해야 한다. 먼저 높이, 너비와 함께 매개변수로 사용할 데이터를 전달한다. <br>다음으로 SVG에 ref를 만들어 d3가 SVG에 액세스할 수 있게 한다.
그리고 컴포넌트의 최초 렌더링 시점이나 `data`에 변화가 있을 때 호출되는 `renderTreemap` 함수를 만든다. <br> 해당 함수에서 d3는 계층적 데이터로 루트 노드를 구성한 다음, 트리맵 레이아웃을 생성하기 위해 해당 루트 노드를 `treemapRoot`에 전달한다.<br>

<br>

`d3.hierarchy` - 해당 루트 노드를 생성, 하위 노드의 모든 데이터 합산, 직사각형이 정렬될 수 있도록 각 노드의 하위를 정렬

`d3.treemap` - 트리맵 레이아웃 만들기. SVG내에서 작업해야 하는 크기 표시. padding 추가, root 노드로 함수 호출

상위 컴포넌트에서 높이 및 너비를 `Treemap`에 전송해줘야 함. (props)

```jsx
import Treemap from './Treemap'
import data from './data'

function App() {
    return (
        <div className="App">
            <Treemap data={data} height={400} width={600} />
        </div>
    )
}

export default App
```

```jsx
// removed above code for brevity

function renderTreemap() {
    // removed above code for brevity

    const nodes = svg
        .selectAll('g')
        .data(treemapRoot.leaves())
        .join('g')
        .attr('transform', (d) => `translate(${d.x0},${d.y0})`)

    const fader = (color) => d3.interpolateRgb(color, '#fff')(0.3)
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10.map(fader))

    nodes
        .append('rect')
        .attr('width', (d) => d.x1 - d.x0)
        .attr('height', (d) => d.y1 - d.y0)
        .attr('fill', (d) => colorScale(d.data.category))
}

// removed below code for brevity
```

SVG를 가져온 다음, 현재 모든 `g` 요소를 선택하고 이를 데이터와 결합한다. `g` 요소가 없다면 `join` 메서드가 이를 처리한다.

여기서 사용하는 `data`는 이전에 생성한 `treemapRoot`에서 가져온 것이다. `leaves` 메서드는 계층 구조에 있는 모든 단일 노드의 배열을 반환한다.

```javascript
console.log(treemapRoot.leaves())
```

![treemap-leaves](/public/img/d3chart/leaves.png){: width="800px"}

`join`은 들어오는 데이터를 이전 데이터와 일치시키기 위해 요소를 추가, 제거 또는 재정렬한다.<br> 첫번째 렌더링에서는 이전 데이터가 없기 때문에 단순히 `g` 요소를 SVG에 추가해 각 데이터 포인트에 매핑한다. 그런 다음 `transform` 속성을 사용해서 각 `g` 요소의 원점을 설정한다.

<br>

`colorScale` - 색상 불투명도 조정

`nodes.append('rect')` 높이와 너비 속성이 있는 각 노드에 SVG 직사각형을 추가
`x0/y0`, `x1/y1` 값은 이전에 정의한 root 및 treemapRoot 함수에 의해 생성되었다.

```javascript
console.log(treemapRoot)
```

![treemap-root](/public/img/d3chart/treemaproot.png){: width="800px"}

`x1/y1`은 상위 컴포넌트에서 넘겨받은 width, height 값

`nodes.attr('fill', (d) => colorScale(d.data.category))`
각 사각형에 색상 추가
`d.data.name` 또는 `d.data.value`를 사용하면 각 사각형마다 뒤죽박죽으로 색을 적용할 수도 있음

```jsx
function renderTreemap() {
    // removed above code for brevity

    const fontSize = 12

    nodes
        .append('text')
        .text((d) => `${d.data.name} ${d.data.value}`)
        .attr('font-size', `${fontSize}px`)
        .attr('x', 3)
        .attr('y', fontSize)
}

// removed below code for brevity
```

svg 에는 텍스트 줄바꿈을 허용하는 속성이 없다. 직접 만들어야 한다.

```jsx
function renderTreemap() {
    // removed above lines for brevity

    nodes
        .append('text')
        .text((d) => `${d.data.name} ${d.data.value}`)
        .attr('data-width', (d) => d.x1 - d.x0)
        .attr('font-size', `${fontSize}px`)
        .attr('x', 3)
        .attr('y', fontSize)
        .call(wrapText)
}

// removed above lines for brevity
```

`data-width` 는 노드의 너비와 동일하게 설정

```jsx
function wrapText(selection) {
    selection.each(function () {
        const node = d3.select(this)
        const rectWidth = +node.attr('data-width')
        let word
        const words = node.text().split(' ').reverse()
        let line = []
        const x = node.attr('x')
        const y = node.attr('y')
        let tspan = node.text('').append('tspan').attr('x', x).attr('y', y)
        let lineNumber = 0
        while (words.length > 1) {
            word = words.pop()
            line.push(word)
            tspan.text(line.join(' '))
            const tspanLength = tspan.node().getComputedTextLength()
            if (tspanLength > rectWidth && line.length !== 1) {
                line.pop()
                tspan.text(line.join(' '))
                line = [word]
                tspan = addTspan(word)
            }
        }

        addTspan(words.pop())

        function addTspan(text) {
            lineNumber += 1
            return node
                .append('tspan')
                .attr('x', x)
                .attr('y', y)
                .attr('dy', `${lineNumber * fontSize}px`)
                .text(text)
        }
    })
}
```

`this` 는 현재 노드

```jsx
const words = node.text().split(' ').reverse()
```

모든 텍스트를 가져와 배열로 분할한 다음 반전시킴

```jsx
;[132, '제육볶음']
```

와 같이 표시된다.

임시로 빈 배열을 만들고 `line` 이라는 이름을 부여

```jsx
while (words.length > 1) {
    word = words.pop()
    line.push(word)
    tspan.text(line.join(' '))
    const tspanLength = tspan.node().getComputedTextLength()
    if (tspanLength > rectWidth && line.length !== 1) {
        line.pop()
        tspan.text(line.join(' '))
        line = [word]
        tspan = addTspan(word)
    }
}
```

원본 텍스트가 마지막 요소(숫자 데이터)에 도달할 때까지 루프 돌림

```jsx
word = words.pop()
```

배열에서 마지막 단어를 꺼낸다.

그런 다음, 해당 단어를 빈 배열 (`line`)에 삽입한 다음 `tspan`의 텍스트로 설정한다.
미리 `tspan`을 생성한 다음 텍스트를 추가하면 해당 텍스트의 길이를 확인하고 이를 현재 직사각형 요소의 너비와 비교할 수 있다.

```jsx
if (tspanLength > rectWidth && line.length !== 1) {
    line.pop()
    tspan.text(line.join(' '))
    line = [word]
    tspan = addTspan(word)
}
```

`tspan`의 길이가 직사각형의 너비보다 큰지 & 줄 배열의 길이가 1인지 아닌지 체크

텍스트가 직사각형 너비보다 길지 않으면
if문 skip. 라인 배열에 다른 단어를 추가한 다음 해당 라인 배열을 공백과 문자열로 결합하여 tspan의 텍스트로 설정한다.

`tspan`의 텍스트 길이가 직사각형 너비보다 길고
`line`에 포함된 단어가 두개 이상인 경우 `line` 배열에 추가한 마지막 단어를 `pop`하고
남은 `line` 배열을 하나의 문자열로 만들기 위해 `join`한다. 그 후 현재 `tspan`의 텍스트를 해당 문자열로 설정한다.

다음으로 `line`을 아직 포함시키지 않은 단어 `word`만 포함한 배열로 재정의한다.
이것은 `tspan`의 텍스트가 `rect` 너비보다 길도록 만들었던 단어다. `addTspan()`을 이용해 `tspan`을 재정의한다.

```jsx
function addTspan(text) {
    lineNumber += 1
    return node
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', `${lineNumber * fontSize}px`)
        .text(text)
}
```

루프는 `words` 배열의 마지막 요소에 도달하여 중단될 때까지 텍스트의 길이와 직사각형 너비를 계속 확인하고 새로운 `tspan`을 생성한다.

그런 다음 숫자 데이터 값인 마지막 요소를 노드 끝에 자체 `tsapn`으로 추가하여 표시하고 자체 선이 있는지 확인한다?

```jsx
{
    category: '중식',
    name: '쯔란양고기볶음 제육볶음 제육볶음 제육볶음 제육볶음',
    value: 19
}
```

![wrap-text](/public/img/d3chart/wraptext.png){: width="200px"}

키 생성

```jsx
export default function Treemap({ data, width, height }) {
    const svgRef = useRef(null)
    const legendRef = useRef(null)

    function renderTreemap() {
        const svg = d3.select(svgRef.current)
        const legendContainer = d3.select(legendRef.current)

        // code removed for brevity

        let categories = root.leaves().map((node) => node.data.category)

        categories = categories.filter(
            (category, index, self) => self.indexOf(category) === index
        )

        legendContainer.attr('width', width).attr('height', height / 4)

        const legend = legendContainer.selectAll('g').data(categories).join('g')

        legend
            .append('rect')
            .attr('width', fontSize)
            .attr('height', fontSize)
            .attr('x', fontSize)
            .attr('y', (_, i) => fontSize * 2 * i)
            .attr('fill', (d) => colorScale(d))

        legend
            .append('text')
            .attr('transform', `translate(0, ${fontSize})`)
            .attr('x', fontSize * 3)
            .attr('y', (_, i) => fontSize * 2 * i)
            .style('font-size', fontSize)
            .text((d) => d)
    }

    return (
        <div>
            <svg ref={svgRef} />
            <svg ref={legendRef} />
        </div>
    )
}
```

## 완성 코드

```jsx
import { useRef, useEffect } from 'react'
import * as d3 from 'd3'

export default function Treemap({ data, width, height }) {
    const svgRef = useRef(null)
    const legendRef = useRef(null)

    function renderTreemap() {
        const svg = d3.select(svgRef.current)
        svg.selectAll('g').remove()

        const legendContainer = d3.select(legendRef.current)
        legendContainer.selectAll('g').remove()

        svg.attr('width', width).attr('height', height)

        // create root node
        const root = d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value)

        // create treemap layout
        const treemapRoot = d3.treemap().size([width, height]).padding(1)(root)

        // create 'g' element nodes based on data
        const nodes = svg
            .selectAll('g')
            .data(treemapRoot.leaves())
            .join('g')
            .attr('transform', (d) => `translate(${d.x0},${d.y0})`)

        // create color scheme and fader
        const fader = (color) => d3.interpolateRgb(color, '#fff')(0.3)
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10.map(fader))

        // add treemap rects
        nodes
            .append('rect')
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('fill', (d) => colorScale(d.data.category))

        const fontSize = 12

        // add text to rects
        nodes
            .append('text')
            .text((d) => `${d.data.name} ${d.data.value}`)
            .attr('data-width', (d) => d.x1 - d.x0)
            .attr('font-size', `${fontSize}px`)
            .attr('x', 3)
            .attr('y', fontSize)
            .call(wrapText)

        function wrapText(selection) {
            selection.each(function () {
                const node = d3.select(this)
                const rectWidth = +node.attr('data-width')
                let word
                const words = node.text().split(' ').reverse()
                let line = []
                let lineNumber = 0
                const x = node.attr('x')
                const y = node.attr('y')
                let tspan = node
                    .text('')
                    .append('tspan')
                    .attr('x', x)
                    .attr('y', y)
                while (words.length > 1) {
                    word = words.pop()
                    line.push(word)
                    tspan.text(line.join(' '))
                    const tspanLength = tspan.node().getComputedTextLength()
                    if (tspanLength > rectWidth && line.length !== 1) {
                        line.pop()
                        tspan.text(line.join(' '))
                        line = [word]
                        tspan = addTspan(word)
                    }
                }
                addTspan(words.pop())

                function addTspan(text) {
                    lineNumber += 1
                    return node
                        .append('tspan')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('dy', `${lineNumber * fontSize}px`)
                        .text(text)
                }
            })
        }

        // pull out hierarchy categories
        let categories = root.leaves().map((node) => node.data.category)
        categories = categories.filter(
            (category, index, self) => self.indexOf(category) === index
        )

        legendContainer.attr('width', width).attr('height', height / 4)

        // create 'g' elements based on categories
        const legend = legendContainer.selectAll('g').data(categories).join('g')

        // create 'rects' for each category
        legend
            .append('rect')
            .attr('width', fontSize)
            .attr('height', fontSize)
            .attr('x', fontSize)
            .attr('y', (_, i) => fontSize * 2 * i)
            .attr('fill', (d) => colorScale(d))

        // add text to each category key
        legend
            .append('text')
            .attr('transform', `translate(0, ${fontSize})`)
            .attr('x', fontSize * 3)
            .attr('y', (_, i) => fontSize * 2 * i)
            .style('font-size', fontSize)
            .text((d) => d)
    }

    useEffect(() => {
        renderTreemap()
    }, [data])

    return (
        <div>
            <svg ref={svgRef} />
            <svg ref={legendRef} />
        </div>
    )
}
```

![entire-chart](/public/img/d3chart/entire-chart.png){: width="800px"}
