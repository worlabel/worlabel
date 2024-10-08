package com.worlabel.global.mattermost.dto;

import com.google.gson.annotations.SerializedName;
import lombok.*;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;

public class MatterMostMessageDto {

    @Getter
    @NoArgsConstructor
    public static class Attachments {
        private Props props;
        private List<Attachment> attachments = new ArrayList<>();

        public Attachments(List<Attachment> attachments) {
            this.attachments = attachments;
        }

        public Attachments(Attachment attachment) {
            this.attachments.add(attachment);
        }

        public void addProps(Exception e) {
            this.props = new Props(e);
        }
    }

    @Getter
    @Builder
    @ToString
    @AllArgsConstructor
    public static class Attachment {
        private String channel;
        private String pretext;
        private String color;

        @SerializedName("author_name")
        private String authorName;

        @SerializedName("author_icon")
        private String authorIcon;

        private String title;
        private String text;
        private String footer;

        public Attachment addExceptionInfo(Exception e) {
            this.title = e.getClass().getSimpleName();
            this.text = appendExceptionDetails(new StringBuilder(this.text), e).toString();
            return this;
        }

        public Attachment addExceptionInfo(Exception e, String uri) {
            this.addExceptionInfo(e);
            this.text = appendUriDetails(new StringBuilder(this.text), uri).toString();
            return this;
        }

        public Attachment addExceptionInfo(Exception e, String uri, String params) {
            this.addExceptionInfo(e, uri);
            this.text = appendParamsDetails(new StringBuilder(this.text), params).toString();
            return this;
        }

        private StringBuilder appendExceptionDetails(StringBuilder sb, Exception e) {
            sb.append("**Error Message**").append("\n\n")
                    .append("```").append(e.getMessage()).append("```").append("\n\n");
            return sb;
        }

        private StringBuilder appendUriDetails(StringBuilder sb, String uri) {
            sb.append("**Request URL**").append("\n\n")
                    .append(uri).append("\n\n");
            return sb;
        }

        private StringBuilder appendParamsDetails(StringBuilder sb, String params) {
            sb.append("**Parameters**").append("\n\n")
                    .append(params).append("\n\n");
            return sb;
        }
    }

    @Getter
    @NoArgsConstructor
    public static class Props {
        private String card;

        public Props(Exception e) {
            StringWriter sw = new StringWriter();
            e.printStackTrace(new PrintWriter(sw));
            String stackTrace = sw.toString();

            this.card = new StringBuilder()
                    .append("**Stack Trace**").append("\n\n")
                    .append("```")
                    .append(stackTrace, 0, Math.min(5500, stackTrace.length()))
                    .append("\n...")
                    .append("```")
                    .toString();
        }
    }
}
