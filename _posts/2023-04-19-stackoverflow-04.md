---
layout: post
title: stack overflow 클론 코딩 프로젝트 04. markdown 게시판 구현
date: 2023-04-19 00:00:00 +0900
category: clone
published: true
---

왜 또 뭐가 문젠데

{% highlight jsx linenos %}
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

import useAxios from "../services/useAxios";
import { axiosDelete } from "../services/api";
import StyledQuestionContainer from "../styles/StyledQuestionContainer";
import StyledQuestion from "../styles/StyledQuestion";
import StyledAnswer from "../styles/StyledAnswer";

function CodeBlock({ language, value }) {
  const code = String(value).replace(/\n$/, "");
  return (
    <SyntaxHighlighter style={a11yDark} language={language} PreTag="div">
      {code}
    </SyntaxHighlighter>
  );
}

const renderers = {
  code: CodeBlock,
};

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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={renderers}
          className="markdown"
        >
          {question.body}
        </ReactMarkdown>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={renderers}
          className="markdown"
        >
          {question.details}
        </ReactMarkdown>
        <button type="button" onClick={handleDelete}>
          delete
        </button>
      </StyledQuestion>
      <StyledAnswer />
    </StyledQuestionContainer>
  );
}

export default Question;
{% endhighlight %}

이렇게 하니까 코드블록은 나오는데 undefined 출력

![undefined](/public/img/project/stackoverflow/undefined.png){: width="600px"}

그냥 일반 텍스트를 입력하면 잘 나오는데,
코드 블록의 내용만 undefined가 뜬다.

![undefined](/public/img/project/stackoverflow/dummy-data.png){: width="600px"}