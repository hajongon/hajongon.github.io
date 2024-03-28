---
layout: post
title: React Highcharts 빈도 그래프 구현 (이동평균 활용)
date: 2024-03-28 10:00:00 +0900
category: React
published: true
---

## 문제

---

[Highchart를 활용한 히스토그램 구현](https://hajongon.github.io/chart/2024/03/20/highcharts-histogram.html)

<br>

히스토그램에서는 plot line의 가시성이 떨어질 수 밖에 없어요. <br>
그래서 데이터를 line으로 연결한 차트가 더 나을 것 같다는 판단을 했어요. <br>

아래는 line으로 구현한 차트입니다.<br>

![not-smoothed-data](/public/img/chart/notsmoothed-data.png){: width="800px"}<br>

제가 보던 빈도 그래프의 느낌이 아니네요? ㅎㅎ <br>
저는 이런 느낌을 생각했어요. <br>

![frequency-chart-example](/public/img/chart/frequency-graph.png){: width="800px"}<br>

자세히 보면, 데이터들의 끝점을 이은 게 아니라 평균값들을 이어가면서 그려진 느낌이 나죠? <br>
이게 뭔지 한참 찾아봤어요.<br>

## 해결

---

<br>
그것은 바로바로 '이동평균'이었습니다.

![gpt-moving-average](/public/img/chart/gpt-moving-average.png){: width="800px"} <br>

'데이터의 일반적인 추세를 부드럽게' !!<br>
제가 딱 찾던 것이었어요.<br>

그래서 Highchart 내부에서 이동평균을 계산해 차트를 그리는 기능이 있는지 찾아봤지만 그런 건 없는 것 같더라고요. <br>
So, 이동평균 함수를 구현하기로 결정했습니다.<br>

사실 제가 직접 구현한 건 아니고 째찌삐띠의 도움을 많이 받았어요. <br>

```jsx
function smoothData(data) {
    /* data는 [x, y] 형태입니다.
    
    제가 구현할 차트에서 x는 0부터 1까지 확률이고,
    y는 'x라는 확률에 해당하는 요소의 수' 입니다.

    */

    // 윈도우 크기
    const windowSize = 5

    /*
    
    윈도우 크기가 10이라는 것은 이동 평균을 계산할 때 각 데이터 포인트를 포함하여
    주변 총 10개의 데이터 포인트를 사용한다는 의미입니다.
    
    이동 평균 계산에 사용되는 "윈도우"는 
    현재 포인트를 중심으로 한 주변 데이터 포인트들의 범위를 지칭하며, 
    이 범위 내의 데이터 포인트들의 값을 평균하여 현재 포인트의 이동 평균값을 계산합니다.

    예를 들어, 특정 데이터 포인트에 대해 이동 평균을 계산한다고 가정할 때:

    윈도우 크기가 10이면, 해당 데이터 포인트를 중심으로 
    앞뒤로 9개의 데이터 포인트를 포함하여 총 10개의 데이터 포인트를 고려합니다.
    
    윈도우는 해당 포인트를 포함해 왼쪽으로 4개, 오른쪽으로 5개의 포인트를 포함하거나, 
    또는 다른 방식으로 분포할 수 있습니다
    (단, 코드에서는 시작 인덱스가 음수가 되지 않도록 하고, 
    끝 인덱스가 데이터 배열의 크기를 초과하지 않도록 조정합니다).

    즉, 윈도우 크기가 커질수록 그래프는 더욱 smooth~ 해질 것입니다.

    */

    // 이동 평균을 계산한 결과를 저장할 배열
    const smoothedData = []

    // point는 [x, y] 형태
    data.forEach((point, index) => {
        // 시작과 끝 부분에서 윈도우 크기 조정
        // 윈도우 사이즈가 10이면 자기 자신의 인덱스에서 양 옆으로 5만큼 떨어진 것이
        // start, end가 됩니다.

        // start가 음수가 될 수도 있고, end가 배열의 범위를 넘어설 수도 있기 때문에
        // 삼항조건문을 이용하여 체크해줍니다.
        let start = index - Math.floor(windowSize / 2)
        let end = index + Math.floor(windowSize / 2)
        start = start < 0 ? 0 : start
        end = end >= data.length ? data.length - 1 : end

        // 윈도우 범위 내의 데이터 포인트들의 y 값 평균 계산
        let sum = 0
        for (let i = start; i <= end; i++) {
            sum += data[i][1]
        }

        // start 부터 end 까지 y 값의 평균을 average에 할당합니다.
        const average = sum / (end - start + 1)

        // 이동 평균 데이터를 smoothedData에 push합니다.
        smoothedData.push([point[0], average])
    })
    return smoothedData
}
```

<br>

위 함수를 통과한 data를 차트에 뿌리면 아래와 같이 렌더링됩니다. <br>

![smoothed-data](/public/img/chart/window-size-5.png){: width="800px"} <br>

훨씬 부드러워진 것을 볼 수 있네요 :) <br>
감사합니다. 더 좋은 지식과 정보로 여러분들을 찾아뵙겠습니다.<br>
