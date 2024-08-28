package com.worlabel.global.cache;

public class CacheKey {
    public static String authenticationKey(int memberId) { return "authentication:" + memberId;}
}
