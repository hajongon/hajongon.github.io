---
layout: post
title: [리액트 - 스프링 부트] 로그인 상태 유지
date: 2023-12-20 10:00:00 +0900
category: Security
published: true
---

## 로그인 성공 시 유저 정보 요청

```jsx
const navigate = useNavigate()
const { setIsLogin, setUserInfo } = useContext(AppContext)
const [formData, setFormData] = useState({
    email: '',
    password: '',
})

const handleSubmit = async (e) => {
    e.preventDefault()
    navigate('/')

    const inputData = {
        email: formData.email,
        password: formData.password,
    }
    // POST 요청 설정
    const userInfo = JSON.stringify(inputData) // FormData를 요청의 본문으로 사용

    const logInResponse = await logIn(
        `${process.env.REACT_APP_API_USER_URL}/login`,
        userInfo
    )

    if (logInResponse.data.message === 'success') {
        const currentUserInfo = await getCurrentUserInfo()
        if (currentUserInfo.idx) {
            setUserInfo(currentUserInfo)
            navigate('/system/cdss-main')
            setIsLogin(true)
            toast.success(`Logged in as ${formData.email}`, {
                theme: 'colored',
            })
        } else {
            // 에러 처리
        }
    } else {
        // 에러 처리
    }
}
```

로그인에 성공했을 경우, `getCurrentUserInfo` 메서드를 호출한다. <br>

#### getCurrentUserInfo

```jsx
export const getCurrentUserInfo = async () => {
    console.log('getCurrentUserInfo')
    try {
        const response = await authInstance.get('/user/profile')
        return response.data
    } catch (error) {
        return null
    }
}
```

액세스 토큰이 만료됐을 경우, refresh 요청까지 보내봐야 로그인 상태를 알 수 있기 때문에<br>
`authInstance`를 사용했어요.

#### 백엔드 로직

```java
@GetMapping("/profile")
public ResponseEntity<?> getProfile(Authentication authentication) {
    if (authentication == null) {
        throw new AccessDeniedException("No authentication information found");
    }

    String userEmail = authentication.getName(); // 사용자 이메일 주소 또는 사용자명을 가져옴
    Users user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + userEmail));

    long userId = user.getIdx(); // 사용자의 고유 식별자(ID)를 가져옴
    UserResponseDto.Profile profile = usersService.findMember(userId);
    return ResponseEntity.ok(profile); // 사용자 프로필 정보 반환
}
```

## 새로고침 시 로그인 상태 유지

항상 존재하는 요소(`NavbarTop`)에 `useEffect` 훅을 이용해서 `authHandler` 메서드를 실행시켜요.<br>
우선은 헤더에 들어있는 액세스 토큰을 통해 userInfo를 요청해요.<br>

요청에 실패했을 경우 (액세스 토큰 만료)<br>
쿠키에 만료되지 않은 리프레시 토큰이 존재한다면 `reissue` 요청을 통해 액세스 토큰을 갱신한 뒤 `userInfo`를 불러오게 돼요.<br>

```jsx
const NavbarTop = () => {
    const { setUserInfo } = useContext(AppContext)
    const { pathname } = useLocation()

    const authHandler = async () => {
        const userInfo = await getCurrentUserInfo()
        setUserInfo(userInfo)
    }

    useEffect(() => {
        authHandler()
    }, [pathname])

    return <Navbar>{/* jsx 요소 */}</Navbar>
}
```
