package com.worlabel.domain.auth.controller;

import com.worlabel.global.annotation.CurrentUser;
import com.worlabel.global.response.SuccessResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    // TODO: 리이슈 처리
    @GetMapping("/")
    public String login() {
        return "로그인 성공";
    }

    @GetMapping("/user-info")
    public SuccessResponse<Integer> getMemberInfo(@CurrentUser Integer currentMember){
        return SuccessResponse.of(currentMember);
    }
}
