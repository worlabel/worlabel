package com.worlabel.global.aspect;

import com.worlabel.domain.participant.service.ParticipantService;
import com.worlabel.global.annotation.CheckPrivilege;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class PrivilegeCheckAspect {

    private final ParticipantService participantService;

    // CheckPrivilege 어노테이션이 붙은 메서드가 실행되기전 실행
    @Before("@annotation(checkPrivilege)")
    public void checkPrivilege(JoinPoint joinPoint, CheckPrivilege checkPrivilege) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        Object[] args = joinPoint.getArgs();
        Parameter[] parameters = method.getParameters();

        Integer projectId = null ;
        Integer memberId = null ;

        for (int paramIdx = 0; paramIdx < parameters.length; paramIdx++) {
            String paramName = parameters[paramIdx].getName();
            if(paramName.equals("projectId")) {
                projectId = (Integer) args[paramIdx];
            }else if(paramName.equals("memberId")) {
                memberId = (Integer) args[paramIdx];
            }
        }

        participantService.checkPrivilegeUnauthorized(memberId, projectId, checkPrivilege.value());
    }
}
