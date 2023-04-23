---
layout: post
title: stack overflow 클론 코딩 프로젝트 04. CRUD (2)
date: 2023-04-21 00:00:00 +0900
category: clone
published: true
---


## 프로젝트 진행 현황

### 질문 작성 (POST)
![ask-question](/public/img/project/stackoverflow/ask-question.png){: width="700px"}
<br>

#### 🍟 details

  - 마크다운 에디터는 [Toast UI](https://ui.toast.com/)를 사용했다.
  - 'What are the details of your problem?' → `question.body`
  - 'What did you try and what were you expecting' → `question.details`
  - `POST` 요청을 하기 전에 둘을 `body`로 합친다.

{% highlight jsx linenos %}
function AskQuestion() {
  // 제목 바인딩
  const titleBind = useInput('');

  // body, details 포인터
  const editorBodyRef = useRef();
  const editorDetailsRef = useRef();

  const devUrl = process.env.REACT_APP_DEV_URL;

  const handleSubmit = e => {
    e.preventDefault();
    // 마크다운 에디터에서 HTML 형태로 현재 입력값 받아오기
    const bodyValue = editorBodyRef.current?.getInstance().getHTML();
    const detailsValue = editorDetailsRef.current?.getInstance().getHTML();
    const data = {
      title: titleBind.curValue,
      // body, details 줄 바꿈 후 합치기
      body: `${bodyValue}\n${detailsValue}`,
      details: detailsValue,
    };
    console.log(data);
    axiosCreate(`${devUrl}/questions`, data);
  };

  return (
    <StyledInputForm onSubmit={handleSubmit}>
      <h2>Title</h2>
      <Input value={titleBind} onChange={titleBind.onChange} />
      <h2>What are the details of your problem?</h2>
      <MarkDown editorRef={editorBodyRef} />
      <h2>What did you try and what were you expecting?</h2>
      <MarkDown editorRef={editorDetailsRef} />
      <button type="submit">submit</button>
    </StyledInputForm>
  );
}
{% endhighlight %}

<br>
<br>

#### 🍟 issues


<br>

### 질문 상세 페이지 (GET)
![question-detail-page](/public/img/project/stackoverflow/question-detail-page.png){: width="700px"}

#### 🍟 details<br>

  - markdown viewer의 코드 블럭은 `prismjs`로 syntax-highlighting 했다.
  - 레이아웃 및 디자인 클론 진행중

#### 🍟 issues<br>

  - 생각보다 globally하게 빼야 할 `style`이 많다. `div`의 `className`을 한 50개는 지은 듯.
    - todo: global style 정해보기

<br>


### 답변 달기 (POST)
![answer-post](/public/img/project/stackoverflow/answer-post.png){: width="700px"}
<br>

#### 🍟 details<br>

  - 답변을 달아도 URL에 변화가 없기 때문에, `state`를 갱신해주는 방법으로 리렌더링을 시킨다.
  - '현재 선택된 답변 페이지'에는 다른 `style`을 적용해주기 위해 styled-component에 prop을 전송

{% highlight jsx linenos %}
const PageButton = styled.button`
  background-color: ${props => (props.isActive ? '#f48225' : 'white')};
  color: ${props => (props.isActive ? 'white' : 'black')};
  border: ${props =>
    props.isActive ? '1px solid #f48225' : '1px solid hsl(210, 8%, 75%)'};

  width: 30px;
  height: 30px;
  border-radius: 5px;
  :hover {
    border: ${props =>
      props.isActive ? '1px solid #f48225' : '1px solid hsl(210, 8%, 75%)'};
    background-color: ${props => (props.isActive ? '#f48225' : 'hsl(210, 8%, 90%)')};
  }
`;

//...

const pageButtons = [];

if (pageInfosData) {
  for (let i = 1; i <= pageInfosData.totalPages; i += 1) {
    // 선택된 page의 isActive는 true
    const isActive = currentPage === i;
    pageButtons.push(
      <PageButton key={i} isActive={isActive} onClick={() => handlePage(i)}>
        {i}
      </PageButton>,
    );
  }
}
{% endhighlight %}

  


#### 🍟 issues<br>
  - `Question` 객체 안에 `answers` 배열이 들어있기 때문에, 새로운 답변을 등록할 때 Question을 PATCH하는 요청을 보냈다. 하지만 백엔드 쪽 로직은 'answer' 요소 하나를 POST 하는 식으로 짜여 있었기 때문에 해당 코드를 수정했다.
  - 컴포넌트가 렌더링된 후에 data를 불러오는 문제가 발생해서 한참 애를 먹었다.
    - 해결: `Question` 컴포넌트 내에서 `answersData` state를 만들어서 갱신시켜준다.

{% highlight jsx linenos %}
function Question() {
  const devUrl = process.env.REACT_APP_DEV_URL;
  const { id } = useParams();
  const [question, , answers, , pageInfos] = useAxios(`${devUrl}/questions/${id}`);

  // page 별 answers 불러오기 위한 선언
  const [answersData, setAnswersData] = useState([]);

  // pageInfos가 Question에서 변경될 수 있기 때문에 useState로 관리
  const [pageInfosData, setPageInfosData] = useState(null);

  const navigate = useNavigate();

  // 페이지 초기값은 1
  const [currentPage, setCurrentPage] = useState(1);

  // answers가 바뀌면 answersData가 변할 수 있도록 useEffect 사용
  useEffect(() => {
    setAnswersData(answers);
    setPageInfosData(pageInfos);
  }, [answers, pageInfos]);

  // ...

  // answer submit
  const handleSubmit = e => {
    e.preventDefault();
    const answerValue = editorAnswerRef.current?.getInstance().getHTML();
    // answer 하나만 보내면 어차피 갱신된 question을 보내주므로,
    // question PATCH 요청 X. answer을 POST 요청한다.
    const newAnswer = { content: answerValue };
    axiosCreateAnswer(`${devUrl}/questions/${id}/answers`, newAnswer, id);
  };

  // ...

}
{% endhighlight %}

<br>
<br>

### 답변 페이지 추가
<br>



![answers-pages](/public/img/project/stackoverflow/answers-pages.png){: width="700px"}
<br>
{% highlight jsx linenos %}

//...

const pageButtons = [];

if (pageInfosData) {
  // pageInfosData의 totalPages는 서버에서 자동으로 갱신된다.
  // totalPages number 값만큼 PageButton을 만든다.
  for (let i = 1; i <= pageInfosData.totalPages; i += 1) {
    const isActive = currentPage === i;
    pageButtons.push(
      <PageButton key={i} isActive={isActive} onClick={() => handlePage(i)}>
        {i}
      </PageButton>,
    );
  }
}

{% endhighlight %}
<br>

#### 🍟 details<br>

  - 답변이 세 개 이상 되면 답변의 페이지 수가 자동으로 늘어난다.<br>
  - 서버 측에서 `pageInfos` 데이터를 관리하고 있고, 한 페이지 당 답변의 개수가 정해져 있으므로 그걸 초과하면 새로운 페이지가 생성되게 로직을 구현했다.<br>

<br>
<br>

### 답변 페이지 이동 (GET)
![answers-pages](/public/img/project/stackoverflow/answers-pages-2.png){: width="700px"}

{% highlight jsx linenos %}
const handlePage = async page => {
  // 2라는 버튼을 누르면
  // GET요청(`${devUrl}/questions/${id}?page=2`) 을 보낸다.

  // url도 같이 이동 -> 이거는 굳이 왜 해야하는 건지 모르겠다. 아직은??
  navigate(`?page=${page}`);
  try {
    await axios(`${devUrl}/questions/${id}?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    })
      .then(response => {
        // url이 안바뀌니까 answer가 추가되어도 다시 데이터를 불러오지 않는다.
        // state 초기화
        setAnswersData(response.data.answers);
      })
      .catch(err => console.log(err.message));
    // 받아온 데이터를 처리하는 로직
  } catch (error) {
    // 에러 처리 로직
    console.log(error.message)
  }
  // style 적용을 위해
  setCurrentPage(page);
};
{% endhighlight %}

#### 🍟 details<br>
  - `2`라는 버튼을 눌렀을 경우, `${devUrl}/questions/${id}?page=2`로 GET 요청을 보낸다.
<br>

#### 🍟 issues<br>
  - 처음에는 어떻게든 `useAxios`를 재활용하고자 했지만, 함수 안에서 커스텀 훅을 사용할 수 없기에, 그냥 새로운 axios 요청을 보내는 것으로 수정했다.

<br>
<br>

### 질문 수정 페이지 (PATCH)
![question-edit-page](/public/img/project/stackoverflow/question-edit-2.png){: width="700px"}

<br>

#### 🍟 details<br>
  - `POST` 시에는 `body` 값과 `details` 값을 따로 입력 받지만, 수정 페이지에서는 두 요소가 합쳐진다.
  - 수정 페이지로 접근하면 마크다운 에디터에 기존에 등록된 게시글의 body가 `initialValue`로 들어있어야 한다.

{% highlight jsx linenos %}
useEffect(() => {
  if (editorRef.current && questionData) {
    const editor = editorRef.current.getInstance();
    // 에디터 초기값 설정
    editor.setHTML(`${questionData.body}`);
  }
  // 처음 한 번만 설정해준다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [questionData]);
{% endhighlight %}
<br>

  - 미리보기 기능을 위해 `content` state를 만들고 에디터의 `onChange` 속성으로 `content`를 갱신하면서 마크다운 뷰어에 전달한다.

<br>

#### 🍟 issues<br>

  - 백틱 입력 시 백슬래시가 함께 입력되는 현상
    - 이건 사실 왜 그랬는지 모르겠다. 이스케이프(escape) 때문인 것 같긴 한데, 정확한 원리를 이해하지 못했다.
    - 아래에 나오는 무한 입력을 해결하니 자연스럽게 함께 해결되었다.
  - 백틱 입력 시 `onChange` 속성과 `setContent` 메서드가 반복되면서 백슬래시가 무한 입력되는 현상
    - 기존에는 `initialValue` 값으로 `content`를 사용했는데, 그렇게 되면 `onChange`에 의해 `content`가 바뀌고, `content`가 바뀌면 `initialValue`가 바뀌고 그러면 또 `onChange`가 실행되고 무한 무한 무한 한무 반복이 되는 문제가 발생한다.
    - `esLint`의 dependency array 규칙을 해당 훅에 대해서만 끄고 내부에 있던 content를 제거했다.
    - `initialValue`를 빈 문자열로 할당하고, `setHTML` 메서드를 이용해 처음 한 번만 body값을 에디터에 집어넣어준다.
  
    
{% highlight jsx linenos %}
function EditQuestion() {
  const devUrl = process.env.REACT_APP_DEV_URL;
  const { id } = useParams();
  const [question] = useAxios(`${devUrl}/questions/${id}`);
  const [questionData, setQuestionData] = useState(null);
  const [content, setContent] = useState('');
  const editorRef = useRef();
  const titleBind = useInput('');

  // undefined 방지
  useEffect(() => {
    setQuestionData(question);
  }, [question]);

  // content 업데이트
  useEffect(() => {
    if (questionData) setContent(` ${questionData.body}`);
  }, [questionData]);

  // questionData 값이 변경될 때마다 Editor 컴포넌트의 setHTML 메서드를 호출해
  // initialValue 값을 한 번만 업데이트

  useEffect(() => {
    if (editorRef.current && questionData) {
      const editor = editorRef.current.getInstance();
      // 에디터 초기값 설정
      editor.setHTML(`${questionData.body}`);
    }
    // 처음 한 번만 설정해준다.
    // eslint 검사를 끈다.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionData]);

// ...

  return (
    <StyledInputForm onSubmit={handleSubmit}>
      <StyledList>
        <h2>Title</h2>
        {questionData && <Input value={titleBind} onChange={titleBind.onChange} />}

        {content && (
          <Editor
            // ...

            // initialValue 빈 문자열
            initialValue=""

            // onChange에서 content를 갱신하는 이유는 아래에 렌더링되는 '미리보기' 기능을 위해
            onChange={() => {
              setContent(editorRef.current.getInstance().getHTML().toString());
            }}
            // ...
          />
        )}
      </StyledList>
      <MarkdownViewer content={content} />
      <button type="submit">submit</button>
    </StyledInputForm>
  );
}
{% endhighlight %}



<br>


<br>
<br>

### 질문 수정 완료 (GET)
![question-edited](/public/img/project/stackoverflow/question-edited.png){: width="700px"}




