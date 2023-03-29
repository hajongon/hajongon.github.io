---
layout: post
title: 타입스크립트 webpack 기초
date: 2023-03-29 00:00:00 +0900
category: TypeScript
published: true
---


# webpack이란?
---

![webpack image](/public/img/ts_img/ts-webpack/webpack.png){: width="800px"}<br>

webpack은 서로 다른 파일을 하나의 묶음(`bundle`)으로 만드는 툴이다.<br>
웹팩은 JavaScript 파일 뿐만 아니라 Stylesheet, font, image 등의 파일도 모듈로 작성할 수 있게 해준다는 큰 장점을 갖고 있다. <br> 또한 `HTTP` 요청의 생성 수를 줄여서 어플리케이션 속도를 향상시켜주기도 한다.<br>
비교적 규모가 큰 프로젝트에서 다수의 개별 파일로 작업하는 경우에 웹팩은 큰 도움이 된다.
<br><br>

[웹팩 공식 문서][link1]

[link1]: https://webpack.kr/concepts/

<br>
<br>
# webpack 설정하기
---


## install

<br>

1️⃣ 타입스크립트 설치 및 초기화
<br>

{% highlight bash linenos %}
npm i -D typescript
tsc --init
{% endhighlight %}
<br>

2️⃣ `webpack`, `webpack-cli`, `webpack-dev-server` 설치

{% highlight bash linenos %}
npm i -D webpack
npm i -D webpack-cli
npm i -D webpack-dev-server
{% endhighlight %}
<br>

- `webpack-cli`는 웹팩 터미널 도구, `webpack-dev-server`는 개발 환경에서 사용할 수 있는 서버 패키지다.

<br>

3️⃣ Loaders 설치
  - 웹팩은 모든 파일을 모듈로 취급한다. loader는 파일 하나하나를 해석하고 변환하는 역할을 수행한다.<br>
  - css-loader: css 파일을 모듈로 변환한다.
  - sass-loader: sass/scss 파일을 css로 변환한다.
  - style-loader: JavaScript로 변경된 스타일을 동적으로 DOM에 추가한다.<br><br>
  - 설치
{% highlight bash %}
npm i -D style-loader css-loader sass sass-loader
{% endhighlight%}

<br>

다음 코드를 `webpack.config.js` 파일의 `rules` 배열 안에 작성한다. <br>(`webpack.config.prod.js`를 따로 작성한다면 그 파일에도 작성)

{% highlight javascript linenos %}
  {
    // .scss, .css로 끝나는 파일들을 점검하라
    test: /\.(scss|css)$/, 
    use: [
      'style-loader',
      'css-loader',
      'sass-loader',
    ], // 배열의 역순으로 로더가 동작한다.
      // scss파일을 css파일로 컴파일 -> css-loader를 적용해 모듈화 -> 동적으로 돔에 추가
  },
{% endhighlight %}
<br>

4️⃣ HTMLWebpackPlugin
  - 번들을 제공하기 위한 HTML 파일을 쉽게 생성할 수 있도록 해준다.
{% highlight bash %}
npm i -D html-webpack-plugin
{% endhighlight%}
  
{% highlight javascript linenos %}
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html', // 템플릿 경로를 지정
    templateParameters: { // 템플릿에 주입할 파라미터 지정
      env: process.env.NODE_ENV === 'development' 
      ? '(개발중)' : '', // env변수 설정
    },
    hash: true, // 해쉬값 추가
    minify:
      process.env.NODE_ENV === 'production' // 배포모드라면
        ? {
            collapseWhitespace: true, // 줄바꿈을 없앤다.
            removeComments: true, // 주석을 제거한다.
          }
        : false, // 개발모드일 때는 실행하지 않는다.
  })
]


{% endhighlight%}  
<br>
  
  - `template`: html 코드를 만들 템플릿 파일의 경로
  - `templateParameters`: 빌드 시 템플릿에 넣을 변수 설정. `변수명: 값`
  - `hash`: 정적 파일을 불러올 때 쿼리 문자열에 해쉬값을 추가. 캐시 문제 보호.
  - `minify`: html 코드 압축 설정
    - `collapseWhitespace`: 줄바꿈 없애기
    - `removeComments`: 주석 제거

<br>

### templateParameters
<br>
`templateParameters` 옵션은 HTML 템플릿 파일에 주입할 파라미터를 정의한다. <br>
이를 통해 웹팩에서 동적으로 생성된 값들을 HTML 파일 내에서 사용할 수 있다.<br>

위 코드에서는 `env` 파라미터를 정의하고, 이를 이용하여 현재 개발환경인지 배포환경인지를 구분한다. <br>
`process.env.NODE_ENV` 값이 'development'인 경우 '(개발중)' 문자열이, 'production'인 경우는 빈 문자열이 `env` 파라미터로 전달된다.<br>

