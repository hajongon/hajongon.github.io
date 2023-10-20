---
layout: post
title: apexchart bar 클릭 시 해당 데이터 출력
date: 2023-10-19 03:00:00 +0900
category: apexchart
published: true
---

## 결과

![bar chart](/public/img/apexchart/bar-chart.png){: width="800px"}

성공(blue)과 실패(green)를 나눠서 출력할 수 있어야 한다.
<br>

![console data](/public/img/apexchart/console-data.png){: width="800px"}

나눠서 잘 찍히는 것을 볼 수 있다.
<br>
<br>

## 코드 분석

{% highlight javascript linenos %}
function handleBarClick(event, chartContext, config) {
    if (config.dataPointIndex !== undefined) {
    // 성공, 실패 여부 필터링
        const successOrFailFiltered = apiLogData.filter(item => {
            return config.seriesIndex === 0 ?
            item.result_code === 200 : item.result_code !== 200;
        });
        const dataIndex = config.dataPointIndex;

        // 해당 인덱스에 해당하는 request_time 값을 가져온다.
        const clickedTime = sortedLogData[dataIndex];

        // 1시간 이후의 시각을 계산한다.
        const targetedTime = new Date(clickedTime);
        const oneHourAfterClickedTime = new Date(clickedTime);

        // DB의 시간은 한국 로컬 시각인데,
        // 로컬라이징을 한 번 더하는 이슈가 있어서 9시간을 뺀다.
        targetedTime.setHours(targetedTime.getHours() - 9);
        // 한 시간이 지난 시각이기 때문에 8시간을 뺀다.
        oneHourAfterClickedTime.setHours(oneHourAfterClickedTime.getHours() - 8);

        // 리스트를 한 번 더 필터링하여 해당 시간 범위의 데이터를 가져온다.
        const filteredData = successOrFailFiltered.filter(item => {
            const requestTime = new Date(item.request_time);
            requestTime.setHours(requestTime.getHours() - 9);
            return requestTime >= targetedTime
                && requestTime <= oneHourAfterClickedTime;
        });

        // 필터링된 데이터를 콘솔에 출력한다.
        console.log('Filtered Data:', filteredData);
    }

}
{% endhighlight %}

### 성공, 실패 필터링

![stack column](/public/img/apexchart/stack-column.png){: width="200px"}
<br>

아랫층은 seriesIndex가 0이고, 윗층은 1이다.
그것을 이용해 성공과 실패를 분리해서 뽑아올 수 있다.

{% highlight javascript linenos %}
const successOrFailFiltered = apiLogData.filter(item => {
	return config.seriesIndex === 0 ? 
	item.result_code === 200 : item.result_code !== 200;
});
{% endhighlight %}

전체 데이터 중 result_code가 200 인 것만, 혹은 아닌 것만 return


그리고 성공 실패를 걸러낸 배열에서 타겟 시간에 포함된 데이터만 다시 필터링한다.

{% highlight javascript linenos %}
const filteredData = successOrFailFiltered.filter(item => {
	const requestTime = new Date(item.request_time);
	requestTime.setHours(requestTime.getHours() - 9);
	return requestTime >= targetedTime 
		&& requestTime <= oneHourAfterClickedTime;
});
{% endhighlight %}

handleBarClick은 차트와 어떻게 연결되어 있을까?
{% highlight javascript linenos %}
const options = {
    chart: {
        events: {
            dataPointSelection: handleBarClick
        },
    },
}
{% endhighlight %}

chart - events -dataPointSelection 에 연결