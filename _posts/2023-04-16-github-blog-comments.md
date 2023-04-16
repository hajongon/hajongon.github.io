---
layout: post
title: Jekyll 블로그에 Utterances로 댓글 기능 추가하기
date: 2023-04-16 00:00:00 +0900
category: Jekyll
published: true
---

# 개요
---
Github Blog에 댓글 기능이 없어 항상 아쉬웠다.<br>
사실 댓글 달러 올 사람도 없다 ㅋㅋ <br>
하지만 인생은 자기만족의 연속 아니겠는가? 만들고 싶으면 만들어야지. <br>


<br>
Github Blog인 만큼 Github 계정 간 소통이 가능하게 하고싶었는데, 마침 아래 블로그를 찾았다.
<br>
<br>

[참고한 블로그](https://absolutelyfullycapable.github.io/2021-06/jekyll-utterances)
<br>
이 자리를 빌어 감사 인사를 드립니다. 이 게시글만 쓰고 선생님 블로그에 댓글 달러 가겠습니다.<br>
<br>
짠!
<br>

![comments-ui](/public/img/github/comments-ui.png){: width="600px"}

<br>
여러분도 만들고 싶으시다면 아래 블로그를 끝까지 읽어주시기 바란다.

# Utterances란?
---
Utterances는 GitHub Issues 기반으로 동작하는 댓글 플랫폼이다.<br> 
블로그 포스트와 같은 정적 페이지에 적용할 수 있으며, GitHub 계정만 있다면 누구나 댓글을 달 수 있다. <br>
Utterances는 댓글 저장소로 사용되며, GitHub Issues API를 사용하여 댓글을 로드하고 저장한다. <br>
또한, 마크다운으로 작성된 댓글도 지원한다. <br>

# Utterances 사용하기
---

## 댓글 레포지토리 생성
<br>

Github에 새로운 레포지토리를 생성한다.<br>
내가 참조한 블로그에 따르면 주로 `blog-comments`라는 이름을 사용한다고 하는데, <br>
레포지토리명을 자유롭게 설정한다고 해서 문제가 될 일은 크게 없을 것 같다. <br>
그래도 나는 `blog-comments`라고 지었다 하하.<br>

<br> ❤️‍🔥 주의할 점: 레포지토리는 꼭 public으로 만들 것!
<br>
<br>

## Utterances 설치
<br>
[https://github.com/apps/utterances](https://github.com/apps/utterances)

<br>

1. 우측에 있는 `Install` 버튼을 누른다.
2. `Only select repositories`를 선택하고, 내가 만든 blog-comments 레포지토리를 고른다.
3. 하단에 있는 `Install` 버튼을 누른다.
4. `repo: ` 칸에 내가 만든 레포지토리 경로를 입력한다. `사용자이름/레포지토리명`
5. Issue title contains page pathname을 선택한다.
6. (Optional) Label을 입력한다. Label은 댓글 issue 뒤에 붙게 된다.
7. theme를 선택한다.
8. Utterances 스크립트를 복사한 뒤, 내 Jekyll 블로그 내에 붙여넣는다. 
  - 필자는 just-the-docs 테마를 사용중이고, `_includes` 폴더 내에 있는 `post.html`에 입력했다.

{% highlight html linenos %}
  <div id="utterances"></div>
  <script src="https://utteranc.es/client.js"
        repo="[OWNER]/[REPO]"
        issue-term="pathname"
        label="comment"
        theme="github-light"
        crossorigin="anonymous"
        async>
  </script>

{% endhighlight %}


<br>
끝입니다.
<br>

# References

- [absolutelyfullycapable님의 블로그](https://absolutelyfullycapable.github.io/2021-06/jekyll-utterances)
- ChatGPT




