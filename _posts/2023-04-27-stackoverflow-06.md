---
layout: post
title: stack overflow 클론 코딩 프로젝트 05. CRUD (4)
date: 2023-04-27 00:00:00 +0900
category: clone
published: true
---

## 프로젝트 진행 현황
--- 

### 1️⃣ comment 수정
<br>
`answer.comments` 배열을 mapping 하는 과정에서<br>
`comment.id`와 `editingCommentId(수정중인 comment의 id)`가 같으면,<br>
해당 요소의 레이아웃을 editor와 버튼으로 변경한다.<br>
<br>


![is-editing-comment](/public/img/project/stackoverflow/is-editing-comment.png){: width="800px"}

#### 🔫 isEditingComment === false
{% highlight jsx linenos %}
<>
  <CmtAction>
    <CmtScore>
      <span>124</span>
    </CmtScore>
  </CmtAction>
  <CmtText>
    <CmtBody>
      <CmtCopy>{comment.text}</CmtCopy>
      <CmtUser>{comment.writtenBy}</CmtUser>
      <CmtDate>
        {commentedAt(comment.createdAt)}
      </CmtDate>
      <CmtEdit>
        <Pencil
          onClick={() => {
            handleOpenCommentEditor(comment);
          }}
        />
        <CancelButton
          onClick={() => {
            handleDeleteComment(
              answer.id,
              comment,
            );
          }}
        >
          delete
        </CancelButton>
        {isCommentModalOpen && (
          <EditCommentErrorModal>
            <span>Account is suspended.</span>
            <button
              onClick={() => {
                setIsCommentModalOpen(false);
              }}
            >
              x
            </button>
          </EditCommentErrorModal>
        )}
      </CmtEdit>
    </CmtBody>
  </CmtText>
</>
{% endhighlight %}


#### 🔫 isEditingComment === true

{% highlight jsx linenos %}
<EditCommentForm
  onSubmit={() =>
    handleEditComment(answer.id, comment)
  }
>
  <CommentEditFormContainer>
    <CommentEditContainer>
      <AddCommentInput>
        <textarea
          value={commentInput}
          onChange={handleComment}
        />
      </AddCommentInput>
      <AddCommentMessage>
        Enter at least 15 characters
      </AddCommentMessage>
    </CommentEditContainer>
    <AddComment>
      <CommentButtonContainer>
        <AddButtonWrap>
          <BlueButton type="submit">
            Edit comment
          </BlueButton>
        </AddButtonWrap>
        <HelpButtonWrap>
          <HelpButton
            onClick={handleCancelEditComment}
          >
            Cancel
          </HelpButton>
        </HelpButtonWrap>
      </CommentButtonContainer>
    </AddComment>
  </CommentEditFormContainer>
</EditCommentForm>
{% endhighlight %}

#### 🔫 comment editor 열기

{% highlight jsx linenos %}
// ...

<CommentLinkContainer>
  <AddCommentLink
    onClick={() => {
      handleOpenCommentInput(answer.id);
    }}
  >
    Add a comment
  </AddCommentLink>
</CommentLinkContainer>

// ... 

// comment 수정 창 열기
const handleOpenCommentEditor = comment => {
  if (comment.writtenBy !== userInfo.displayName) {
    setIsCommentModalOpen(true);
    return;
  }
  setIsEditingComment(true);
  setEditingCommentId(comment.id);
  setCommentInput(comment.text);
};
{% endhighlight %}

  - comment 작성자와 현재 활동중인 user가 다를 경우 해당 요청을 막는다.
  - `isEditingComment`를 true로 변경
  - `editingCommentId`를 현재 comment의 id로 변경
  - `commentInput`을 현재 comment의 `text` 값으로 변경 -> editor에 들어있게

#### 🔫 comment editing

{% highlight jsx linenos %}
// ...

<AddCommentInput>
  <textarea
    value={commentInput}
    onChange={handleComment}
  />
</AddCommentInput>

// ...

// 입력 받은 comment로 state 갱신
const handleComment = e => {
  setCommentInput(e.target.value);
};
{% endhighlight %}

  - textarea에서 `onChange` 이벤트가 발생하면 `commentInput`을 갱신한다.

#### 🔫 comment PATCH 요청

{% highlight jsx linenos %}
// 수정한 comment로 PATCH 요청
const handleEditComment = (answerId, comment) => {
  const editedComment = {
    text: commentInput,
  };
  axiosPatch(
    `/api/answers/${answerId}/comments/${comment.id}`,
    editedComment,
    id,
    accessToken,
    refreshToken,
  );
  setIsEditingComment(false);
  setEditingCommentId('');
  setCommentInput('');
};
{% endhighlight %}

#### 🔫 comment editing 취소

{% highlight jsx linenos %}
// comment 수정 취소
const handleCancelEditComment = () => {
  setIsEditingComment(false);
  setEditingCommentId('');
  setCommentInput('');
};
{% endhighlight %}

