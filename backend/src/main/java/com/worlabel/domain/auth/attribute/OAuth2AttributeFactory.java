package com.worlabel.domain.auth.attribute;

import com.worlabel.domain.auth.attribute.impl.GoogleAttribute;
import com.worlabel.domain.auth.entity.ProviderType;

import java.util.Map;

public class OAuth2AttributeFactory {
    public static OAuth2Attribute parseAttribute(ProviderType provider, Map<String, Object> attributes){
        OAuth2Attribute oAuth2Attribute = null;
        switch (provider) {
            case GOOGLE :
                oAuth2Attribute = new GoogleAttribute(attributes);
                break;
            default:
                throw new RuntimeException("지원하지 않는 소셜 로그인입니다.");
        };
        return oAuth2Attribute;
    }
}
