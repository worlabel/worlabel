package com.worlabel.fixture;

import com.worlabel.domain.member.entity.Member;

public class MemberFixture {

    public static Member makeMember() {
        return Member.of("1","email@naver.com","nickname","abc.jpg");
    }
}
