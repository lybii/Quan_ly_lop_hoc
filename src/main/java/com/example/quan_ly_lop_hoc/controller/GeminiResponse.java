package com.example.quan_ly_lop_hoc.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GeminiResponse {
    private Candidate[] candidates;
    private GeminiFunctionCall functionCall;
    private String content;

    // Constructor
    public GeminiResponse() {}

    public GeminiResponse(String content) {
        this.content = content;
    }

    // Inner class để ánh xạ mảng candidates
    @JsonIgnoreProperties(ignoreUnknown = true) // Thêm annotation này
    public static class Candidate {
        private Content content;
        private String finishReason;
        private int index;
        private SafetyRating[] safetyRatings;

        // Getters và setters
        public Content getContent() { return content; }
        public void setContent(Content content) { this.content = content; }
        public String getFinishReason() { return finishReason; }
        public void setFinishReason(String finishReason) { this.finishReason = finishReason; }
        public int getIndex() { return index; }
        public void setIndex(int index) { this.index = index; }
        public SafetyRating[] getSafetyRatings() { return safetyRatings; }
        public void setSafetyRatings(SafetyRating[] safetyRatings) { this.safetyRatings = safetyRatings; }
    }

    // Inner class để ánh xạ content
    public static class Content {
        private Part[] parts;
        private String role;

        // Getters và setters
        public Part[] getParts() { return parts; }
        public void setParts(Part[] parts) { this.parts = parts; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }

    // Inner class để ánh xạ parts
    public static class Part {
        private String text;

        // Getters và setters
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }

    // Inner class để ánh xạ safetyRatings (tùy chọn, có thể bỏ nếu không cần)
    public static class SafetyRating {
        private String category;
        private String probability;

        // Getters và setters
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getProbability() { return probability; }
        public void setProbability(String probability) { this.probability = probability; }
    }

    // Getters và setters cho candidates
    public Candidate[] getCandidates() { return candidates; }
    public void setCandidates(Candidate[] candidates) { this.candidates = candidates; }

    public GeminiFunctionCall getFunctionCall() { return functionCall; }
    public void setFunctionCall(GeminiFunctionCall functionCall) { this.functionCall = functionCall; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}