---
layout: post
title: stack overflow 클론 코딩 프로젝트 05. CRUD (3)
date: 2023-04-25 00:00:00 +0900
category: clone
published: true
---

## 프로젝트 진행 현황

### 답변 수정
<figure width="600px">
  <img src="/public/img/project/stackoverflow/example-answer.png" alt="example-answer" width="100%">
  <figcaption>답변 예시</figcaption>
</figure>

<br>

<figure width="600px">
  <img src="/public/img/project/stackoverflow/answer-editing-mode.png" alt="answer-editing-mode" width="100%">
  <figcaption>답변 editor에는, 등록되어 있던 답변의 내용이 담겨있게 된다.</figcaption>
</figure>

<br>

<figure width="600px">
  <img src="/public/img/project/stackoverflow/answer-edited.png" alt="answer-edited" width="100%">
  <figcaption>답변 수정 완료</figcaption>
</figure>

<br>

#### 🍟 컴포넌트 구성

<figure width="600px">
  <img src="/public/img/project/stackoverflow/answer-code.png" alt="answer-code" width="100%">
  <figcaption>code</figcaption>
</figure>


#### 🍟 details

  - `answer`의 `edit` 버튼을 누르면 답변이 사라지고 답변 수정 에디터가 화면에 출력된다.
  - editor에는 `answer.content`가 미리 담겨 있게 된다.
    - `answer.content`는 HTML 태그가 포함되어 있는 텍스트라서, plain 텍스트로 변환이 필요하다.
    - `innerText` 메서드를 이용해 plain 텍스트를 추출한다.
  
{% highlight jsx linenos %}
const handleOpenAnswerEditor = answer => {
  setIsEditingAnswer(true);
  // 에디팅 모드를 적용할 answer 요소 지정
  setEditingAnswerId(answer.id);
  // html 태그가 포함된 형태로 들어가지 않게 하기 위해 쏙 빼준다.
  const plainText = document.createElement('div');
  plainText.innerHTML = answer.content;
  // initial value 설정
  setPreText(plainText.innerText);
};
{% endhighlight %}

  - `PATCH` 요청은 `axiosPATCH`로 보낸다.

{% highlight jsx linenos %}
const handleEditAnswer = answer => {
  // 현재 입력된 editor의 text를 answerValue에 할당
  const answerValue = editingAnswerRef.current?.getInstance().getHTML();
  // 백엔드에서 요구하는 형태로 데이터를 조작
  const editedAnswer = {
    content: answerValue,
  };
  axiosPatch(`${devUrl}/questions/${id}/answers/${answer.id}`, editedAnswer, id);
  // 에디팅 모드 끄기
  setIsEditingAnswer(false);
  // 에디팅 요소 제거
  setEditingAnswerId('');
  // initial value 제거
  setPreText('');
};
{% endhighlight %}

#### 🍟 issues

  - plain 텍스트로 뽑아내니까, `<p>` 태그로 인한 줄바꿈까지 사라진다. 해결할 방법을 찾아봐야 할 듯

### 답변 삭제

#### 🍟 details
  - `answer`의 `delete` 버튼을 누르면 답변이 삭제된다.
  - 삭제 요청은 `axiosDeleteAnswer`로 보낸다.

### 코멘트 GET, POST

<figure width="600px">
  <img src="/public/img/project/stackoverflow/comment-add-button.png" alt="comment-add-button" width="100%">
  <figcaption>코멘트 등록 버튼</figcaption>
</figure>

<br>

<figure width="600px">
  <img src="/public/img/project/stackoverflow/comment-add-mode.png" alt="comment-add-mode" width="100%">
  <figcaption>코멘트 등록 중인 화면</figcaption>
</figure>

<br>


<figure width="600px">
  <img src="/public/img/project/stackoverflow/comment-added.png" alt="comment-added" width="100%">
  <figcaption>코멘트 등록 중인 화면</figcaption>
</figure>

<br>

#### 🍟 컴포넌트 구성

<figure width="600px">
  <img src="/public/img/project/stackoverflow/comment-code.png" alt="comment-code" width="100%">
  <figcaption>code</figcaption>
</figure>

<br>

#### 🍟 details

  - `answersData`가 갱신되면 개별 `answer` 데이터 안에는 `comments` 배열이 존재하게 된다.
    - 따로 `useAxios` 메서드로 리턴할 필요 X
    - 이렇다는 건 `answers`에 대해서도 마찬가지 아닌가? 체크 필요
  - `answersData`에 대해 map 메서드를 돌리는 와중에 하나의 answer마다 map으로 `comments` 맵핑
  - `axiosCreateAnswer` 메서드를 사용해서 `POST` 요청을 보낸다.
    - `comment` 관련 요청을 할 때는 `/qusetions/${qusetionId}`를 생략해도 된다.<br>
    `${answerId}`로 `${questionId}`까지 유추할 수 있기 때문

{% highlight jsx linenos %}
const handleAddComment = answerId => {
  const newComment = {
    text: commentInput,
  };
  // answerId만 있으면 상위 questionId까지 유추할 수 있음
  axiosCreateAnswer(`${devUrl}/answers/${answerId}/comments`, newComment, id);
  setIsCreatingComment(false);
  setCmtAnswerID('');
};
{% endhighlight %}

### 코멘트 삭제

#### 🍟 details

  - `axiosDeleteComment` 메서드를 사용해서 `DELETE` 요청을 보낸다.
{% highlight jsx linenos %}
const handleDeleteComment = (answerId, commentId) => {
  axiosDeleteComment(`${devUrl}/answers/${answerId}/comments/${commentId}`, id);
};
{% endhighlight %}

## To-do

  - 코멘트 수정
  - 코멘트 삭제 버튼 변경
  - 질문, 답변, 코멘트와 `user id` 연동 
  - 작성한 user가 아닐 경우 `edit`, `delete` 불가

