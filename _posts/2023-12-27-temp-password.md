---
layout: post
title: (리액트 - 스프링 부트) 임시 비밀번호 발급 (메일 전송)
date: 2023-12-27 10:00:00 +0900
category: Security
published: true
---

```java
private final Response response;
private final MailService.PasswordResetService passwordResetService;

@PostMapping("/newpassword")
    public ResponseEntity<?> resetPassword(@RequestBody UserRequestDto.PasswordResetRequest request, Errors errors) {
        if (errors.hasErrors()) {
            return response.invalidFields(RefineHelper.refineErrors(errors));
        }
        try {
            String resetPassword = passwordResetService.resetPassword(request.getEmail());
            if (resetPassword.equals("ERROR")) {
                return response.fail("메일 전송에 실패했습니다." , HttpStatus.BAD_REQUEST);
            }
            return response.success("Temporary password has been sent to your email.");
        } catch (Exception e) {
            return response.fail("Error occurred: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
```

`/newpassword` 경로로 API 요청이 올 경우에, `MailService`의 `PasswordResetService`를 호출해요.

```java
@Service
public class PasswordResetService {

    private final MailService mailService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private UsersService usersService;

    public PasswordResetService(MailService mailService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.mailService = mailService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String resetPassword(String userEmail) {

        // 1. 임시 비밀번호 생성
        String tempPassword = generateTempPassword();
        // 2. 사용자 계정에 임시 비밀번호 업데이트
        usersService.updateUserPassword(userEmail, tempPassword);

        // 3. 메일 내용 준비
        MailForm mailForm = new MailForm();
        mailForm.setAddress(userEmail);
        mailForm.setTitle("Your Temporary Password");
        mailForm.setMessage("Your temporary password is: " + tempPassword);

        String mailSendResult = mailService.mailSend(mailForm);
        if ("ERROR".equals(mailSendResult)) {
            return "ERROR"; // 메일 전송 실패
        }
        return "Mail sent successfully"; // 메일 전송 성공
    }


    public String generateTempPassword() {
        char[] charSet = new char[] { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F',
                'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' };

        String str = "";

        // 문자 배열 길이의 값을 랜덤으로 10개를 뽑아 구문을 작성함
        int idx = 0;
        for (int i = 0; i < 10; i++) {
            idx = (int) (charSet.length * Math.random());
            str += charSet[idx];
        }
        return str;
    }
}

```

`generateTempPassword`를 이용해 무작위 string 배열의 임시비밀번호를 생성하고, <br>
user의 password를 임시비밀번호로 update해요.<br>
`MailForm`에 주소, 제목, 내용 (임시비밀번호 포함)을 set 하고 메일을 전송해요.

```java
public String mailSend(MailForm mailform) {
		try {
			MimeMessagePreparator message = mimeMessage -> {
				MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
				String[] toAddress = mailform.getAddress().split(",");
				helper.setTo(toAddress);
				helper.setFrom(FROM_ADDRESS);
				helper.setSubject(mailform.getTitle());
				helper.setText(mailform.getMessage(), true);
			};

			mailSender.send(message);
			return "SUCCESS"; // 메일 전송 성공
		} catch (Exception e) {
			log.error("Error occurred while sending mail: " + e.getMessage());
			return "ERROR"; // 메일 전송 실패
		}
	}
```
