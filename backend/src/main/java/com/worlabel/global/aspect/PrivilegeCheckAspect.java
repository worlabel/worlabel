package com.worlabel.global.aspect;

import com.worlabel.domain.auth.entity.dto.AuthMemberDto;
import com.worlabel.domain.participant.entity.Participant;
import com.worlabel.domain.participant.entity.PrivilegeType;
import com.worlabel.domain.participant.repository.ParticipantRepository;
import com.worlabel.global.annotation.CheckPrivilege;
import com.worlabel.global.exception.CustomException;
import com.worlabel.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.lang.reflect.Parameter;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class PrivilegeCheckAspect {

    private final ParticipantRepository participantRepository;

    // CheckPrivilege 어노테이션이 붙은 메서드가 실행되기전 실행
    @Before("@annotation(checkPrivilege)")
    public void checkPrivilege(JoinPoint joinPoint, CheckPrivilege checkPrivilege) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        Object[] args = joinPoint.getArgs();
        Parameter[] parameters = method.getParameters();

        Object principal = SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();
        int memberId = ((AuthMemberDto) principal).getId();

        Integer projectId = null;
        for (int paramIdx = 0; paramIdx < parameters.length; paramIdx++) {
            String paramName = parameters[paramIdx].getName();
            if (paramName.equals("projectId")) {
                projectId = (Integer) args[paramIdx];
                break;
            }
        }

        checkPrivilegeUnauthorized(memberId, projectId, checkPrivilege.value());
    }

    public void checkPrivilegeUnauthorized(final Integer memberId, final Integer projectId, final PrivilegeType privilegeType) {
        Participant participant = participantRepository.findByMemberIdAndProjectId(memberId, projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PARTICIPANT_EDITOR_UNAUTHORIZED));

        if (!participant.getPrivilege().isAuth(privilegeType)) {
            throw new CustomException(ErrorCode.PARTICIPANT_UNAUTHORIZED);
        }
    }
}
