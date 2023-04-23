---
layout: post
title: stack overflow 클론 코딩 프로젝트 03. CRUD (1)
date: 2023-04-18 00:00:00 +0900
category: clone
published: true
---

## 개요
---
stack overflow 클론 코딩 프로젝트에서 CRUD 구현을 맡게 됐다.<br>
혼자서 `node.js` 서버를 만들어 CRUD를 구현해본 적은 있지만,<br>
백엔드 팀과 협업해 데이터를 주고받는 경험은 전무했기에 굉장히 설렜다. (사실은 두려웠다)<br>

아직 진행중인 작업이지만, 까먹기 전에 지금까지의 진행 상황을 기록해보려 한다.<br>
<br>

## 진행 상황
---
questions를 불러오고, 작성하고, 삭제하는 기능까지 구현

<br>

## file structure
---

![file-structure](/public/img/project/stackoverflow/file-structure.png){: width="300px"}

<br>

`/src` 경로 아래에

  - `/components` : 재사용 가능한 UI 컴포넌트
  - `/pages` : 각 페이지의 탑 레벨 컴포넌트
  - `/services` : API 서비스 기능 관련
  - `/styles` : styled-components
  - `App.js`
<br>
<br>

가 위치하고 있다. 작업을 진행하면서 `/redux`와 `/assets` 폴더를 추가할 예정이다.<br>
루트 경로에 위치한 `.env`로 `devUrl`을 관리하고 있다.
<br>
<br>

## 코드 분석
---

### App.js

{% highlight jsx linenos %}
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/questions" element={<Questions />} />
    <Route path="/questions/:id" element={<Question />} />
    <Route path="/questions/ask" element={<AskQuestion />} />
  </Routes>
</BrowserRouter>
{% endhighlight %}

<br>

`react-router-dom`을 사용해 페이지 라우팅을 했다.<br>

- `/` : 메인 페이지(아직은 아무것도 없음)
- `/questions` : questions 전체를 불러오는 페이지
- `/questions/:id` : 특정 question 하나의 상세 페이지(`id`라는 param으로 접근)
- `/questions/ask` : 질문 작성 페이지

<br>
<br>

### useAxios 훅

`/services` 폴더 내 `useAxios.js`

<br>

{% highlight jsx linenos %}
import { useEffect, useState } from 'react';
import axios from 'axios';

const useAxios = url => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    axios(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
    })
      .then(response => {
        setQuestions(response.data);
      })
      .catch(err => setError(err.message));
  }, [url]);

  return [questions, setQuestions, error];
};

export default useAxios;
{% endhighlight %}
<br>

#### 🍟 동작 원리<br>

`useState`를 이용해 `questions`라는 변수를 만들었다. 데이터는 `axios`로 요청한다.<br>
`setQuestions`로 `questions`를 최신화하고, 해당 동작은 `url`이 변할 때마다 실행된다.
<br>
<br>

#### 🍟 이슈
<br>

서버에서 데이터를 요청했을 때 분명 객체 형태의 데이터가 날아와야 하는데,<br>
계속 이상한 html 형태의 응답이 왔다.<br>

서버 응답은 계속 200으로 정상적이었다. 대체 뭘까???????<br>
팀원분이 알려주신 아래 블로그를 보고 문제를 해결했다.<br>

<br>

