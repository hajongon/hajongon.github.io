---
layout: post
title: leetcode 387. First Unique Character in a String
date: 2024-03-19 10:00:00 +0900
category: Algorithm
published: true
---

## 문제

### Goal

Given a string `s`, find the first non-repeating character in it and return its index. <br>
If it does not exist, return `-1`. <br>

### Example

Example 1:

```
Input: s = "leetcode"
Output: 0
```

Example 2:

```
Input: s = "loveleetcode"
Output: 2
```

Example 3:

```
Input: s = "aabb"
Output: -1
```

## Constraints

-   🐥 `1` <= `s.length` <= `10^5`
-   🐥 `s` consists of only lowercase English letters.

### 최초 접근 방법

1. 🐥 문자열 `s`를 순회하면서 객체를 사용해 각 문자의 개수를 계산한다.
2. 🐥 큐 클래스를 정의한다.
3. 🐥 각기 다른 알파벳 하나씩을 순서대로 큐에 add한다.
4. 🐥 `index` 변수를 선언한다.
5. 🐥 큐에서 알파벳을 하나씩 꺼내면서, 해당 알파벳의 count가 1이 아닐 경우 `index`를 1 증가시킨다.
6. 🐥 큐에서 꺼낸 알파벳의 count가 1이면 `index`를 리턴한다.

### 코드

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
    class Queue {
        constructor() {
            this.storage = new Map()
            this.front = 0
            this.rear = 0
        }

        size() {
            return this.storage.size
        }

        add(value) {
            if (!this.storage.size) {
                this.storage.set(0, value)
            } else {
                this.rear += 1
                this.storage.set(this.rear, value)
            }
        }

        popleft() {
            const item = this.storage.get(this.front)
            if (this.storage.size === 1) {
                this.storage.clear()
                this.front = 0
                this.rear = 0
            } else {
                this.storage.delete(this.front)
                this.front += 1
            }
            return item
        }
    }

    const q = new Queue()
    let index = 0

    const charCount = {}

    for (let i = 0; i < s.length; i++) {
        if (charCount[s[i]] && charCount[s[i]] > 0) {
            charCount[s[i]]++
        } else {
            charCount[s[i]] = 1
            q.add(s[i])
        }
    }

    while (q.size() > 0) {
        if (charCount[q.popleft()] === 1) {
            return index
        } else {
            index++
            continue
        }
    }
    return -1
}
```

"leetcode", "loveleetcode", "aabb" 는 통과했는데, "dddccdbba"에서 실패<br>
<br>

```
output: 3
expected: 8
```

### 틀린 이유

<br>
d가 1번 나온 알파벳이 아닐 때, 인덱스를 1 증가시키고<br>
c가 1번 나온 알파벳이 아닐 때, 인덱스를 1 증가시키고<br>
b가 1번 나온 알파벳이 아닐 때, 인덱스를 1 증가시키고<br>
a가 1번 나온 알파벳일 때 인덱스를 리턴하므로 3이 리턴되는 것.<br>
<br>
접근 방식을 달리해야 한다.<br>
<br>

### 접근 수정

1. 🐥 `dddccdbba` 라는 문자열에서 새로운 알파벳이 처음 등장할 때마다 그 인덱스를 큐에 저장해둔다.
2. 🐥 0(d), 3(c), 6(b), 8(a) 의 인덱스들이 큐에 저장될 것이다.
3. 🐥 큐에서 인덱스를 하나씩 꺼내보면서, 그 인덱스에 해당하는 알파벳의 count를 체크한다.
4. 🐥 count가 1일 때, 해당 인덱스를 리턴한다.
5. 🐥 큐가 빌 때까지 count가 1인 알파벳이 없으면, -1을 리턴한다.

### 코드

```javascript
/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
    class Queue {
        constructor() {
            this.storage = new Map()
            this.front = 0
            this.rear = 0
        }

        size() {
            return this.storage.size
        }

        add(value) {
            if (!this.storage.size) {
                this.storage.set(0, value)
            } else {
                this.rear += 1
                this.storage.set(this.rear, value)
            }
        }

        popleft() {
            const item = this.storage.get(this.front)
            if (this.storage.size === 1) {
                this.storage.clear()
                this.front = 0
                this.rear = 0
            } else {
                this.storage.delete(this.front)
                this.front += 1
            }
            return item
        }
    }

    const q = new Queue()

    const charCount = {}

    for (let i = 0; i < s.length; i++) {
        let c = s[i]
        charCount[c] = (charCount[c] || 0) + 1

        // 처음 나오는 글자의 인덱스를 찝어둔다.
        // dddccdbba 라고 한다면,
        // 0 (d), 3 (c), 6 (b), 8 (a) 이렇게 큐에 저장해두는 것.
        if (charCount[c] === 1) {
            q.add(i)
        }
    }

    while (q.size() > 0) {
        // 찝어뒀던 인덱스들 (0, 3, 6, 8) 에 해당하는 알파벳이 한 번 나온 경우에 그 인덱스를 리턴
        let index = q.popleft()
        if (charCount[s[index]] === 1) {
            return index // If its count is 1, it's the first unique character
        }
    }

    return -1
}
```
