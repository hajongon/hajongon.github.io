---
layout: post
title: vite, react, typescript 초기 에러 해결 방법
date: 2023-12-11 10:00:00 +0900
category: React
published: true
---

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
```

```bash
모듈 '"/home/jsha/projects/memory-bubble-bubble/client/node_modules/@types/react-dom/client"'에는 기본 내보내기가 없습니다.
```

`React 18`부터는 `ReactDOM.createRoot`를 사용하는 방식으로 변경되었어요.

```jsx
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const root = createRoot(document.getElementById('root')!)
root.render(<App />)

```

`createRoot` 함수를 `react-dom/client`에서 직접 가져와 사용해요.

```bash
Unexpected use of file extension "tsx" for "./App.tsx"eslintimport/extensions
```

이 ESLint 오류는 .tsx 확장자를 사용하여 파일을 가져오는 것에 대한 에러 메시지예요. <br>

TypeScript와 함께 작업할 때 일반적으로 파일 확장자를 생략하는 것이 관례인데, <br>
ESLint 설정에서 `import/extensions` 규칙을 조정하여 이 문제를 해결할 수 있어요. <br>

다음과 같이 ESLint 설정을 수정하세요: <br>

```javascript
"rules": {
  "import/extensions": ["error", "ignorePackages", {
    "js": "never",
    "jsx": "never",
    "ts": "never",
    "tsx": "never"
  }]
}
```

이 설정은 `.ts` 및 `.tsx` 파일 확장자를 명시적으로 사용하지 않도록 ESLint에 지시해줘요. <br>
그런 다음, `App` 컴포넌트를 다음과 같이 임포트할 수 있어요: <br>

```javascript
import App from './App'
```
