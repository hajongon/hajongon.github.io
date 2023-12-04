---
layout: post
title: 리액트 - 스프링부트 jwt
date: 2023-11-30 10:00:00 +0900
category: Auth
published: true
---

## login

### Client

```javascript
import { saveTokenToLocalStorage } from '../utils/tokenHandler'
import { axiosInstance } from './instance'

export const logIn = async (apiUrl, userInfo) => {
    try {
        const response = await axiosInstance.post(apiUrl, userInfo)
        const { grantType, accessToken, refreshToken } = response.data.data
        const newAccessToken = `${grantType} ${accessToken}`
        saveTokenToLocalStorage('accessToken', newAccessToken)
        saveTokenToLocalStorage('refreshToken', refreshToken)
        return response.data
    } catch (error) {
        console.error(error)
        return error
    }
}
```

```
apiUrl === '/login'
grantType === 'bearer'
```

### Server

```java
@PostMapping("/login")
public ResponseEntity<?> login(@Validated @RequestBody UserRequestDto.Login login, Errors errors) {

	log.info("in !! {} ", login.getEmail());

	// validation check
	if (errors.hasErrors()) {
		return response.invalidFields(RefineHelper.refineErrors(errors));
	}
	return usersService.login(login);
}
```

```java
// usersService.login
public ResponseEntity<?> login(UserRequestDto.Login login) {

	if (userRepository.findByEmail(login.getEmail()).orElse(null) == null) {
		return response.fail("해당하는 유저가 존재하지 않습니다.", HttpStatus.BAD_GATEWAY);
	}
	// 1. Login ID/PW 를 기반으로 Authentication 객체 생성
	// 이때 authentication 는 인증 여부를 확인하는 authenticated 값이 false
	UsernamePasswordAuthenticationToken authenticationToken = login.toAuthentication();

	// 2. 실제 검증(사용자 비밀번호 체크)이 이루어지는 부분
	// authenticate 메서드가 실행될 때 CustomUserDetailsService에서 만든 loadUserByUsername 메서드가 실행
	Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

	// 3. 인증 정보를 기반으로 JWT 토큰 생성
	UserResponseDto.TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

	// 4. RefreshToken Redis 저장 (expirationTime 설정을 통해 자동삭제 처리)
	// TODO Redis connection error 처리.
	String key = "RT:" + authentication.getName();
	redisTemplate.opsForValue().set(key, tokenInfo.getRefreshToken(), tokenInfo.getRefreshTokenExpirationTime(), TimeUnit.MILLISECONDS);

	// Redis에서 refreshToken 조회 후 String으로 캐스팅
	String currentRefreshToken = (String) redisTemplate.opsForValue().get(key);
	log.info("Current RefreshToken for user {} in Redis: {}", authentication.getName(), currentRefreshToken);

	return response.success(tokenInfo, "로그인에 성공했습니다.", HttpStatus.OK);
}
```

## Access Token 만료 이후

### Client

```javascript
import { authInstance } from './instance'

export const getTestData = async (apiUrl) => {
    try {
        const response = await authInstance.get(apiUrl)
        return { status: 'success', data: response.data }
    } catch (error) {
        console.error(error)
        return { status: 'fail', error }
    }
}
```

여기서 `authInstance`는 jwt 인증이 필요한 axios 요청에 대해 만들어 둔 인스턴스다.<br>
그러므로 액세스 토큰이 만료된 이후 해당 요청을 보내면 401 에러가 반환된다.

```javascript
function createAuthAxiosInstance() {
    const instance = axios.create(instanceOptions)
    instance.interceptors.request.use(setAccessTokenOnHeader)
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const { config, response } = error
            // authInstance 의 응답이 401일 경우
            if (response.status === 401) {
                // 현재 로컬스토리지에 저장되어 있는 at, rt 를 불러옴
                try {
                    const currentAccessToken =
                        getTokenFromLocalStorage('accessToken') || ''
                    const currentRefreshToken =
                        getTokenFromLocalStorage('refreshToken') || ''
                    // 요청 바디에 담아서
                    const requestBody = JSON.stringify({
                        accessToken: currentAccessToken.slice(7),
                        refreshToken: currentRefreshToken,
                    })

                    // reissue 요청
                    const refreshRes = await axiosInstance.post(
                        `/user/reissue`,
                        requestBody
                    )

                    // reissue 요청에 대한 응답 코드 (refresh 여부) 가 200이라면
                    if (refreshRes.data.state === 200) {
                        // 로컬스토리지 at, rt 갱신
                        const { grantType, accessToken, refreshToken } =
                            refreshRes.data.data
                        const newAccessToken = `${grantType} ${accessToken}`
                        saveTokenToLocalStorage('accessToken', newAccessToken)
                        saveTokenToLocalStorage('refreshToken', refreshToken)

                        // instance 헤더에 새로운 accessToken 탑재
                        config.headers.Authorization = newAccessToken

                        // 기존 요청 다시 보냄
                        return await axios(config)
                    }
                } catch (error) {
                    console.log('refresh token error')
                }
            }
            return Promise.reject(error)
        }
    )
    return instance
}
```

### Server

```java
@PostMapping("/reissue")
public ResponseEntity<?> reissue(@Validated @RequestBody UserRequestDto.Reissue reissue, Errors errors) {
	// validation check
	if (errors.hasErrors()) {
		return response.invalidFields(RefineHelper.refineErrors(errors));
	}
	return usersService.reissue(reissue);
}
```