<br>
<br>



### 2️⃣ Proxy 설정

{% highlight javascript linenos %}
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'ec2 인스턴스 주소',
      changeOrigin: true,
    }),
  );
};
{% endhighlight %}

  - `http-proxy-middleware`를 사용해서 요청 경로를 우회한다.
  - CORS 에러 방지

<br>
<br>

### 3️⃣ signup, login

  - signup 되어있는 계정으로 login을 하면 localStorage에 `accessToken`과 `refreshToken`이 저장된다.

<br>
<br>

### 4️⃣ 유저 정보 불러오기

{% highlight jsx linenos %}
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

const useGetUserInfo = url => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // ngrok 으로 데이터 받을 때 browser warning 스킵
        'ngrok-skip-browser-warning': '69420',
        Authorization: accessToken,
        Refresh: refreshToken,
      },
    })
      .then(response => {
        // console.log(response.data);
        setUserInfo(response.data);
      })
      .catch(err => setError(err.message));
  }, [url]);

  return { userInfo, error };
};
{% endhighlight %}

{% highlight jsx linenos %}
const { userInfo } = useGetUserInfo(`/api/members/info`);
{% endhighlight %}

토큰을 통해 받아온 `userInfo`를 활용해 수정 및 삭제 권한 보유 여부를 체크할 수 있다.

<br>

### 5️⃣ 수정, 삭제 권한 확인

{% highlight jsx linenos %}
// question을 edit, delete 하려고 할 경우
if (questions.writtenBy !== userInfo.displayName) {
  setIsQuestionModalOpen(true);
  return;
}

// answer를 edit, delete 하려고 할 경우
if (answer.writtenBy !== userInfo.displayName) {
  setIsAnswerModalOpen(true);
  return;
}

// comment를 edit, delete 하려고 할 경우
if (comment.writtenBy !== userInfo.displayName) {
  setIsCommentModalOpen(true);
  return;
}
{% endhighlight %}

<br>

`username`을 가지고 비교한다는 것이 너무 허술한 방법 아닐까 고민을 하다가,<br>
`token`을 헤더에 실어 요청한 것에 대한 응답에서 `displayName`을 뽑아내는 방법을 떠올렸다.<br>
실제 서비스 운영을 위해 이 프로젝트를 진행하는 것이 아니라서, 보안에 크게 신경을 쓰지는 못했지만<br>
그래도 최대한 실제 운영되고 있는 사이트와 비슷하게 구현해보고자 노력했다.<br>

<br>
<br>

### 6️⃣ 질문, 댓글, 코멘트 info

{% highlight jsx linenos %}
// ...

<PostWriter question={questions} />

// ...

function PostWriter({ question }) {
  // 한국 표준 시간으로 변환
  const askedAt = new Date(Date.parse(question.createdAt)).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
  });
  return (
    <Container>
      <UserInfo>
        <UserActionTime>
          <span>asked</span>
          <span title="postedTime" className="postedtime">
            {askedAt}
          </span>
        </UserActionTime>
        <UserWrap>
          <UserAvatar>
            <img
              src="이미지 주소"
              alt="dummy-avatar"
              width="32"
              height="32"
              className="avatar-pic"
            />
          </UserAvatar>
          <UserDetails>
            <a className="user-name" href="/">
              {question.writtenBy}
            </a>
            <div className="flair">
              <span>4,379</span>
              <span className="goldBadge">3</span>
              <span className="silverBadge">3</span>
              <span className="copperBadge">3</span>
            </div>
          </UserDetails>
        </UserWrap>
      </UserInfo>
    </Container>
  );
}

{% endhighlight %}

<br>
<br>

## 배포
---
  - Github Pages를 통한 배포
  - 회원가입이 안 되는 이슈 발생 -> 정적 웹사이트 호스팅에서는 프록시가 작동하지 않는다.


## 피드백

살짝 울컥하네요. 이게 뭐라고 2주간 그렇게 고생한 게 배포 기능 구현까지 이어지지 않으니 섭섭하고 아쉽습니다.<br>
하지만 뭐 어쩌겠습니까? 이제 시작인 걸요. 앞으로 10년 동안 배포를 백번은 더할텐데 힘을 더 내보겠습니다.<br>
진짜 좋은 팀원분들을 만나서 단 한 번의 큰 트러블 없이 웹 사이트 클론 프로젝트를 무사히 마쳤습니다.<br>
<br>

일은 사람이 하는 거라고들 하죠. 저는 앞으로도 잘하는 사람보다는 좋은 사람이 되기 위해 노력하겠습니다.<br>
감사했습니다 팀원 여러분!<br>

<br>

![마지막-cors-에러](/public/img/project/stackoverflow/the-last-cors-error.png){: width="800px"}