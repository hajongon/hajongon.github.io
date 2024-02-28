---
layout: post
title: 리프레시 토큰 http 쿠키 (리액트, 스프링 부트)
date: 2023-12-11 10:00:00 +0900
category: Auth
published: true
---

기존 `accessToken`과 `refreshToken`을 모두 응답 바디로 받아 로컬스토리지에 저장하는 방식은 보안상 약점이 명확해보여서,<br>
refreshToken을 cookie에 저장하는 것으로 코드를 수정했어요.<br>
<br>
accessToken을 응답 헤더에 실어 보내면 프론트엔드에서 그것을 추출해 axiosInstance의 헤더에 담을 수도 있지만,<br>
어차피 accessToken은 로컬스토리지(브라우저 단)에 저장되므로, 기존에 응답 바디로 보내던 방식을 그대로 사용하기로 했다.<br>

## login

### Controller

```java

@Slf4j
@RequiredArgsConstructor
@RequestMapping(path = ControllerConstant.DATA_USER)
@RestController
public class UsersController {

    private final UsersService usersService;
    private final Response response;

	@PostMapping("/login")
	public ResponseEntity<?> login(@Validated @RequestBody UserRequestDto.Login login, Errors errors, HttpServletResponse httpResponse) {

		// validation check
		if (errors.hasErrors()) {
			return response.invalidFields(RefineHelper.refineErrors(errors));
		}

		Auth.AuthenticationResult authenticationResult = usersService.login(login);

		if (!authenticationResult.isSuccess()) {
			// 인증 실패에 따른 적절한 에러 응답 반환
			// 에러 메시지는 authenticationResult.getMessage()에서 가져올 수 있다.
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(authenticationResult.getMessage());
		}

		UserResponseDto.TokenInfo tokenInfo = authenticationResult.getTokenInfo();

		// refreshToken을 제외한 정보를 포함하는 LoginResponse 객체 생성
		Auth.LoginResponse response = new Auth.LoginResponse(
				authenticationResult.isSuccess(),
				authenticationResult.getMessage(),
				tokenInfo.getAccessToken(),
				tokenInfo.getGrantType()
		);

		// tokenInfo를 사용해서 cookie 만들고 add
		Cookie refreshTokenCookie = new Cookie("refreshToken", tokenInfo.getRefreshToken());
		refreshTokenCookie.setHttpOnly(true);
		refreshTokenCookie.setSecure(false);
		refreshTokenCookie.setPath("/");

		long refreshTokenMaxAge = tokenInfo.getRefreshTokenExpirationTime();
		if (refreshTokenMaxAge > Integer.MAX_VALUE) {
			refreshTokenMaxAge = Integer.MAX_VALUE;
		}
		refreshTokenCookie.setMaxAge((int) refreshTokenMaxAge);
		httpResponse.addCookie(refreshTokenCookie);

		// ResponseEntity에 tokenInfo를 포함하여 반환
		return ResponseEntity.ok(response);
	}
}
```

secure 옵션을 사용하면, HTTPS 통신 외에는 쿠키를 전달하지 않아요. <br>
현재 진행중인 프로젝트는 http 통신을 해야하는 상황이라, secure 옵션을 false로 두었어요. <br>

### Model

```java
public class Auth {
    public static class AuthenticationResult {
        private boolean success;
        private String message;
        private UserResponseDto.TokenInfo tokenInfo;

        // 인자를 받는 생성자 추가
        public AuthenticationResult(boolean success, String message, UserResponseDto.TokenInfo tokenInfo) {
            this.success = success;
            this.message = message;
            this.tokenInfo = tokenInfo;
        }

        // Getter와 Setter 메소드
        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public UserResponseDto.TokenInfo getTokenInfo() {
            return tokenInfo;
        }

        public void setTokenInfo(UserResponseDto.TokenInfo tokenInfo) {
            this.tokenInfo = tokenInfo;
        }
    }

    public static class LoginResponse {

        private boolean success;
		private String message;
        private String accessToken;
        private String grantType;

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getAccessToken() {
            return accessToken;
        }

        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }

        public String getGrantType() {
            return grantType;
        }

        public void setGrantType(String grantType) {
            this.grantType = grantType;
        }

        public LoginResponse(boolean success, String message, String accessToken, String grantType) {
            this.success = success;
            this.message = message;
            this.accessToken = accessToken;
            this.grantType = grantType;
        }

        // ... getter 및 setter 메소드 ...

    }

}
```

### Service

