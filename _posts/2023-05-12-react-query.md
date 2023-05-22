---
layout: post
title: React Query
date: 2023-05-12 00:00:00 +0900
category: react-query
published: true
---

## Query Key
---
- Key, Value 맵핑구조

<br>

React Query는 Query Key에 따라 query caching을 관리한다.<br>

- string 형태
- Array 형태

<br>

## Query Function
---
- Promise를 반환하는 함수 → 데이터를 resolve하거나 error를 throw

useQuery의 반환값 - 객체<br>

- `data`: 마지막으로 resolved 된 데이터 (response)
- `error`: 에러가 발생했을 때 반환되는 객체
- `isFetching`: request가 in-flight 일 때 true
- `status`, `isLoading`, `isSuccess`, `isLoading` 등: 모두 현재 query의 상태
- `refetch`: 해당 query refetch하는 함수 제공
- `remove`: 해당 query를 cache에서 지우는 함수 제공
- `etc.`

<br>

## example
---
{% highlight jsx linenos %}
import { useQuery } from 'react-query'

function App() {
  const info = useQuery('todos', fetchTodoList)
  //                  Query Key   Query Function
}
{% endhighlight %}

<br>

## useQuery Option
---
{% highlight jsx linenos %}
useQuery('fetchOrder', () => fetchOrder(orderNo), options)
{% endhighlight %}

- `onSuccess, onError, onSettled`: query fetching 성공/실패/완료 시 실행할 side effect 정의
- `enabled`: 자동으로 query를 실행시킬지 말지 여부
- `retry`: query 동작 실패 시, 자동으로 retry 할지 결정하게 해주는 옵션
- `select`: 성공 시 가져온 data를 가공해서 전달
- `keepPreviousData`: 새롭게 fetching 할 시 이전 데이터 유지 여부
- `refetchInterval`: 주기적으로 refetch 할지 결정하는 옵션
- `etc.`

{% highlight jsx linenos %}
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

export default function App() {
  <QueryClientProvider client={queryClient}>
    <Example />
  </QueryClientProvider>
}

function Example() {
  const { isLoading, error, data } = useQuery('repodata', () => 
    fetch('https://api.github.com/repos/tannerlinsley/react-query').then(res => 
      res.json()
    )
  )

  if (isLoading) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>{data.subscribers_count}</strong>{' '}
      <strong>{data.stargazers_count}</strong>{' '}
      <strong>{data.forks_count}</strong>
    </div>
  )
}

{% endhighlight %}

<br>

## query가 여러 개일 때
---
- 알아서 잘 된다.

{% highlight jsx linenos %}
function App() {
  // The following queries will execute in parallel
  const usersQuery = useQuery('users', fetchUsers)
  const teamsQuery = useQuery('teams', fetchTeams)
  const projectsQuery = useQuery('projects', fetchProjects)
  // ...
}
{% endhighlight %}

<br>

## Mutations

- CREATE, UPDATE, DELETE

🚀 Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects.
For this purpose, React Query exports a useMutation hook.

{% highlight jsx linenos %}
const mutation = useMutation(newTodo => {
  return axios.post('/todos', newTodo)
})
{% endhighlight %}

- Promise 반환 함수만 있어도 작동 가능 (단, Query Key 넣어주면 devtools에서 확인 가능. 디버깅에 유리)

### 반환값
---
- `mutate`: mutation을 실행하는 함수
- `mutateAsync`: mutate와 비슷 but Promise 반환
- `reset`: mutation 내부 상태 clean
- `etc.`: useQuery와 유사함

### 옵션
---
- `onMutate`: <br>
본격적인 Mutation 동작 전에 먼저 동작하는 함수, Optimistic update(성공할 것을 예상하고 UI 먼저 렌더링) 적용할 때 유용
- `etc.`: useQuery와 유사함

<br>

## Query Invalidation (쿼리 무효화)
---
{% highlight jsx linenos %}
// Invalidate every query in the cache
queryClient.invalidateQueries()
{% endhighlight %}
{% highlight jsx linenos %}
// Invalidate every query with a key that starts with 'todos'
queryClient.invalidateQueries('todos')
{% endhighlight %}

