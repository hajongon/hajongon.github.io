---
layout: post
title: Google Maps Api를 활용해서 입력한 주소를 화면에 출력하기
date: 2023-03-27 00:00:00 +0900
category: TypeScript
published: true
---

# 개요

---

원하는 주소를 받아서, 지도 상에서 그 위치를 출력하는 간단한 어플리케이션을 만들어보자.

<br>
<br>
# Google Geocoding API
---
위치 정보는 `Google Geocoding API`를 사용한다.

<br>

[Google Geocoding API 링크][link1]

[link1]: https://developers.google.com/maps/documentation/geocoding/overview

<br>

아래 이미지 빨간 박스 URL으로 요청을 보낼 수 있다.
<br>
<br>
![geocoding api](/public/img/ts_img/google-map-api/geocoding-api.png){: width="60%" height="60%"}{: margin-left: 2rem;}
<br>
<br>
Google Maps Platform 가입 -> API Key 복사

`https://maps.googleapis.com/maps/api/geocode/json?address=입력받을주소&key=YOUR_API_KEY`

<br>
<br>
# 데이터 받아오기
---
fetch 혹은 axios를 이용해 GET 요청을 한다. 이번 프로젝트에서는 axios를 사용한다.
<br>
<br>
{% highlight typescript linenos %}
axios
  .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(입력 받을 주소)}&key=${MY API KEY}`)
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
{% endhighlight %}
<br>
<br>
이제 주소를 입력하고 SEARCH ADDRESS 버튼을 누르면 그에 해당하는 정보가 콘솔에 출력될 것이다.

<br>
<br>

![console data](/public/img/ts_img/google-map-api/consoledata.png){: width="60%" height="60%"}{: margin-left: 2rem;}

<br>
<br>
`encodeURI`는 입력 받은 문자열을 URL 호환 가능한 문자열로 변환시켜주는 메서드다.
<br>
<br>

![geometry location](/public/img/ts_img/google-map-api/geometry.png){: width="30%" height="30%"}{: margin-left: 2rem;}

<br>
<br>
우리에게는 좌표가 필요하다. `res.data.results[0].geometry.location`에 원하는 정보가 들어있다. 이걸 가져오면 된다.

{% highlight typescript linenos %}
axios
  .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(입력 받을 주소)}&key=${MY API KEY}`)
  .then(res => {
    const coordinates = res.data.results[0].geometry.location;
  })
  .catch(err => {
    console.log(err)
  })
{% endhighlight %}

<br>
지금 작성 중인 코드가 타입스크립트라는 것을 생각해보자. 
<br>
타입스크립트는 res 안에 data가 있는지, data 안에 results가 있는지의 여부를 알지 못한다. 하지만 에러표시줄을 띄워주지도 않는다. 우리는 타입에 대한 정의를 해줘야 한다.
<br>
<br>
{% highlight typescript linenos %}

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number, lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
}

...

axios
  .get<GoogleGeocodingResponse>
    (`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(입력 받을 주소)}&key=${MY API KEY}`)
  .then(res => {
    if (res.data.status !== 'OK') {
      throw new Error('에러');
    }
    const coordinates = res.data.results[0].geometry.location;
  })
  .catch(err => {
    alert(err.message);
    console.log(err)
  })

{% endhighlight %}
<br>
<br>
다른 필드들도 다 정의해주면 좋겠지만, 지금은 필요한 필드만 정의한다.

<br>
<br>
# 지도 불러오기
---
이제 지도 상에 해당 좌표 영역을 표시해주기만 하면 된다. 어떻게 할까요?

이번에도 구글 API를 사용해보자.
<br>
<br>

[Maps JavaScript API 링크][link2]

[link2]: https://developers.google.com/maps/documentation/javascript/overview

<br>
먼저, HTML head 태그 내에 api를 불러오는 script를 작성한다.

{% highlight html linenos %}

<script src="https://maps.googleapis.com/maps/api/js?key=GOOGLE_API_KEY" async defer></script>

{% endhighlight %}

<br>