이렇게 전달된 `env` 파라미터는 HTML 템플릿 파일에서 다음과 같이 사용할 수 있다.

<br>

{% highlight html linenos %}

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>My App <%= env %></title>
  </head>
  <body>
    ...
  </body>
</html>

{% endhighlight %}

<br>

위 예시에서 `<%= env %>`는 `env` 파라미터의 값을 출력하는 EJS 문법이다. 
<br>따라서 개발모드에서는 페이지 제목이 'My App (개발중)'으로 출력되고, 배포모드에서는 'My App'으로 출력된다.


<br>
5️⃣ MiniCssExtractPlugin

  - CSS 파일을 필요로 하는 JS 파일에 대해 CSS 파일을 따로 생성한다.<br>
  - 3rd party package
  - Stylesheet의 크기가 커지면 JavaScript 파일 하나로 번들링하는 것에 부담을 준다.
  - CSS 코드만 별도로 분리해 어플리케이션 성능을 향상시킨다.
  - 배포환경에서 사용한다.

{% highlight bash %}
npm i -D mini-css-extract-plugin
{% endhighlight %}



{% highlight javascript linenos %}
module: {
  rules: [
    {
      test: /\.(scss|css)$/,
      use: [

        // 배포모드에서는 Stylesheet를 JavaScript로 모듈화하지 않고 
        // css파일로 변환할 것이기 때문에 다른 로더 사용
        process.env.NODE_ENV === 'production'
          ? MiniCssExtractPlugin.loader
          : 'style-loader',
        'css-loader',
        'sass-loader',

      ],
    },
  ],
},
plugins: [
  ...(process.env.NODE_ENV === 'production' // 배포모드만
    // output 경로에 CSS 파일 생성
    ? [new MiniCssExtractPlugin({ filename: `[name].css` })] 
    : []),
]
{% endhighlight %}



++

<br>
웹팩을 정확하게 동작시키기 위해서는, 모든 `import` 구문에서 `.js` 확장자를 제거해야 한다.<br>
웹팩이 자동적으로 `.js` 및 기타 확장자를 찾기 때문이다. 제거하지 않으면 웹팩이 이중 확장자를 검색한다.<br>

하지만 웹팩 설정에서 `resolve.extensions` 속성을 설정하지 않았다면, 웹팩이 모듈을 찾을 때 파일 확장자를 찾지 못해 에러가 발생할 수 있다. 따라서, 해당 속성을 설정하여 필요한 파일 확장자를 등록해주는 것이 좋다. 예를 들어 다음과 같이 웹팩에서 `.js` 파일 확장자를 자동으로 처리하도록 할 수 있다.
<br>
<br>
{% highlight javascript linenos %}
 
module.exports = {
  // ...
  resolve: {
    extensions: ['.js', '.ts']
  }
};

{% endhighlight %}
<br>

위와 같이 설정하면 `import` 구문에서 `.js`, `.ts` 확장자를 생략해도 웹팩이 자동으로 처리한다.

<br>
<br>

## tsconfig.json

`rootDir` 은 필요하지 않다. 웹팩이 루트 파일 위치를 결정한다.<br>
`"sourceMap": true` &rarr; 코드의 디버깅 지원. 웹팩도 이를 지원한다.

<br>
<br>


## webpack.config.json
<br>

{% highlight javascript linenos %}

// node.js가 설치된 경우, 이미 path 모듈을 보유하고 있는 상태
const path = require('path');

module.exports = {
  // 개발을 하기 위해 build하고 있다는 것을 알림. 최적화를 덜 진행.
  mode: 'development',

  entry: './sre/app.ts',
  output: {
    // html 상에서 head에 불러오는 script를 "dist/bundle.js"로 수정해야 한다.
    filename: 'bundle.js',
    // path는 절대 경로를 필요로 한다. 빌드하기 위해서는 node.js 모듈이 필요하다.
    // __dirname 은 node.js를 사용하는 환경에서 전역적으로 사용 가능하다.
    // 웹팩은 dist 폴더로 절대 경로를 구축하고, 그것을 사용하여 output을 write한다.
    path: path.resolve(__dirname, 'dist'),
    // webpack-dev-server 사용 시 output이 어디에 있는지 이해하기 위한 추가 구성
    publicPath: 'dist'
  },
  // bundle을 추출하고 생성된 소스 맵이 존재한다는 것을 웹팩에게 전달.
  devtool: 'inline-source-map',
  // 찾은 파일을 어떻게 처리할지, 파일 내 import를 어떻게 처리할지 전달
  module: {
    // 모든 파일에 적용될 법칙 설정
    rules: [
      // loader는 웹팩에게 특정 파일을 어떻게 다룰지를 알려주는 패키지
      {
        // .ts로 끝나는 파일들을 점검하라
        test: /\.ts$/,
        // 이 파일로 뭘 할 건가? 웹팩이 사용하는 loader 명시
        // ts-loader는 자동적으로 tsconfig.json 파일을 고려한다.
        use: 'ts-loader',
        // 제외할 파일
        exclude: /node_modules/
      },
      {
        // .scss, .css로 끝나는 파일들을 점검하라
        test: /\.(scss|css)$/, 
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ], // 배열의 역순으로 로더가 동작한다.
           // scss파일을 css파일로 컴파일 
           // -> css-loader를 적용해 모듈화 
           // -> 동적으로 돔에 추가
      },
      // Asset Modules
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, 
          },
        },
      },
      
    ]
  },
  // 찾아낸 import에 추가할 파일 확장자를 웹팩에 전달
  resolve: {
    extensions: ['.ts', '.js']
  }
};

