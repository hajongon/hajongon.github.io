---
layout: post
title: bootstrap modal 과 apexchart 연결
date: 2023-10-20 03:00:00 +0900
category: apexchart
published: true
---

![modal](/public/img/apexchart/modal.gif){: width="800px"}

차트 내부 bar 클릭 시 모달 창이 열리고, bar에 해당하는 데이터만 테이블에 매핑되어 출력되도록 구현했다.

[bar에 해당하는 데이터 불러오기](https://hajongon.github.io/apexchart/2023/10/18/apexchart.html)


{% highlight javascript linenos %}
const options = {

chart: {
	events: {
		dataPointSelection: handleBarClick
		},
	}
}
{% endhighlight %}

bar 클릭시 events의 dataPointSelection에 연결된 handleBarClick 함수 실행

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

        // 1시간 이후의 시간을 계산한다.
        const targetedTime = new Date(clickedTime);
        const oneHourAfterClickedTime = new Date(clickedTime);

        // DB의 시간은 한국 로컬 시각인데, 로컬라이징을 한 번 더하는 이슈가 있어서 
        // 9시간을 뺀다.
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

		// modal에 data를 입력하는 함수 실행 
        displayDataInModal(filteredData);

		// 새로운 모달 생성
        var myModal = new bootstrap.Modal(document.getElementById('detailModal'), {
            keyboard: false
        });

		// 모달 오픈
        myModal.toggle();
    }
}
{% endhighlight %}

따로 CSS를 주지 않았는데 클릭하지 않았을 때 모달이 보이지 않는 이유?

![vscode fade tag](/public/img/apexchart/vscode-fade-tag.png){: width="400px"}
![chrome fade tag](/public/img/apexchart/chrome-fade.png){: width="400px"}

fade인데 show 클래스가 없을 경우 opacity가 0으로 자동 설정됨

![chrome show tag](/public/img/apexchart/chrome-show.png){: width="800px"}

클릭 이벤트 발생하면 show 클래스 추가됨


## displayDataInModal

{% highlight javascript linenos %}
function displayDataInModal(filteredData) {
    const modalBody = document.querySelector('.modal-body'); // modal-body 요소 선택

    // 표 생성
    const table = document.createElement('table');
    // 표 타이틀 생성
    const tableTitle = document.createElement('div');

    table.className 
        = 'table table-hover table-rounded table-striped border gy-7 gs-7'; 
    // 클래스를 넣어 부트스트랩 테이블 스타일을 적용할 수 있음

	// 표 타이틀 커스터마이징 (요청 시각 데이터로부터 변형)
    const date = filteredData[0].request_time;
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[+date.slice(5, 7) - 1];
    const day = +date.slice(8, 10);
    let hourText = date.slice(11, 13);
    let hour = +date.slice(11, 13);
    const ampm1 = hour >= 12 ? 'PM' : 'AM';

    let nextHour = hour + 1;
    const ampm2 = nextHour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // 0이면 12로 바꾸기

    nextHour = nextHour % 12;
    nextHour = nextHour ? nextHour : 12;

    const timeKey1 = `${month} ${day} ${hour}${ampm1}`;
    const timeKey2 = `${month} ${day} ${nextHour}${ampm2}`;

	// 요청 시각 ~ 요청 시각 + 1
    tableTitle.innerHTML = timeKey1 + ' ~ ' + nextHour + ampm2;

    // 테이블 헤더 추가
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th>API 이름</th>' +
        '<th>요청 경로</th>' +
        '<th>요청 방법</th>' +
        '<th>요청 시간</th>' +
        '<th>응답 시간</th>' +
        '<th>요청 코드</th>' +
        '<th>응답 코드</th>';
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // 테이블 바디 추가
    const tbody = document.createElement('tbody');
    filteredData.forEach(function (data) {
        const row = document.createElement('tr');
        row.innerHTML = '<td>' + data.service_api_name + '</td>' +
            '<td>' + data.request_path + '</td>' +
            '<td>' + data.request_method + '</td>' +
            '<td>' + data.request_time + '</td>' +
            '<td>' + data.response_time + '</td>' +
            '<td>' + data.request_result + '</td>' +
            '<td>' + data.response_result + '</td>';
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // 기존의 데이터 삭제
    while (modalBody.firstChild) {
        modalBody.removeChild(modalBody.firstChild);
    }

    // 데이터 타이틀과 표를 모달 창의 modal-body에 추가
    modalBody.appendChild(tableTitle);
    modalBody.appendChild(table);
}
{% endhighlight %}