package com.worlabel.global.cache;

public class CacheKey {
    public static String authenticationKey(int memberId) {
        return "authentication:" + memberId;
    }

    public static String trainProgressKey() {
        return "trainProgress";
    }

    public static String autoLabelingProgressKey() {
        return "autoLabelingProgress";
    }

    public static String fcmTokenKey(){
        return "fcmToken";
    }

    public static String progressStatusKey(int modelId) {
        return "progress:" + modelId;
    }
}
