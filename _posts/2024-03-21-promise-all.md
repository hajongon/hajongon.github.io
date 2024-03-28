---
layout: post
title: React에서 API 여러개 호출 시 데이터 동시 렌더링
date: 2024-03-21 10:00:00 +0900
category: React
published: true
---

## 문제

![동시에 뜨지 못함](/public/img/react/apiapi/data-crop.gif){: width="800px"} <br>

타다닥 뜨는 게 너무 꼴보기 싫어요ㅜㅜ<br>
DB에 데이터가 많은 상황이라면 더 심해질 수도 있을 것 같고요.<br>

## 현재 코드

```jsx
const onNameChange = async (e) => {
    setShowResult(false)
    if (e.target.value === '환자 선택') {
        setIsPatientSelected(false)
        setPatInfoData({
            birthday: '',
            admtime: '',
            dschtime: '',
            sex: '',
            bodytemp: 0,
            ptSbstNo: '',
        })
    } else {
        setIsPatientSelected(true)
        const selectedData = patientsInfo.filter(
            (pat) => pat.ptSbstNo === e.target.value
        )[0]
        const sbstNo = selectedData.ptSbstNo
        setPatInfoData({ ...selectedData })

        const urineResponse = await getTestData(
            `/cdss/urine?ptSbstNo=${sbstNo}`
        )
        if (urineResponse.status === 'success') {
            setUrineData(urineResponse.data)
        } else {
            // 에러 처리
        }

        const serumResponse = await getTestData(
            `/cdss/serum?ptSbstNo=${sbstNo}`
        )
        if (serumResponse.status === 'success') {
            const transformedData = rearrangeSerumData(serumResponse.data)
            setSerumData(transformedData)
        } else {
            // 에러 처리
        }

        const periphResponse = await getTestData(
            `/cdss/periph?ptSbstNo=${sbstNo}`
        )
        if (periphResponse.status === 'success') {
            const transformedData = rearrangePeriphData(periphResponse.data)
            setPeriphData(transformedData)
        } else {
            // 에러 처리
        }

        const antiSensResponse = await getTestData(
            `/cdss/antisens?ptSbstNo=${sbstNo}`
        )
        if (antiSensResponse.status === 'success') {
            const { beforeAdmData, afterAdmData } = splitByAdmDate(
                antiSensResponse.data,
                selectedData.admtime
            )
            setAntiSensBeforeAdm(beforeAdmData)
            setAntiSensAfterAdm(afterAdmData)
        } else {
            // 에러 처리
        }

        const adrResponse = await getTestData(`/cdss/adr?ptSbstNo=${sbstNo}`)
        if (adrResponse.status === 'success') {
            setAdrs(adrResponse.data)
        } else {
            // 에러 처리
        }
    }
}
```

<br>

딱히 받아오는 순서가 중요한 게 아닌데 `async`, `await` 코드를 남발해버렸어요.<br>
마침 그때, 학습했던 `Promise.all` 이 생각났어요. 그래서 바로 적용해봤어요. <br>

```jsx
const onNameChange = async (e) => {
    setShowResult(false)
    if (e.target.value === '환자 선택') {
        setIsPatientSelected(false)
        setPatInfoData({
            birthday: '',
            admtime: '',
            dschtime: '',
            sex: '',
            bodytemp: 0,
            ptSbstNo: '',
        })
        return
    }
    const selectedData = patientsInfo.find(
        (pat) => pat.ptSbstNo === e.target.value
    )
    const sbstNo = selectedData.ptSbstNo
    setPatInfoData({ ...selectedData })

    const fetchPromises = [
        getTestData(`/cdss/urine?ptSbstNo=${sbstNo}`),
        getTestData(`/cdss/serum?ptSbstNo=${sbstNo}`),
        getTestData(`/cdss/periph?ptSbstNo=${sbstNo}`),
        getTestData(`/cdss/antisens?ptSbstNo=${sbstNo}`),
        getTestData(`/cdss/adr?ptSbstNo=${sbstNo}`),
    ]

    // promise all
    try {
        // await 사용
        const responses = await Promise.all(fetchPromises)
        // 구조 분해 할당
        const [urineRes, serumRes, periphRes, antiRes, adrRes] = responses

        // urine 매핑
        if (urineRes.status === 'success') {
            setUrineData(urineRes.data)
        } else {
            // 에러 처리
        }

        // serum 매핑
        if (serumRes.status === 'success') {
            const transformedData = rearrangeSerumData(serumRes.data)
            setSerumData(transformedData)
        } else {
            // 에러 처리
        }

        // periph 매핑
        if (periphRes.status === 'success') {
            const transformedData = rearrangePeriphData(periphRes.data)
            setPeriphData(transformedData)
        } else {
            // 에러 처리
        }

        // antisens 매핑
        if (antiRes.status === 'success') {
            const { beforeAdmData, afterAdmData } = splitByAdmDate(
                antiRes.data,
                selectedData.admtime
            )
            setAntiSensBeforeAdm(beforeAdmData)
            setAntiSensAfterAdm(afterAdmData)
        } else {
            // 에러 처리
        }

        // adr 매핑
        if (adrRes.status === 'success') {
            setAdrs(adrRes.data)
            setNoDataError((prevState) => ({
                ...prevState,
                adrs: false,
            }))
        } else {
            // 에러 처리
        }
    } catch (error) {
        console.error(error.message)
    }
}
```

<br>

## 깔끔해진 렌더링

![promise all 적용](/public/img/react/apiapi/solved-crop.gif){: width="800px"} <br>

## 결론

여러개의 API를 하나의 컴포넌트에서 한 번에 호출할 경우, `Promise.all`을 사용해봅시다.
