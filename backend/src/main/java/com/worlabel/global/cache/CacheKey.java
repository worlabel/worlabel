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

    public static String trainKey(int projectId, int modelId) {
        return "train:" + projectId + ":" + modelId;
    }

    public static String trainModelKey(int projectId) {
        return "train:" + projectId + ":*";
    }

    public static String alarmIdKey(){
        return "alarm:id";
    }

    public static String alarmMemberKey(int memberId, long alarmId) {
        return "member:" + memberId + ":alarm:" + alarmId;
    }

    public static String alarmMemberAllKey(int memberId) {
        return "member:" + memberId + ":alarm:*";
    }


}
