---
layout: post
title: 우리가 산책 앱을 만든다면
date: 2023-04-29 00:00:00 +0900
category: would-you-walk
published: true
---

`구글 맵 API 사용해서 지도 렌더링하기` 링크<br>
↓↓↓<br>

[클릭](https://hajongon.github.io/typescript/2023/03/26/google-map-api.html){: target="blank"}

<br>
<br>

## 원하는 위치만 불러오기
---
`걷기 앱`의 특성 상 굉장히 넓은 범위의 지도는 필요하지 않다.<br>
그렇다면 원하는 위치의 지도만 불러오는 것이 가능할까?<br>
가능하다.<br>

{% highlight tsx linenos %}
const MAP_OPTIONS: google.maps.MapOptions = {
  center: { lat: 37.5, lng: 127 },
  zoom: 8,
  restriction: {
    // 동대문구만 보이게
    latLngBounds: {
      north: 37.603576,
      south: 37.561169,
      east: 127.050408,
      west: 127.01325,
    },
    strictBounds: true,
  },
};
{% endhighlight %}

<br>

위와 같이 `restriction` 옵션을 사용하면 원하는 위치의 데이터만 불러올 수 있다.<br>
아래 화면에서 지도의 `-` 버튼을 눌러보아도 지도는 더 이상 축소되지 않았다.<br>
그렇다는 건, 더 좁은 범위로도 가져올 수 있다는 것!<br>

![동대문구지도](/public/img/team-project/%EB%8F%99%EB%8C%80%EB%AC%B8%EA%B5%AC%EC%A7%80%EB%8F%84.png){: width="800px"}

<br>
<br>

## 지도 커스텀하기
---
`styles`라는 옵션을 사용하면, 지도의 스타일을 꽤 다양하게 커스텀할 수 있다.<br>
생각보다 커스터마이즈할 수 있는 옵션이 많아서 놀랐다!<br>

<br>

### 지도 색상 바꾸기

{% highlight tsx linenos %}
const MAP_OPTIONS: google.maps.MapOptions = {
  center: { lat: 37.5, lng: 127 },
  zoom: 8,
  restriction: {
    // 동대문구만 보이게
  },
  styles: [
    {
      // 색상
      featureType: "all",
      stylers: [
        {
          saturation: -100,
        },
      ],
    },
    {
      // 물 색상
      featureType: "water",
      stylers: [
        {
          color: "#7dcdcd",
        },
      ],
    },
  ],
};
{% endhighlight %}


![지도 색상 변경](/public/img/team-project/map-color-customize.png){: width="800px"}

물 색상은 유지한 채로 모든 지도의 `saturation`을 -100으로 줘봤다.


<br>

### 건물 이름 지우기

건물 이름이 너무 많으면 번잡할 것 같아서, 건물 이름을 지우는 옵션도 찾아봤다.

{% highlight tsx linenos %}
const MAP_OPTIONS: google.maps.MapOptions = {
  center: { lat: 37.5, lng: 127 },
  zoom: 8,
  restriction: {
    // 동대문구만 보이게
  },
  styles: [
    // 지도는 회색, 물 색상은 유지
    {
      // 건물 이름 가리기
      featureType: "all",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    // 지도 단순화하기
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { visibility: "simplified" },
        { hue: "#00ddff" },
        { saturation: -50 },
        { lightness: -15 },
        { weight: 1.5 },
      ],
    },
  ],
};
{% endhighlight %}

![건물 이름 지우기](/public/img/team-project/no-building-name.png){: width="800px"}

네, 가능합니다.

<br>

### 지도 단순화하기

지도를 좀 더 단순화시킬 수 있는 방법이 있을까 찾아보니, `visibility: simplified`라는 속성이 있었다. 도로에 적용시켜보았다.

{% highlight tsx linenos %}
const MAP_OPTIONS: google.maps.MapOptions = {
  center: { lat: 37.5, lng: 127 },
  zoom: 8,
  restriction: {
    // 동대문구만 보이게
  },
  styles: [
    {
      // 색상
    },
    {
      // 물 색상
    },
    {
      // 건물 이름 가리기
    },

    {
      // 지도 단순화하기
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { visibility: "simplified" }, // road가 단순화된다.
        { hue: "#000000" }, // 도로의 색상을 지정한다.
        { saturation: -50 }, // 색상의 채도를 설정한다.
        { lightness: -15 }, // 색상의 밝기를 설정한다.
        { weight: 1.5 }, // 도로의 두께를 지정한다.
      ],
    },
  ],
};
{% endhighlight %}

![도로 단순화](/public/img/team-project/simplify.png){: width="800px"}

도로가 얇아져서 지도가 훨씬 단순해진 것을 확인할 수 있다.


## 경로 그리기

경로를 그릴 수는 있는 것 같은데, API 문제인지 현재는 작동하지 않는다.<br>
코드만 기재하겠다.

{% highlight tsx linenos %}
      // DirectionsService 객체 생성
      const directionsService = new google.maps.DirectionsService();
      // 경로 그리기 함수
      const calcRoute = () => {

        const start = { lat: 37.556877, lng: 126.969667 }; // 서울역
        const end = { lat: 37.583834, lng: 127.058722 }; // 서울시립대학교

        // 위에서 현재 위치를 받아 놓고, start, end를 설정할 수도 있다.
        // const start = coordinates;
        // const end = coordinates;

        const request = {
          origin: start,
          destination: end,
          travelMode: google.maps.TravelMode.DRIVING,
        };
        directionsService.route(request, function (result, status) {
          console.log(status);
          if (status == "OK") {
            console.log("ok");
            const directionsRenderer = new google.maps.DirectionsRenderer({
              suppressMarkers: true,
              // 경로 색상 및 굵기
              polylineOptions: {
                strokeColor: "#FFA500", // 주황색
                strokeWeight: 2,
              },
            });
            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(result);
          }
        });
      };
      calcRoute();
{% endhighlight %}
