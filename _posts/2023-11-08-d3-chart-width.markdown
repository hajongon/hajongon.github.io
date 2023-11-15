---
layout: post
title: d3 차트 width height 부모 요소에 맞게 동적으로 변경하기
date: 2023-11-07 03:00:00 +0900
category: frontend
published: true
---

## 작업 배경

트리맵 차트를 만들었다.

```jsx
export default function Treemap({ data, width, height }) {
    const svgRef = useRef(null)
    const legendRef = useRef(null)

    const { noDataError } = useContext(AppContext)

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
        const fader = (color) => d3.interpolateRgb(color, '#fff')(0.4)
        const colorScale = d3.scaleOrdinal([
            '#1956A6',
            '#2A7BE4', // 한 단계 어둡게
        ])

        // add treemap rects
        nodes
            .append('rect')
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('fill', (d) => colorScale(d.data.category))

        const fontSize = 8
        const legendFontSize = 10

        // add text to rects
        nodes
            .append('text')
            .text((d) => `${d.data.name} ${d.data.value}`)
            .attr('data-width', (d) => d.x1 - d.x0)
            .attr('font-size', `${fontSize}px`)
            // 각 element에 패딩을 주려면 x, y 옆 param으로 숫자를 입력하면 됨
            .attr('x', 3)
            .attr('y', fontSize + 3)
            .style('fill', 'white') // Set font color to white
            .style('font-weight', 'light') // Set font weight to bold (or any other desired value)
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
            .attr('width', legendFontSize)
            .attr('height', legendFontSize)
            .attr('x', legendFontSize)
            .attr('y', (_, i) => legendFontSize * 2 * i)
            .attr('fill', (d) => colorScale(d))

        // add text to each category key
        legend
            .append('text')
            .attr('transform', `translate(0, ${legendFontSize})`)
            .attr('x', legendFontSize * 2.5)
            .attr('y', (_, i) => legendFontSize * 2 * i - 2)
            .style('font-size', legendFontSize)
            .text((d) => d)
    }

    useEffect(() => {
        renderTreemap()
    }, [data])

    return (
        <FalconComponentCard className="h-100 ps-0 pe-0 shadow-none bg-transparent">
            <FalconComponentCard.Header
                title="항생제 처방 이력"
                light={false}
                charts={true}
                className="bg-transparent"
            />
            <FalconCardBody className="bg-transparent">
                <Flex direction="column">
                    {noDataError.hist ? (
                        <div>해당 환자의 처방 이력이 없습니다.</div>
                    ) : (
                        <>
                            <svg ref={svgRef} style={ { flex: '1' } } />
                            <svg
                                ref={legendRef}
                                style={ { marginTop: '10px ' } }
                            />
                        </>
                    )}
                </Flex>
            </FalconCardBody>
        </FalconComponentCard>
    )
}
```

