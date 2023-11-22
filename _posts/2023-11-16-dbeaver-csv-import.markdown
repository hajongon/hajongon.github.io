---
layout: post
title: DBeaver PostgreSQL CSV 파일 import 시 구분자 및 헤더 관련 에러
date: 2023-11-14 10:00:00 +0900
category: DB
published: true
---

## 이슈

```
RN000001|2021-09-08 00:00:00.000|2013|2021-09-08 16:02:00.000|2021-09-09 01:36:00.000|2021-09-08 16:02:00.000|2021-09-08 00:00:00.000|B004400102|WBC|S06|R.Urine|B|/HPF||"7"|H|"4"|"0"|2021-09-08 21:33:04.000|H|SL
```

이렇게 생겨먹은 데이터를 가져오려 하는데 <br>

```
Error occurred during batch insert
(you can disable batch insert in order to skip particular rows).

이유:
 SQL Error [23502]: Batch entry 0 INSERT INTO cdss.urine ("7""|H|""4""|""0""|2021-09-08 21:33:04.000|H|SL")
	VALUES ('3P"|"3+"||||2021-09-08 21:33:04.000|H|SL') was aborted: ERROR: null value in column "pt_sbst_no" of relation "urine" violates not-null constraint
  Detail: Failing row contains (null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 3P"|"3+"||||2021-09-08 21:33:04.000|H|SL).  Call getNextException to see other errors in the batch.
```

이런 에러가 발생했다.

<br>

## 해결 과정

### 구분자

챗지피티의 답변 중에 이것이 눈에 띄었다.

```
CSV 파일 포맷 확인: CSV 파일의 구분자가 데이터베이스 테이블의 구조와 일치하는지 확인하세요. 제공된 데이터는 파이프(|)로 구분되어 있는 것으로 보입니다.
```

그럼 원래 파이프로 구분하는 것이 아니란 건가? 찾아보았다.

```
"Microsoft Excel 쉼표로 구분된 값 파일(.csv)"는 Microsoft Excel에서 사용하는, 데이터가 쉼표(,)로 구분된 텍스트 파일 형식을 의미합니다. CSV(Comma-Separated Values) 파일은 데이터를 저장하는데 널리 사용되는 간단한 형식으로, 각 데이터 항목은 쉼표로 구분되고 각 행은 새로운 라인으로 구분됩니다.
```

원래는

```
데이터1, 데이터2, 데이터3
```

이렇게 구분되어 있어야 하는데, 내가 받은 파일은

```
데이터1 | 데이터2 | 데이터3
```

이렇게 구분되어 있는 것이다. 그럼 어떻게 바꿔줘야 할까?<br>
이것저것 보다보니 DBeaver 의 import 화면 속 눈에 띄는 부분이 있었다.<br>

![구분자쉼표](/public/img/db/delimeter-not-changed.png){:width="600px"}

구분자가 쉼표(`,`)로 설정되어있다!

이걸 바꿔줬다.

![구분자변경](/public/img/db/delimeter-changed.png){:width="600px"}

그리고 다음 버튼을 눌렀더니 아래 사진과 같은 화면이 나왔다.

![컬럼리스트](/public/img/db/column-not-matched.png){:width="600px"}

Target들을 column에 맞게 맞춰줘야하나 싶어서 하나 하나 바꿔줬다. 아래는 바꾸는 중 화면이다.

![target-changing](/public/img/db/delimeter-is-changing.png){:width="600px"}

다 바꾸고, import를 실행시켰는데 아래와 같은 에러가 발생했다.

```
(you can disable batch insert in order to skip particular rows).

이유:
 SQL Error [42701]: Batch entry 0 INSERT INTO cdss.urine (pt_sbst_no,orddate,ordseqno,admtime,dschtime,admtime,orddate,examcode,examname,spccode,spcname,rslttype,unit,rsltcode,rsltnum,normalfg,normmaxval,normminval,verifytm,normalfg,examtyp)
	VALUES ('RN000001','2021-09-08 00:00:00+09',2013,'2021-09-08 16:02:00+09','2021-09-09 01:36:00+09','2021-09-08 16:02:00+09','2021-09-08 00:00:00+09','B004400107','Bacteria','S06','R.Urine','B','','3P','3+','','','','2021-09-08 21:33:04+09','H','SL') was aborted: ERROR: column "admtime" specified more than once
  Position: 70  Call getNextException to see other errors in the batch.
```

`INSERT` 명령에서 `admtime` 컬럼이 두 번 지정되었다는 것 같은데, 왜 이런 오류가 발생한 건지... 모르겠서용 <br>

<br>

### 헤더 위치 변경

계속 들여다보다가 `헤더 위치`라는 옵션을 발견했다. 헤더를 통해 컬럼의 정보를 받는 것 같다.

![헤더위치탑](/public/img/db/header-top.png){:width="600px"}

내가 가진 파일은 바로 데이터부터 시작하기 때문에 `헤더 위치`를 `none`으로 변경했다.

![헤더없음](/public/img/db/header-none.png){:width="600px"}

그랬더니, 알아서 컬럼 Target 매치가 되는 것을 확인할 수 있었다.

이렇게 설정을 완료하고 나니 import가 성공적으로 됐다!! ㅎㅎㅎ
