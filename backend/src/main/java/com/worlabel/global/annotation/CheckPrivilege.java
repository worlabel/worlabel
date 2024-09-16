package com.worlabel.global.annotation;


import com.worlabel.domain.participant.entity.PrivilegeType;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Documented
@Retention(RetentionPolicy.RUNTIME)
public @interface CheckPrivilege {
    PrivilegeType value(); // 어노테이션에 권한 타입을 배열로 받음
}