위 트리맵을 만드는 방법은 아래 아티클을 참조하세요. <br>
[트리맵 만들기](https://medium.com/swlh/create-a-treemap-with-wrapping-text-using-d3-and-react-5ba0216c48ce)

<br>

## 이슈 1.

```jsx
<Treemap data={allOrdCount} height={400} width={420} />
```

이런 식으로 `height`와 `width`를 넘겨주다보니, 브라우저의 크기가 변경됐을 때도 차트의 크기가 고정되어있는 문제가 발생했다. `flex`를 줘보기도 하고, 넘겨주는 `width` props 에 `100%` string 값을 넣어보기도 했지만 해결되지 않았다.

<br>

## 해결 방법

1. 넘겨주는 props에서 width를 제외한다.

```jsx
// 기존
<Treemap data={allOrdCount} height={400} width={420} />

// 변경
<Treemap data={allOrdCount} height={400} />
```

2. svg의 속성으로 width 100% 할당

```jsx
// 기존
export default function Treemap({data, width, height}) {
	// ...
	// props를 속성으로 할당
	svg.attr('width', width).attr('height', height)
	// ...
}
// 변경
export default function Treemap({data, height}) {
	// ...
	// props를 속성으로 할당
	svg.attr('width', '100%').attr('height', height)
	// ...
}
```

3. `treemapRoot` 의 사이즈를 param으로 직접 입력

```jsx
// 기존

  function renderTreemap() {
    const svg = d3.select(svgRef.current)
    svg.selectAll('g').remove()

    const legendContainer = d3.select(legendRef.current)
    legendContainer.selectAll('g').remove()

    // Update the SVG element's width to 100%
    svg.attr('width', '100%').attr('height', height)

    // ...
    // width 변수 사용해야 하는데 props에 없음
    const treemapRoot = d3.treemap().size([width, height]).padding(1)(root)
    // ...
  }

// 변경

export default function Treemap({ data, height }) {
	// ...
    svg.attr('width', '100%').attr('height', height)
	// ...
    const treemapRoot = d3.treemap().size([width, height]).padding(1)(root)
  }

  useEffect(() => {
    // Call renderTreemap and pass the width as an argument
    renderTreemap(svgRef.current.clientWidth)
  }, [data, height])

  return (
	  // ...
  )

```

이렇게 `svgRef.current.clientWidth`를 직접 width 값으로 입력해줬더니

![chart-rendered](/public/img/d3chart/chart-width-sizing.png){: width="800px"}

부모요소에 딱 들어맞게 되었다.

<br>

## 이슈 2.

하지만!
이 상태에서 브라우저의 크기를 조절하면?

![chart-size-mismatch](/public/img/d3chart/chart-size-doesnt-fit.png){: width="800px"}

차트가 함께 줄어드는 게 아니라 초기에 불러온 width가 유지되는 이슈가 다시 발생하게 된다.

<br>

## 해결 방법

리액트의 `useEffect`에는 dependency array가 있다. 이에 들어있는 상태 값이 변함에 따라 useEffect가 재실행될 수 있다.

브라우저의 width를 상태로 만들어 dependency array 에 넣어준다.

```jsx
const [windowWidth, setWindowWidth] = useState(window.innerWidth)
```

그리고 `useEffect`를 하나 새로 만들어서, 브라우저의 크기가 달라짐에 따라 `windowWidth`가 갱신될 수 있게 해준다.

```jsx
// Add a window resize event listener to update windowWidth
useEffect(() => {
    function handleResize() {
        setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => {
        window.removeEventListener('resize', handleResize)
    }
}, [])
```

마지막으로 svg를 render하는 `useEffect` 구문의 dependency array에 `windowWidth`를 추가한다.

```jsx
useEffect(() => {
    renderTreemap(svgRef.current.clientWidth)
}, [data, height, windowWidth])
```

이제 브라우저의 크기가 바뀌면 svg 차트의 크기 또한 동적으로 변할 것이다. 테스트해보자.

![chart-rendered](/public/img/d3chart/chart-width-sizing.png){: width="800px"}

초기 렌더링 시 화면이다. 브라우저의 크기를 조절하면

![chart-sizing-completed](/public/img/d3chart/chart-size-fit.png){: width="800px"}

차트가 해당 너비에 맞게 조절되어 그려지는 것을 볼 수 있다!

<br>

## 전체 코드

전체 코드는 아래와 같다.

```jsx
import { useState, useRef, useEffect, useContext } from 'react'
import * as d3 from 'd3'
import FalconComponentCard from './FalconComponentCard'
import FalconCardBody from './FalconCardBody'
import AppContext from 'context/Context'
import Flex from './Flex'

export default function Treemap({ data, height }) {
    const svgRef = useRef(null)
    const legendRef = useRef(null)
    const { noDataError } = useContext(AppContext)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    function renderTreemap(width) {
        const svg = d3.select(svgRef.current)
        svg.selectAll('g').remove()
        const legendContainer = d3.select(legendRef.current)
        legendContainer.selectAll('g').remove()
        svg.attr('width', '100%').attr('height', height)

        const root = d3
            .hierarchy(data)
            .sum((d) => d.value)
            .sort((a, b) => b.value - a.value)

        const treemapRoot = d3.treemap().size([width, height]).padding(1)(root)
        const nodes = svg
            .selectAll('g')
            .data(treemapRoot.leaves())
            .join('g')
            .attr('transform', (d) => `translate(${d.x0},${d.y0})`)

        const fader = (color) => d3.interpolateRgb(color, '#fff')(0.4)
        const colorScale = d3.scaleOrdinal(['#2c7be5', '#1956A6'])

        nodes
            .append('rect')
            .attr('width', (d) => d.x1 - d.x0)
            .attr('height', (d) => d.y1 - d.y0)
            .attr('fill', (d) => colorScale(d.data.category))
        const fontSize = 8
        const legendFontSize = 10

        nodes
            .append('text')
            .text((d) => `${d.data.name} ${d.data.value}`)
            .attr('data-width', (d) => d.x1 - d.x0)
            .attr('font-size', `${fontSize}px`)
            .attr('x', 3)
            .attr('y', fontSize + 3)
            .style('fill', 'white')
            .style('font-weight', 'light')
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

        let categories = root.leaves().map((node) => node.data.category)
        categories = categories.filter(
            (category, index, self) => self.indexOf(category) === index
        )

        legendContainer.attr('width', width).attr('height', height / 4)
        const legend = legendContainer.selectAll('g').data(categories).join('g')

        legend
            .append('rect')
            .attr('width', legendFontSize)
            .attr('height', legendFontSize)
            .attr('x', legendFontSize)
            .attr('y', (_, i) => legendFontSize * 2 * i)
            .attr('fill', (d) => colorScale(d))

        legend
            .append('text')
            .attr('transform', `translate(0, ${legendFontSize})`)
            .attr('x', legendFontSize * 2.5)
            .attr('y', (_, i) => legendFontSize * 2 * i - 2)
            .style('font-size', legendFontSize)
            .text((d) => d)
    }

    useEffect(() => {
        renderTreemap(svgRef.current.clientWidth)
    }, [data, height, windowWidth])

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <FalconComponentCard className="h-100 ps-0 pe-0 shadow-none bg-transparent">
                 {' '}
            <FalconComponentCard.Header
                title="항생제 처방 이력"
                light={false}
                charts={true}
                className="bg-transparent"
            />
                  <FalconCardBody className="bg-transparent">
                       {' '}
                {noDataError.hist ? (
                    <div>해당 환자의 처방 이력이 없습니다.</div>
                ) : (
                    <>
                                    <svg ref={svgRef} />
                                    <svg
                            ref={legendRef}
                            style={ { marginTop: '10px ' } }
                        />         {' '}
                    </>
                )}
                     {' '}
            </FalconCardBody>   {' '}
        </FalconComponentCard>
    )
}
```
