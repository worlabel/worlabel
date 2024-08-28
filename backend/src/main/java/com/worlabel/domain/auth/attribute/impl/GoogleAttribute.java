package com.worlabel.domain.auth.attribute.impl;

import ch.qos.logback.core.util.StringUtil;
import com.worlabel.domain.auth.attribute.OAuth2Attribute;
import org.springframework.util.StringUtils;

import java.util.Map;

public class GoogleAttribute extends OAuth2Attribute {

    public GoogleAttribute(Map<String,Object> attributes) {
        super(attributes);
    }

    @Override
    public String getId() {
        return super.getAttributes().get("sub").toString();
    }

    @Override
    public String getName() {
        return super.getAttributes().get("name").toString();
    }

    @Override
    public String getEmail() {
        return super.getAttributes().get("email").toString();
    }

    @Override
    public String getProfileImage() {
        return super.getAttributes().get("picture").toString();
    }
}