[한 줄기 빛과 같은 블로그](https://velog.io/@se2id/ngrok-skip-browser-warning-ERRNGROK6024%EC%97%90%EB%9F%AC-Get%EC%9A%94%EC%B2%AD%EC%8B%9C-doctype-html-%EB%9C%B0-%EB%95%8C)

<br>

서버 주소에 접속하면 ngrok에 visit하려고 한다는 페이지가 뜨는데,<br>
그걸 skip 해주면 문제가 해결된다. skip 하는 코드는 아래와 같다.<br><br>

{% highlight jsx linenos %}

const useAxios = url => {

// ...

    axios(url, {
      method: 'GET',
      headers: {
        // ...
        'ngrok-skip-browser-warning': '임의의 값',
      },
    })

// ...

{% endhighlight %}


<br>

![skip-warning](/public/img/project/stackoverflow/skip-warning.png){: width="600px"}

<br>

위 글을 읽어보면 `임의의 값` 자리에는 말 그대로 any value를 집어넣으면 된다고 한다.

<br>
<br>

### Questions 컴포넌트

{% highlight jsx linenos %}

import { Link } from 'react-router-dom';
import useAxios from '../services/useAxios';
import StyledQuestions from '../styles/StyledQuestions';

function Questions() {
  const devUrl = process.env.REACT_APP_DEV_URL;
  const [questions] = useAxios(
    `${devUrl}/questions`,
  );

  return (
    <div>
      <StyledQuestions>
        {questions.map(question => (
          <li key={question.id}>
            <Link to={`/questions/${question.id}`}>
              <h2>{question.title}</h2>
            </Link>
          </li>
        ))}
        <Link to="/questions/ask">
          <button type="button">ask question</button>
        </Link>
      </StyledQuestions>
    </div>
  );
}

export default Questions;

{% endhighlight %} 
<br>

#### 🍟 동작 원리<br>

`useAxios`의 리턴값에서 `questions`를 뽑아온다.<br>
전체 questions를 불러오는 엔드포인트는 `${devUrl}/questions`.<br>
빌드 시에는 `apiUrl`이라는 변수로 바꿔줄 예정이다.<br>
<br>


#### 🍟 이슈<br>
처음에 `REACT_APP_DEV_URL`을 계속 못 찾길래
문제가 뭔가 했는데, 개발 서버 껐다가 켜니까 바로 됐다!

<br>

### api.js
api 요청을 하는 코드.<br>
우선 `create`, `delete` 요청만 구현한 상태다.<br>

{% highlight js linenos %}
const QUESTIONS_URL = 'http://localhost:3000/questions/';

export const axiosCreate = (url, data) => {
  axios(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    data: JSON.stringify(data),
  })
    .then(() => {
      window.location.href = QUESTIONS_URL;
    })
    .catch(error => {
      console.error('Error', error);
    });
};

export const axiosDelete = url => {
  axios(url, {
    method: 'DELETE',
  })
    .then(() => {
      window.location.href = QUESTIONS_URL;
    })
    .catch(error => {
      console.error('Error', error);
    });
};
{% endhighlight %}

<br>
<br>

### Question 컴포넌트

개별 질문 상세페이지.<br>
`localhost:3000/questions/질문아이디`로 접근 가능하다.<br>

{% highlight jsx linenos %}
function Question() {
  const devUrl = process.env.REACT_APP_DEV_URL;

  const { id } = useParams();

  const [question] = useAxios(`${devUrl}/questions/${id}`);

  const handleDelete = () => {
    axiosDelete(`${devUrl}/questions/${id}`);
  };
  return (
    <StyledQuestionContainer>
      <StyledQuestion>
        <h2>{question.title}</h2>
        <p>{question.body}</p>
        <p>{question.details}</p>
        <button type="button" onClick={handleDelete}>
          delete
        </button>
      </StyledQuestion>
      <StyledAnswer />
    </StyledQuestionContainer>
  );
}
{% endhighlight %}

<br>

#### 🍟 동작 원리<br>

`useParams()`로 URL의 `id`값을 뽑아온다.<br>
여기서 뽑아오는 `id`는 아래 코드에서 정의한 변수다.<br>

<br>

```jsx
 <Route path="/questions/:id" element={<Question />} />
```
<br>

`useAxios`로 `question`을 받아오는데, 여기서 주의해야 할 점이 있다.<br>



<br>

{% highlight jsx linenos %}
const useAxios = url => {
  // ...
  return [questions, setQuestions, error];
};
{% endhighlight %}
<br>

`useAxios`가 반환하는 값에는 `question`이 없는데 어떻게 구조 분해 할당이 가능할까?<br>
<br>
아래의 예시를 보자.
<br>
{% highlight jsx linenos %}
function useCustomHook() {
  const foo = "foo";
  const bar = "bar";
  const baz = "baz";

  return [foo, bar, baz];
}
{% endhighlight %}
<br>
위 코드에서 반환된 배열 요소들은 각각 `[0], [1], [2]`와 같은 인덱스를 갖고 있다.<br>
따라서, 이 배열을 사용하는 컴포넌트에서는 아래와 같이 인덱스를 이용하여 각 요소를 사용할 수 있다.
<br>

{% highlight jsx linenos %}
function MyComponent() {
  const [aaa, , bbb] = useCustomHook();

  return (
    <div>
      <p>{foo}</p>
      <p>{baz}</p>
    </div>
  );
}
{% endhighlight %}
<br>

위 컴포넌트에서 `aaa`에는 `foo`가, `bbb`에는 `baz`가 할당된다.<br>
배열로 리턴할 경우 이런 식으로 이름을 자유롭게 바꿔 쓸 수 있다는 장점이 있지만,<br>
코드의 가독성이 떨어지고, 해당 변수들의 순서를 꿰고 있어야 하기에 유지보수에 불편함이 있을 수도 있다.<br>
<br>
따라서 커스텀 훅에서는 객체 형태로 요소들을 리턴하는 것이 좋다.<br>
리팩토링할 때 이 점을 염두에 둬야겠다.


<br>


#### 🍟 이슈<br>

json server로는 잘 불러와지던 질문 데이터가, ngrok으로 연결하니 불러와지지 않았다.<br>
처음에 백엔드 쪽에서 짰던 코드에는 `id`가 없고 `questionId`라는 키값이 존재해서 발생했던 문제다.<br>
<br>

`id`로 통일하기로 결정~

<br>

### AskQuestion 컴포넌트

질문 작성 form.<br>
<br>

{% highlight jsx linenos %}
function AskQuestion() {
  const titleBind = useInput('');
  const bodyBind = useInput('');
  const detailsBind = useInput('');

  const devUrl = process.env.REACT_APP_DEV_URL;

  const handleSubmit = e => {
    e.preventDefault();
    const data = {
      title: titleBind.curValue,
      body: bodyBind.curValue,
      details: detailsBind.curValue,
    };
    axiosCreate(`${devUrl}/questions`, data);
  };

  return (
    <StyledAskQuestion onSubmit={handleSubmit}>
      <h2>Title</h2>
      <Input value={titleBind} onChange={titleBind.onChange} />
      <h2>What are the details of your problem?</h2>
      <TextArea value={bodyBind} onChange={bodyBind.onChange} />
      <h2>What did you try and what were you expecting?</h2>
      <TextArea value={detailsBind} onChange={detailsBind.onChange} />
      <button type="submit">submit</button>
    </StyledAskQuestion>
  );
}
{% endhighlight %}

<br>

#### 🍟 동작 원리<br>

`id`값은 백엔드 서버에서 부여한다.<br>
데이터가 하나 생성될 때마다 1부터 오름차순으로 `id` 값이 부여된다고 한다.<br>

<br>


#### 🍟 이슈<br>

처음에는 `id`와 `questionId` 차이를 몰라서 제대로 된 요청이 되지 않았음.
`id`로 통일하고 해결.
<br>
<br>

### useInput 훅

{% highlight jsx linenos %}
import { useCallback, useState } from 'react';

const useInput = () => {
  const [curValue, setCurValue] = useState('');

  const bind = {
    curValue,
    onChange: useCallback(e => {
      const { value } = e.target;
      setCurValue(value);
    }, []),
  };

  return bind;
};

export default useInput;

{% endhighlight %}
<br>

#### 🍟 동작 원리<br>

`curValue`는 현재 입력받고 있는 데이터를 의미한다.<br>
`bind`라는 객체를 만들어서 그 안에 `curValue`와 `onChange` 함수를 저장한다.<br>
`bind` 객체를 리턴한다.


<br>
<br>


### Input, MarkDown 컴포넌트



{% highlight jsx linenos %}

import { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all';

// 이걸 불러오기만 해도 하이라이팅이 됨
import 'prismjs/themes/prism.css';
import '@toast-ui/editor/dist/toastui-editor.css';

function MarkDown({ editorRef }) {
  return (
    <Editor
      ref={editorRef}
      plugins={[codeSyntaxHighlight]}
      placeholder="내용을 입력해주세요."
      initialValue=" "
      previewStyle="tab" // 미리보기 스타일 지정
      height="300px" // 에디터 창 높이
      toolbarItems={[
        // 툴바 옵션 설정
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
      ]}
    />
  );
}

function Input({ value }) {
  return <input type="text" value={value.curValue} onChange={value.onChange} />;
}

function TextArea({ value }) {
  return <textarea type="text" value={value.curValue} onChange={value.onChange} />;
}

export { MarkDown, Input, TextArea };
{% endhighlight%}
<br>

#### 🍟 동작 원리<br>

`AskQuestion`에서 `useRef`로 가리킨 `editorBodyRef`, `editorDetailsRef` 포인터를 prop으로 전송받아<br>
마크다운 에디터의 `ref`에 할당한다. 코드블록 하이라이팅은 `prismjs`를 설치해서 구현했다.<br>
<br>

`Input` 컴포넌트는 `AskQuestion`에서 `titleBind`와 `titleBind.onChange`를 prop으로 전송받아<br>
인풋 창의 value와 onChange에 할당한다.<br>


<br>


#### 🍟 이슈<br>

처음에는 `react-markdown`을 사용해보려 했는데,<br>
코드 블록 내부 내용이 자꾸 `undefined`로 출력되는 현상이 있었고 결국 해결하지 못했다.<br>
차선책으로 NHN의 오픈소스인 toast UI를 활용해 입력을 HTML로 받아 화면에 렌더링시키는 방법으로 로직을 구현했다.<br>
<br>

`initialValue` 속성에 공백을 주지 않으면 에디터 내부의 값들이 initial Value로 지정되는 문제가 있다.<br>
이 부분은 아직 해결하지 못했다.

<br>


<br>

## todo
---

- `question` PATCH 요청
- `question`과 `answers` 데이터 구조 확립
- `useAxios` 리팩토링
- `initialValue` 공백 이슈 해결