```java

@Slf4j
@RequiredArgsConstructor
@Service
public class UsersService {

	private final UserRepository userRepository;
	private final JwtTokenProvider jwtTokenProvider;
	private final AuthenticationManagerBuilder authenticationManagerBuilder;
	private final RedisTemplate<String, Object> redisTemplate;

	}

	public Auth.AuthenticationResult login(UserRequestDto.Login login) {

		Users user = userRepository.findByEmail(login.getEmail()).orElse(null);

		if (user == null) {
			return new Auth.AuthenticationResult(false, "email-error", null);
		}

		try {
			// 1. Login ID/PW 를 기반으로 Authentication 객체 생성
			// 이때 authentication 은 인증 여부를 확인하는 authenticated 값이 false
			UsernamePasswordAuthenticationToken authenticationToken = login.toAuthentication();
			// 2. 실제 검증(사용자 비밀번호 체크)이 이루어지는 부분
			// authenticate 메서드가 실행될 때 CustomUserDetailsService에서 만든 loadUserByUsername 메서드가 실행
			Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

			// 3. 인증 정보를 기반으로 JWT 토큰 생성
			UserResponseDto.TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);
			// 4. RefreshToken Redis 저장 (expirationTime 설정을 통해 자동삭제 처리)
			// TODO Redis connection error 처리.

			// 여기 부분을 주석처리 해놔서 redis에 RT가 저장되지 않았던 것
			String key = "RT:" + authentication.getName();
			redisTemplate.opsForValue().set(key, tokenInfo.getRefreshToken(), tokenInfo.getRefreshTokenExpirationTime(), TimeUnit.MILLISECONDS);
			return new Auth.AuthenticationResult(true, "success", tokenInfo);
		} catch (AuthenticationException e) {
			return new Auth.AuthenticationResult(false, "pw-error", null);
	}
}
```

`req body` 로 받은 데이터에서 email을 뽑아내 user를 특정해요.<br>
user가 `null` 이면 `email-error` 반환해요. <br>

#### toAuthentication

```java
@Getter
@Setter
public static class Login {

	@NotEmpty(message = "이메일은 필수 입력값입니다.")
	@Pattern(regexp = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,6}$", message = "이메일 형식에 맞지 않습니다.")
	private String email;

	@NotEmpty(message = "비밀번호는 필수 입력값입니다.")
	private String password;

	public UsernamePasswordAuthenticationToken toAuthentication() {
		return new UsernamePasswordAuthenticationToken(email, password);
	}
}

// UserRequestDto
	public UsernamePasswordAuthenticationToken(Object principal, Object credentials) {
		super(null);
		this.principal = principal;
		this.credentials = credentials;
		setAuthenticated(false);
	}
```

`UsernamePasswordAuthenticationToken`은 Spring Security 프레임워크에서 사용되는 주요 인증 토큰 중 하나예요. <br>
이 클래스는 사용자의 이름과 비밀번호를 기반으로 한 인증 정보를 나타내고, Spring Security의 인증 과정에서 중요한 역할을 해요. <br>
<br>

#### 역할 및 사용법

인증 정보의 표현: `UsernamePasswordAuthenticationToken`은 사용자의 이름과 비밀번호를 포함하는 인증 정보를 나타내요. <br>
이 정보는 사용자가 로그인할 때 입력하는 정보와 일치해요. <br>
<br>

인증 과정에서의 사용: 사용자가 시스템에 로그인할 때, 이 클래스의 인스턴스가 생성되어 인증 매니저(AuthenticationManager)에 전달돼요. <br>
인증 매니저는 이 토큰을 사용하여 사용자의 인증을 처리해요. <br>

<br>

인증 상태의 표현: 이 클래스는 인증 전과 인증 후의 상태를 모두 표현할 수 있어요. <br>
인증 전에는 isAuthenticated() 메서드가 false를 반환하고, 인증 후에는 true를 반환해요. <br>

#### 생성자와 팩토리 메서드

`UsernamePasswordAuthenticationToken`에는 두 가지 주요 생성자가 있어요.<br>

<br>

비인증 생성자 <br>
: `UsernamePasswordAuthenticationToken(Object principal, Object credentials)` 생성자는 인증되지 않은 토큰을 생성해요. <br>
이 생성자는 주로 사용자가 로그인을 시도할 때 사용된다. 여기서 principal은 사용자의 식별 정보(예: 사용자 이름), credentials는 비밀번호를 나타내요. <br>

인증 생성자 <br>
: `UsernamePasswordAuthenticationToken(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities)` 생성자는 인증된 토큰을 생성해요. <br>
이 생성자는 `AuthenticationProvider`에 의해 사용자가 성공적으로 인증된 후에 사용됩니다. 여기서 authorities는 사용자에게 부여된 권한을 나타내요. <br>
<br>
또한, `UsernamePasswordAuthenticationToken`에는 두 가지 팩토리 메서드가 있어요. <br>

<br>

`unauthenticated(Object principal, Object credentials)`: 인증되지 않은 토큰을 생성해요. <br>
`authenticated(Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities)`: 인증된 토큰을 생성해요. <br>
이러한 생성자와 팩토리 메서드는 인증 과정의 다양한 단계에서 사용자의 인증 정보를 적절하게 표현하는 데 사용해요. <br>