{% endhighlight %}

<br>
<br>

## package.json
<br>

{% highlight javascript linenos %}

"scripts": {
  // ...
  "start": "webpack-dev-server"
  "build": "webpack"
}

{% endhighlight %}

<br>
<br>

## build

<br>

{% highlight bash %}

npm run build

{% endhighlight %}

<br>
<br>

## webpack-dev-server
<br>


코드를 수정하고 저장하면 자동으로 컴파일된다. 하지만 `dev-server` 상에 반영되지는 않는다. <br>
단적인 예로, dist 폴더를 삭제한 후 다시 `npm start`를 실행해도 터미널 상에서는 정상적으로 작동한다. 
`webpack-dev-server` 모드에서 번들은 메모리에만 생성된다. 따라서 메모리에 있는 내용이 `dev-server`에 의해 로드되지만, `dist`에 `write`되지는 않는다. 페이지를 새로고침 해보면 오류가 떠 있는 것을 볼 수 있다. 그 이유는 `html` 파일에서 `dist` 폴더 내에 있는 `bundle.js` 파일을 로드하고 있어서다. `bundle.js` 파일이 정확하게 wired up 되어 있지 않기 때문에 오류가 발생하는 것이다. 이를 연결하기 위해서는 `webpack.config.js` 파일의 `output`에 `publicPath`를 입력하고 그것을 `dist`로 설정해야 한다.

<br>
<br>


## production mode
<br>

`webpack.config.prod.js` 파일을 만든다.

{% highlight javascript linenos %}

const path = require("path");
// const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: "production",
  entry: "./sre/app.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    // webpack-dev-server에 필요했던 부분이므로 삭제한다.
    // publicPath: 'dist'
    clean: true, // output을 write하기 전에 출력 디렉토리를 비운다. plugin을 사용할 수도 있다.
  },
  // 프로덕션에 devtool은 필요없다.
  devtool: "none",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: [
          // 배포모드에서는 Stylesheet를 JavaScript로 모듈화하지 않고
          // css파일로 변환할 것이기 때문에 다른 로더 사용
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
              "css-loader",
              "sass-loader",
        ],
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },

  // extensions
  // clean-webpack-plugin: 새로운 output이 write 되기 전에 dist 폴더 내 모든 파일을 삭제
  // plugins: [
  //   new CleanPlugin.CleanWebpackPlugin()
  // ]
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 템플릿 경로를 지정
      templateParameters: {
        // 템플릿에 주입할 파라매터 변수 지정
        env: process.env.NODE_ENV === "development" 
        ? "(개발중)" : "", // env변수 설정
      },
      hash: true, // 해쉬값을 추가
      minify:
        process.env.NODE_ENV === "production" // 배포모드만
          ? {
              collapseWhitespace: true, // 줄바꿈 없애기
              removeComments: true, // 주석 제거
            }
          : false, // 개발모드일 때는 x
    }),
  ],
};


{% endhighlight %}


<br>

`package.json` 파일 내 `scripts`의 `build`를 수정한다.

{% highlight javascript linenos %}
"scripts": {
  // ...
  "build": "webpack --config webpack.config.prod.js"
}
{% endhighlight %}


<br>



# 새롭게 알게 된 사실
---

`webpack-dev-server`에서 사용할 환경설정은 `webpack.config.js`에서,<br>
실제 `build` 할 때의 환경설정은 `webpack.config.prod.js`에서 한다.
<br>
<br>
# 참고자료
---
[husbumps 개발로그](https://velog.io/@husbumps/TS-Boilerplate-1) <br>
[공식문서](https://webpack.js.org/concepts/)<br>
[udemy TypeScript 강좌 Section 11](https://www.udemy.com/course/best-typescript-21/)
