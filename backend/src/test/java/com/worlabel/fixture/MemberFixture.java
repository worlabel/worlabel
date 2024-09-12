package com.worlabel.fixture;

import com.worlabel.domain.auth.attribute.impl.GoogleAttribute;
import com.worlabel.domain.auth.entity.ProviderType;
import com.worlabel.domain.member.entity.Member;

import java.util.HashMap;

public class MemberFixture {

    public static Member makeMember() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("sub", 1);
        map.put("name", "kts");
        map.put("email", "kimtaesoo@naver.com");
        map.put("picture", "test.jpg");
        return Member.create(new GoogleAttribute(map), ProviderType.GOOGLE);
    }

    public static Member makeMember2() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("sub", 2);
        map.put("name", "kts2");
        map.put("email", "kimtaesoo2@naver.com");
        map.put("picture", "test2.jpg");
        return Member.create(new GoogleAttribute(map), ProviderType.GOOGLE);
    }
}
