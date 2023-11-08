---
layout: post
title: react, angular, vue 차이 및 코드 비교
date: 2023-11-07 03:00:00 +0900
category: frontend
published: true
---

## React

-   🐥 Facebook에서 만든 프론트엔드 자바스크립트 UI 라이브러리
-   🐥 라이브러리라서 유연성이 좋다.
-   🐥 React Native를 통해 앱 개발로 확장할 수 있다.
-   🐥 `create-react-app` 등의 커맨드라인 인터페이스가 많아 접근성이 좋고 사용하기 편리하다.
-   🐥 커뮤니티가 방대해 정보를 얻고 활용하기가 쉽다.
-   🐥 Virtual DOM을 활용해 성능을 높였다.
-   🐥 JSX(Javascript + XML) 문법을 사용한다.

## Vue

-   🐥 Evan You라는 개발자가 독립적으로 만든, 자바스크립트 UI 프레임워크
-   🐥 Virtual DOM, 컴포넌트를 사용
-   🐥 React와 Angular에서 쓸만한 기능들만 따서 만들어졌다.
-   🐥 간단한 템플릿 구문을 활용해 선언적으로 DOM에 데이터를 렌더링한다.
-   🐥 리액트와 비슷하지만, 더 쉽게 배울 수 있다. 코드가 간결하다.
-   🐥 커뮤니티가 작다.

## Angular

-   🐥 구글에서 만든 타입스크립트 기반의 웹 어플리케이션 오픈소스 프레임워크
-   🐥 유니크한 템플릿 문법을 사용하기 때문에 자유도는 떨어지지만, 타입스크립트 기반이라서 유지 및 관리에 용이하다.
-   🐥 컴포넌트 기반
-   🐥 많은 기능을 제공하기 때문에 초기 로딩 속도는 느리지만, 페이지 간 전환 속도는 빠르다.

<br>

## 비교 테이블

<br>

|                 | Angular                   | React                   | Vue                      |
| --------------- | ------------------------- | ----------------------- | ------------------------ |
| 프레임워크 크기 | 143KB                     | 97.5KB                  | 58.8KB                   |
| 프로그래밍 언어 | TypeScript                | JavaScript              | JavaScript               |
| UI 컴포넌트     | 내장된 Material 기술 스택 | React UI 도구           | 컴포넌트 라이브러리      |
| 아키텍처        | 컴포넌트 기반             | 컴포넌트 기반           | 컴포넌트 기반            |
| 러닝 커브       | 가파름                    | 중간                    | 중간                     |
| 문법            | 실제 DOM                  | 가상 DOM                | 가상 DOM                 |
| 확장성          | 모듈화된 개발 구조        | 컴포넌트 기반 접근      | 템플릿 기반 문법         |
| 마이그레이션    | API 업그레이드            | React 코드모드 스크립트 | 마이그레이션 도우미 도구 |

<br>

## Counter 예제

### 1. React

```jsx
import React, { useState } from 'react'

function Counter() {
    const [count, setCount] = useState(0)

    const increment = () => {
        setCount(count + 1)
    }

    const decrement = () => {
        setCount(count - 1)
    }

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>Increment</button>
            <button onClick={decrement}>Decrement</button>
        </div>
    )
}

export default Counter
```

-   🐥 가상 DOM을 사용해 실제 DOM과 비교하여 변경사항을 최소화한다. `Counter` 컴포넌트에서 상태(`count`)가 변경될 때, 리액트는 가상 DOM을 통해 변경된 부분만 업데이트하므로 효율적으로 렌더링된다.
-   🐥 컴포넌트 기반의 아키텍처를 사용해 UI를 모듈화하고 재사용 가능한 컴포넌트를 생성한다. `Counter`는 컴포넌트 기반으로 정의되어 있으며, 상태를 관리하고 UI를 업데이트한다.
-   🐥 `Counter`는 함수형 컴포넌트로 작성되었으며, `useState` 훅을 사용해 상태를 관리한다. 이는 간편한 상태 관리를 지원한다.

### 2. Angular

```javascript
import { Component } from '@angular/core'

@Component({
    selector: 'app-counter',
    template: `
        <div>
            <p>Count: {{ count }}</p>
            <button (click)="increment()">Increment</button>
            <button (click)="decrement()">Decrement</button>
        </div>
    `,
})
export class CounterComponent {
    count: number = 0

    increment(): void {
        this.count++
    }

    decrement(): void {
        this.count--
    }
}
```

-   🐥 모듈 기반의 개발 구조를 채택하고 있으며, `Counter` 컴포넌트를 포함한 애플리케이션은 모두 모듈로 구성된다. 이는 대규모 앱을 구축할 때 모듈성을 갖게 한다.
-   🐥 TypeScript를 기본 언어로 사용하므로 코드의 타입 안정성을 보장한다. `Counter`에서 상태 및 메서드는 타입이 명시적으로 지정되어 있다.

### 3. Vue

```jsx
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
};
</script>

```

-   🐥 HTML 기반의 템플릿 문법을 사용하므로 개발자가 간결한 구문으로 UI를 정의할 수 있다.

<br>

## todo-list 예제

### React

```jsx
import React, { useState } from 'react'

function TodoApp() {
    const [todos, setTodos] = useState([])
    const [text, setText] = useState('')

    const addTodo = () => {
        if (text.trim()) {
            setTodos([...todos, text])
            setText('')
        }
    }

    const removeTodo = (index) => {
        const newTodos = [...todos]
        newTodos.splice(index, 1)
        setTodos(newTodos)
    }

    return (
        <div>
            <h1>Todo List (React)</h1>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>
                        {todo}
                        <button onClick={() => removeTodo(index)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TodoApp
```

### Angular

```javascript
import { Component } from '@angular/core'

@Component({
    selector: 'app-todo',
    template: `
        <div>
            <h1>Todo List (Angular)</h1>
            <input [(ngModel)]="text" />
            <button (click)="addTodo()">Add</button>
            <ul>
                <li *ngFor="let todo of todos; let i = index">
                    {{ todo }}
                    <button (click)="removeTodo(i)">Remove</button>
                </li>
            </ul>
        </div>
    `,
})
export class TodoComponent {
    todos: string[] = []
    text: string = ''

    addTodo() {
        if (this.text.trim()) {
            this.todos.push(this.text)
            this.text = ''
        }
    }

    removeTodo(index: number) {
        this.todos.splice(index, 1)
    }
}
```

-   🐥 양방향 데이터 바인딩을 지원하여 UI와 데이터 모델 사이의 동기화를 용이하게 한다. 예제에서는 `[(ngModel)]`을 사용하여 입력 필드와 데이터 모델(text)을 연결하고 있다.

### Vue

```jsx
<template>
  <div>
    <h1>Todo List (Vue)</h1>
    <input v-model="text" />
    <button @click="addTodo">Add</button>
    <ul>
      <li v-for="(todo, index) in todos" :key="index">
        {{ todo }}
        <button @click="removeTodo(index)">Remove</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todos: [],
      text: '',
    };
  },
  methods: {
    addTodo() {
      if (this.text.trim()) {
        this.todos.push(this.text);
        this.text = '';
      }
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
  },
};
</script>
```

-   🐥 `v-model`을 사용해 입력 필드와 데이터(text)를 바인딩하고 있다.
-   🐥 반응성 시스템을 내장하고 있어, 데이터 변경을 감지하고 자동으로 UI를 업데이트한다. 데이터(text)가 변경될 때 자동으로 UI에 반영된다.

<br>
