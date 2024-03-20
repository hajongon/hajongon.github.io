---
layout: post
title: Highcharts - React 히스토그램 그리기
date: 2024-03-20 10:00:00 +0900
category: Chart
published: true
---

## Highcharts

![highcharts](/public/img/chart/highcharts.png){: width="800px"} <br>

확률 분포를 표현하기 위한 차트를 검색하다가 highcharts 라이브러리를 알게 되었다. <br>
단순히 확률(x축), 빈도(y축)만 필요했기 때문에 히스토그램 타입으로 바꿔서 사용할 예정이다. <br>

## 설치

```
npm i highcharts --save
npm i highcharts-react-official
```

## 확률 분포 그리기

### 코드

```jsx
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

// 모듈 초기화
import histogramBellcurve from 'highcharts/modules/histogram-bellcurve'
histogramBellcurve(Highcharts)

function processData(data) {
  const frequency = {}
  data.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1
  })
  return Object.entries(frequency).map(([x, y]) => [parseFloat(x), y])
}

const ProbabilityDistribution = () => {
  const options = {
    chart: {
      type: 'histogram',
      zoomType: 'xy'
    },
    title: {
      text: '확률 분포'
    },
    xAxis: {
      title: {
        text: '확률'
      },
      min: 0,
      max: 1,
      tickInterval: 0.1
    },
    yAxis: {
      title: {
        text: '분포도'
      },
      startOnTick: true,
      endOnTick: true,
      min: 0
    },
    series: [
      {
        name: '분포',
        data: /* 데이터 (배열 형태) */
      }
    ]
  }

  return (
    <HighchartsReact highcharts={Highcharts} options={options} />
  )
}

export default ProbabilityDistribution
```

<br>

### 랜덤 데이터 생성 및 주입

```jsx
// 데이터를 전처리하여 각 값의 빈도수를 계산하는 함수
function processData(data) {
    const frequency = {}
    data.forEach((value) => {
        frequency[value] = (frequency[value] || 0) + 1
    })
    return Object.entries(frequency).map(([x, y]) => [parseFloat(x), y])
}

function generateRandomData() {
    const data = []
    for (let i = 0; i < 1000; i++) {
        // 0 이상 1 미만의 난수 1000개 생성
        const num = +Math.random().toFixed(2)
        data.push(num)
    }
    console.log(data)
    return data
}

// 데이터 전처리
const processedData = processData(generateRandomData())

// 생략

const options = {
    chart: {
        type: 'histogram',
        zoomType: 'xy',
    },
    title: {
        text: '확률 분포',
    },
    xAxis: {
        title: {
            text: '확률',
        },
        min: 0,
        max: 1,
        tickInterval: 0.1,
    },
    yAxis: {
        title: {
            text: '분포도',
        },
        startOnTick: true,
        endOnTick: true,
        min: 0,
    },
    series: [
        {
            name: '분포',
            // 전처리한 데이터 주입
            data: processedData,
        },
    ],
}
```

<br>

### 출력 결과

![probability-distribution](/public/img/chart/probability-distribution.png){: width="800px"} <br>

## 평균값, 중앙값, 최빈값 라인 긋기

### 평균값, 중앙값, 최빈값 구하는 함수

```jsx
// 평균값 계산
function calculateMean(data) {
    const sum = data.reduce((acc, val) => acc + val, 0)
    return sum / data.length
}

// 중앙값 계산
function calculateMedian(data) {
    const sortedData = [...data].sort((a, b) => a - b)
    const mid = Math.floor(sortedData.length / 2)
    return sortedData.length % 2 !== 0
        ? sortedData[mid]
        : (sortedData[mid - 1] + sortedData[mid]) / 2
}

// 최빈값 계산
function calculateMode(data) {
    const frequency = {}
    let maxFreq = 0
    let modes = []
    data.forEach((value) => {
        frequency[value] = (frequency[value] || 0) + 1
        if (frequency[value] > maxFreq) {
            maxFreq = frequency[value]
            modes = [value]
        } else if (frequency[value] === maxFreq) {
            modes.push(value)
        }
    })
    // 여러 개의 최빈값 중 하나를 선택
    return modes[0]
}
```

<br>

### 차트에 그리기

```jsx
// 데이터 전처리
const rawData = generateRandomData()
const processedData = processData(rawData)

// 통계치 계산
const mean = calculateMean(rawData)
const median = calculateMedian(rawData)
const mode = calculateMode(rawData)

const options = {
    chart: {
        type: 'histogram',
        zoomType: 'xy',
    },
    title: {
        text: '확률 분포',
    },
    xAxis: {
        title: {
            text: '확률',
        },
        min: 0,
        max: 1,
        tickInterval: 0.1,
        plotLines: [
            // 평균값과 중앙값의 위치가 겹쳐 어떤 식으로 표현할지 고민중이에요
            // 일단은 중앙값만
            {
                value: median,
                color: 'green',
                width: 4,
                zIndex: 100,
                label: {
                    text: `중앙값: ${median.toFixed(2)}`,
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                    },
                    x: 10, // 가로 위치 조정
                    y: 0, // 세로 위치 조정 (값이 작을수록 위로 이동)
                },
            },
            {
                value: mode,
                color: 'blue',
                width: 4,
                zIndex: 100,
                label: {
                    text: `최빈값: ${mode.toFixed(2)}`,
                    style: {
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                    },
                    x: 10, // 가로 위치 조정
                    y: 0, // 세로 위치 조정 (값이 작을수록 위로 이동)
                },
            },
        ],
    },
    // ...
}
```

<br>

## 출력 결과

![medianAndMode](/public/img/chart/medianAndMode.png){: width="800px"} <br>