- 해당 key를 가진 query는 stale 취급되고, 현재 렌더링되고 있는 query들은 백그라운드에서 refetch 된다.

![react query 3 things](/public/img/react-query/react-query-3.png){: width='800px'}

<br>

## RFC 5861
---
- HTTP Cache-Control Extensions for Stale Content
- stale-while-revalidate<br>
→ 백그라운드에서 stale response를 revalidate 하는 동안 캐시가 가진 stale response를 반환

{% highlight jsx linenos %}
Cache-Control: max-age=600, stale-while-revalidate=30
{% endhighlight %}

- 600초가 지나면 일단은 낡은 데이터를 보여주지만 백그라운드에서는 데이터를 refetching
- 이렇게 동작하면 latency를 숨길 수 있다.

<br>

## 이 컨셉을 메모리 캐시에도 적용

- `cacheTime`: 메모리에 얼마만큼 있을 건지 (해당 시간 이후 GC에 의해 처리. default 5분)
- `staleTime`: 얼마의 시간이 흐른 뒤에 데이터를 stale 취급할 것인지 (default 0)
- `refetchOnMount / refetchOnWindowFocus / refetchOnReconnect`가 true 이면<br>
 `Mount / window focus / reconnect` 시점에 `data`가 `stale`이라고 판단되면 모두 refetch (모두 default true)

<br>

- Queries에서 cached data는 언제나 stale 취급
- 각 시점에서 data가 stale이라면 항상 refetch 발생
- inactive Queries는 5분 뒤 GC에 의해 처리
- Query 실패 시 3번까지 retry 발생


{% highlight jsx linenos %}
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

export default function App() {
  <QueryClientProvider client={queryClient}>
    <Example />
  </QueryClientProvider>
}

function Example() {
  // 데이터는 바로 stale 상태가 된다.
  // 똑같은 Query key를 가진 것이 마운트되면 refetch
  // 자동으로 update
  // 다른 화면을 보다가 다시 돌아와도 refetch
  const { isLoading, error, data } = useQuery('repodata', () => 
    fetch('https://api.github.com/repos/tannerlinsley/react-query').then(res => 
      res.json()
    )
  )

  if (isLoading) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <strong>{data.subscribers_count}</strong>{' '}
      <strong>{data.stargazers_count}</strong>{' '}
      <strong>{data.forks_count}</strong>
    </div>
  )
}

{% endhighlight %}

<br>

## React Query 상태 관리
---

### 전역 상태처럼 관리되는 데이터들
- 어떻게 Server States를 전역상태처럼 관리하는 것일까?

{% highlight jsx linenos %}
// Component A
import { useQuery } from 'react-query'

function App() {
    const info = useQuery('todos', fetchTodList)
}
{% endhighlight %}

{% highlight jsx linenos %}
// Component B
import { useQuery } from 'react-query'

function App() {
    const info = useQuery('todos', fetchTodList)
}
{% endhighlight %}

예를 들어 stale time이 30초라 하자. <br>
A 컴포넌트가 렌더링된 후 10초 후에 B 컴포넌트가 렌더링된다면 B에서 API는 호출되지 않는다.<br>
이게 어떻게 가능한 것일까? 해답은 Context API에 있다.

### QueryClient 내부적으로 Context 사용

<br>

## 장점

- 서버 상태 관리 용이
- 직관적인 API 호출 코드
- API 처리에 관한 각종 인터페이스 및 옵션 제공
- Client Store에서 정말 필요한 전역 상태만 남기에 Store답게 사용할 수 있음(Boilerplate 코드 감소)
- devtool 제공
- Cache 전략 필요할 때 매우 좋음

<br>
## 고민해봐야 할 부분

- Component가 상대적으로 비대해짐 (분리에 대한 고민 필요)
- 프로젝트 설계의 난이도가 높아짐 (Component 유착 최소화 필요)
- 단순히 API 통신 이상의 가능성

<br>

## Setting

{% highlight jsx linenos %}
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { QueryClient, QueryClientProvider } from "tanstack/react-query"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementeById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
)
{% endhighlight %}