```java
public ResponseEntity<?> reissue(UserRequestDto.Reissue reissue) {

	log.info("getAccessToken {}", reissue.getAccessToken());
	log.info("getRefreshToken {}", reissue.getRefreshToken());


	// 1. Refresh Token 검증
	if (!jwtTokenProvider.validateToken(reissue.getRefreshToken())) {
		return response.fail("Refresh Token 정보가 유효하지 않습니다.", HttpStatus.BAD_REQUEST);
	}

	// 2. Access Token 에서 User email 을 가져온다.
	Authentication authentication = jwtTokenProvider.getAuthentication(reissue.getAccessToken());

	// 3. Redis에서 User email 을 기반으로 저장된 Refresh Token 값을 가져온다.
	String refreshToken = (String) redisTemplate.opsForValue().get("RT:" + authentication.getName());

	// 로그아웃되어 Redis에 RefreshToekn이 존재하지 않는 경우 처리
	if (ObjectUtils.isEmpty(refreshToken)) {
		return response.fail("잘못된 요청입니다.", HttpStatus.BAD_REQUEST);
	}
	log.info("Redis RefreshToken {}", refreshToken);
	// refreshToken -> Redis에 존재하는 토큰
	System.out.println(refreshToken);
	// getRefreshToken -> 프론트에서 전달한 현재 refreshToken
	if (!refreshToken.equals(reissue.getRefreshToken())) {
		return response.fail("Refresh Token 정보가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
	}

	// 4. 새로운 토큰 생성
	UserResponseDto.TokenInfo tokenInfo = jwtTokenProvider.generateToken(authentication);

	// 5. RefreshToken Redis 업데이트
	redisTemplate.opsForValue()
	.set("RT:" + authentication.getName(), tokenInfo.getRefreshToken(), tokenInfo.getRefreshTokenExpirationTime(), TimeUnit.MILLISECONDS);

	return response.success(tokenInfo, "Token 정보가 갱신되었습니다.", HttpStatus.OK);
}
```

![refresh-res](/public/img/jwt/refresh-res.png){:width="600px"}

## 발생했던 이슈들

### CORS

```java
@Slf4j
@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class WebSecurityConfig {

	private final JwtTokenProvider jwtTokenProvider;
	private final RedisTemplate<String, Object> redisTemplate;
	private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
	private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    	log.info("================> filterChain <=====================");
        http
				.httpBasic(HttpBasicConfigurer::disable)
                .csrf(CsrfConfigurer::disable)
                .sessionManagement(management -> management
                		.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(handling -> handling
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler))
                .authorizeHttpRequests(authorize -> authorize
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                		.requestMatchers(ControllerConstant.DATA_USER + "/**").permitAll()
                		.requestMatchers(ControllerConstant.DATA_AUTH + "/**").permitAll()
                		.requestMatchers(ControllerConstant.DATA_SYSTEM + "/**").permitAll()
                        // .requestMatchers(ControllerConstant.DATA_CDSS + "/**").permitAll()
						.requestMatchers(ControllerConstant.DATA_CDSS + "/**").authenticated()
                		.requestMatchers("/article/**", "/recommend/**", "/comment/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, redisTemplate), UsernamePasswordAuthenticationFilter.class);

    	return http.build();
    }

	// add cors filter
	@Bean
	@Order(Ordered.HIGHEST_PRECEDENCE)
	public CorsFilter corsFilter() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
		configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
		configuration.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);

		return new CorsFilter(source);
	}

}

```

```java
requestMatchers(ControllerConstant.DATA_CDSS + "/**").permitAll()
```

를

```java
requestMatchers(ControllerConstant.DATA_CDSS + "/**").authenticated()
```

로 변경했더니 CORS 에러가 발생.<br>
<br>

`OPTIONS` method 에서는 인증 절차를 거치지 않는 것이 맞는데,<br>
`authenticated()`를 사용하니까 `/cdss` 뒤로 따라붙는 API 요청에 대해서는 `OPTIONS` 메서드까지 인증을 필요로 하게 된 것.<br>
<br>
그래서 `OPTIONS` 요청에 대해서는 `permitAll()` 설정을 추가<br>
<br>
`permitAll()`과 `authenticated()`는 Spring Security에서 HTTP 요청에 대한 접근 권한을 설정할 때 사용하는 메서드다. <br>
각각의 메서드는 다음과 같은 차이점을 가진다. <br>
<br>

#### permitAll()

<br>

`permitAll()`은 지정된 경로로의 모든 요청을 허용한다. 즉, 인증(로그인) 여부와 관계없이 <br>
모든 사용자가 해당 경로에 접근할 수 있다.<br>
이 설정은 일반적으로 공개적으로 접근 가능해야 하는 자원 (예: 홈페이지, 로그인 페이지, 공개 API 등)에 사용된다. <br>
예: `.requestMatchers("/public/\*\*").permitAll()`은 "/public" 경로 하위의 모든 요청을 누구나 접근할 수 있도록 설정한다. <br>

#### authenticated()

<br>

`authenticated()`는 인증된(로그인한) 사용자만이 지정된 경로에 접근할 수 있도록 한다.<br>
인증되지 않은 사용자가 이 경로에 접근하려고 할 경우, 보통 로그인 페이지로 리디렉션되거나 401 Unauthorized 에러가 발생한다.<br>
예: `.requestMatchers("/private/**").authenticated()`는 "/private" 경로 하위의 모든 요청을 인증된 사용자만이 접근할 수 있도록 설정한다.<br>
따라서, `.requestMatchers(ControllerConstant.DATA_SYSTEM + "/**").permitAll()`는 DATA_SYSTEM 경로 하위의 모든 요청을 누구나 접근할 수 있도록 설정하는 반면, <br>
`.requestMatchers(ControllerConstant.DATA_CDSS + "/\*\*").authenticated()`는 DATA_CDSS 경로 하위의 모든 요청을 인증된 사용자만이 접근할 수 있도록 설정하는 것을 의미한다.<br>
