---
layout: post
title: React Router Dom으로 구성한 앱 Github에 배포하기
date: 2023-04-09 00:00:00 +0900
category: React
published: true
---


# 문제 발생
---

당신은 React Router Dom으로 페이지를 구성한 앱을 Github에 배포해본 적이 있는가? 
<br>나는 있다.
처음에 굉장히 당황했다. 

![normal-page](/public/img/react/react-router-dom-github/normal.png){: width="800px"}
<br>
이렇게 나와야 할 페이지가

![issue-image](/public/img/react/react-router-dom-github/issue.png){: width="800px"}
<br>
이렇게 렌더링 된 것이다.<br>
문제는 URL에 있었다.<br>
<br>
내가 원한 URL
{% highlight bash %}
http://hajongon.github.io/wheredidyouspend/
{% endhighlight %}
<br>
실제로 접근하게 되는 URL
{% highlight bash %}
http://hajongon.github.io/wheredidyouspend/index.html/
{% endhighlight %}
<br>

# 이유 
---

내가 만든 프로젝트를 빌드해서 출력된 파일들을 Github에 배포할 경우, <br>
Github에서는 최초 렌더링될 위치를 `index.html`로 잡는다.<br>
<br>
하지만 `React-Router-Dom`을 사용한 프로젝트에서는 엔드포인트에 따라 정적인 페이지 이동이 되므로,<br>

시작점(base)가 `index.html`이라면, 정상적으로 최초 페이지(`/`)를 렌더링할 수 없게 된다.<br>

아래는 Routing과 관련된 `App.tsx` 코드다.

{% highlight jsx linenos %}

<BrowserRouter>
  <div className="app">
    <Bear src={bearImage} />
    <Navbar />
    <Routes>
      <Route path="/" element={<MainContainer deleteItem={deleteItem} />} />
      <Route path="/list" element={<ListContainer />} />
      <Route
        path="/fixed"
        element={<FixedCostsContainer deleteFixedCost={deleteFixedCost} />}
      />
      <Route path="/about" element={<About />} />
    </Routes>
  </div>
</BrowserRouter>

{% endhighlight %}

<br>

# 해결
---

`BrowerRouter`에는 `basename`이라는 속성을 추가할 수 있다.<br>
`basename` prop은 React Router에서 사용되며, 웹 앱의 기본 URL 경로를 지정하는 데 사용된다.<br>
이것은 앱 서브디렉토리에 호스팅되는 경우 유용하다.<br>
<br>

예를 들어, 만약 `basename` prop이 `/wheredidyouspend`로 설정되어 있다면,<br>
React Router는 라우트 경로를 이 경로 아래에 있는 것으로 간주한다.<br>
<br>

즉, `path="/" element={<MainContainer />}`는 `example.com/wheredidyouspend/` 경로에서 매칭된다.<br>
<br>

Github 배포의 경우, 빌드된 앱을 `username.github.io/레포지토리이름`과 같은 경로에 배포할 수 있다.<br>
이 경우, `basename`을 `/레포지토리이름`으로 설정하면 정확한 경로를 지정할 수 있게 된다.<br>
<br>
아래는 수정한 코드다.

{% highlight jsx linenos %}
<BrowserRouter basename="/wheredidyouspend">
  <div className="app">
    <Bear src={bearImage} />
    <Navbar />
    <Routes>
      <Route path="/" element={<MainContainer deleteItem={deleteItem} />} />
      <Route path="/list" element={<ListContainer />} />
      <Route
        path="/fixed"
        element={<FixedCostsContainer deleteFixedCost={deleteFixedCost} />}
      />
      <Route path="/about" element={<About />} />
    </Routes>
  </div>
</BrowserRouter>
{% endhighlight %}
<br>

물론 개발 서버에서 다음과 같은 코드를 사용하면 제대로 된 작업을 수행할 수 없기 때문에<br>
해당 문자열 대신 변수를 만들어 개발 모드, 배포 모드로 나누는 것이 좋다.

<br>

# 개선할 부분

- 문자열 대신 변수를 사용해 개발 모드, 배포 모드에 따라 다른 `basename` 적용해보기.