공식 문서를 읽어보면, 우리는 `google.maps.` 생성자 함수를 인스턴스화 해야 한다. 그리고 백엔드에서 얻은 한 쌍의 좌표를 거기에다 전달해야 한다.

{% highlight typescript linenos %}

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number, lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
}

...

axios
  .get<GoogleGeocodingResponse>
    (`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(입력 받을 주소)}&key=${MY API KEY}`)
  .then(res => {
    if (res.data.status !== 'OK') {
      throw new Error('에러');
    }
    const coordinates = res.data.results[0].geometry.location;
    const map = new google.maps.Map(document.getElementById("map"), {
      center: coordinates,
      zoom: 8
    })
  })
  .catch(err => {
    alert(err.message);
    console.log(err)
  })

{% endhighlight %}

<br>
google은 HTML에서 불러왔기 때문에 전역으로 사용할 수 있지만 타입스크립트는 그걸 모른다.

{% highlight typescript linenos %}
declare var google: any;
{% endhighlight %}

<br>
이렇게 선언해주면 된다. 마커도 추가해보자.

{% highlight typescript linenos %}

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number, lng: number } } }[];
  status: 'OK' | 'ZERO_RESULTS';
}

...

axios
  .get<GoogleGeocodingResponse>
    (`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(입력 받을 주소)}&key=${MY API KEY}`)
  .then(res => {
    if (res.data.status !== 'OK') {
      throw new Error('에러');
    }
    const coordinates = res.data.results[0].geometry.location;
    const map = new google.maps.Map(document.getElementById("map"), {
      center: coordinates,
      zoom: 12
    });

    new google.maps.Marker({position: coordinates, map: map});
  })
  .catch(err => {
    alert(err.message);
    console.log(err)
  })

{% endhighlight %}

<br>
![map output](/public/img/ts_img/google-map-api/loca.png){: width="60%" height="60%"}
<br>
<br>

# Google Maps 타입 지원
---
잘 동작한다. 하지만 현재는 타입 지원을 못 받고 있다.
<br>
`google.maps` 대신에 `google.mapmapmap`을 사용하려 해도 타입스크립트는 그것이 문제인지 알지 못한다.
<br>
어떻게 하면 될까? 어떻게 타입스크립트가 구글맵을 알게끔 할 수 있을까?
<br>
<br>
{% highlight linenos %}
$ npm i -D @types/googlemaps

{% endhighlight %}


<br>
설치해주면 된다. 이제 타입 지원이 될 것이고 declare google 구문은 주석 처리해도 된다.
<br>
<br>
# 마무리
---
이 강의를 통해서, 타입스크립트 어플리케이션을 빌드하고 3rd party 라이브러리를 사용하는 방법에 대해 조금이나마 이해할 수 있게 되었다.
<br>
<br>
# 전체 코드
---
{% highlight html linenos %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Understanding TypeScript</title>
    <script src="dist/bundle.js" defer></script>

    <link rel="stylesheet" href="app.css" />

  </head>
  <body>
    <div id="map">
      <p>Please enter an address!</p>
    </div>
    <form>
      <input type="text" id="address" />
      <button type="submit">SEARCH ADDRESS</button>
    </form>

    <script
      src="https://maps.googleapis.com/maps/api/js?key=MyAPIKEY"
      async
      defer
    ></script>

  </body>
</html>
{% endhighlight %}

{% highlight typescript linenos %}
import axios from "axios";

// form은 null이 아님
const form = document.querySelector("form")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;
const GOOGLE_API_KEY = "MY API KEY";

declare global {
  interface Window {
  initMap: () => void;
  }
}

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;
  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_API_KEY}`
    )
    .then((res) => {
      if (res.data.status !== "OK") {
        throw new Error("에러");
      }
      const coordinates = res.data.results[0].geometry.location;
      const map = new google.maps.Map(document.getElementById("map")!, {
        center: coordinates,
        zoom: 12,
      });

      new google.maps.Marker({ position: coordinates, map: map });
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    })

    .catch((err) => {
      alert(err.message);
      console.log(err);
    });

}

form.addEventListener("submit", searchAddressHandler);
{% endhighlight %}
