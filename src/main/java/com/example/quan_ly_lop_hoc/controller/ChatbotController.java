package com.example.quan_ly_lop_hoc.controller;

import com.example.quan_ly_lop_hoc.entity.Assignment;
import com.example.quan_ly_lop_hoc.entity.Lecture;
import com.example.quan_ly_lop_hoc.entity.Notifications;
import com.example.quan_ly_lop_hoc.entity.Submission;
import com.example.quan_ly_lop_hoc.entity.UserNotification;
import com.example.quan_ly_lop_hoc.repository.AssignmentRepository;
import com.example.quan_ly_lop_hoc.repository.LectureRepository;
import com.example.quan_ly_lop_hoc.repository.NotificationRepository;
import com.example.quan_ly_lop_hoc.repository.SubmissionRepository;
import com.example.quan_ly_lop_hoc.repository.UserNotificationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserNotificationRepository userNotificationRepository;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.api-url}")
    private String apiUrl;

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @PostMapping("/chat")
    public ChatResponse processChat(@RequestBody ChatRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        String message = request.getMessage().toLowerCase().trim();
        logger.info("Processing message: '{}' for user: {}", message, userEmail);

        try {
            if (message.contains("bài tập") || message.contains("assignment")) {
                String time = message.contains("tuần") || message.contains("week") ? "week" : null;
                List<Map<String, String>> assignments = getUpcomingAssignments(userEmail, time);
                return new ChatResponse("text", objectMapper.writeValueAsString(new HashMap<String, Object>() {{
                    put("assignments", assignments);
                }}));
            } else if (message.contains("lịch học") || message.contains("lecture")) {
                List<Map<String, String>> lectures = getTodayLectures(userEmail);
                return new ChatResponse("text", objectMapper.writeValueAsString(new HashMap<String, Object>() {{
                    put("lectures", lectures);
                }}));
            } else if (message.contains("thông báo") || message.contains("notification")) {
                List<Map<String, String>> notifications = getLatestNotifications(userEmail);
                return new ChatResponse("text", objectMapper.writeValueAsString(new HashMap<String, Object>() {{
                    put("notifications", notifications);
                }}));
            } else if (message.contains("điểm") || message.contains("grade")) {
                String assignmentTitle = extractAssignmentTitle(message);
                if (assignmentTitle != null) {
                    String grade = getAssignmentGrade(userEmail, assignmentTitle);
                    return new ChatResponse("text", objectMapper.writeValueAsString(new HashMap<String, String>() {{
                        put("grade", grade);
                    }}));
                }
            }
            // Gọi Gemini API cho các câu hỏi khác
            GeminiResponse geminiResponse = callGeminiApi(message);
            String text = geminiResponse.getContent() != null ? geminiResponse.getContent() : "Xin lỗi, tôi chưa hiểu câu hỏi!";
            return new ChatResponse("text", text);
        } catch (Exception e) {
            logger.error("Error processing chat request: {}", e.getMessage(), e);
            return new ChatResponse("error", "{\"error\": \"Lỗi hệ thống: " + e.getMessage() + "\"}");
        }
    }

    private GeminiResponse callGeminiApi(String message) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");

        // Tạo prompt
        String prompt = String.format(
                "Bạn là chatbot học tập trả lời bằng tiếng Việt. Người dùng yêu cầu: \"%s\". Trả lời ngắn gọn, chính xác, bằng tiếng Việt, không cần định dạng JSON.",
                message
        );

        // Tạo payload JSON bằng ObjectMapper
        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", List.of(
            new HashMap<String, Object>() {{
                put("role", "user");
                put("parts", List.of(
                    new HashMap<String, String>() {{
                        put("text", prompt);
                    }}
                ));
            }}
        ));
        payload.put("generationConfig", new HashMap<String, String>() {{
            put("responseMimeType", "text/plain");
        }});

        try {
            String requestBody = objectMapper.writeValueAsString(payload);
            logger.debug("Sending request to Gemini API: {}", requestBody);

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl + "?key=" + apiKey,
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            logger.debug("Gemini API Response: {}", response.getBody());

            GeminiResponse geminiResponse = objectMapper.readValue(response.getBody(), GeminiResponse.class);
            if (geminiResponse.getCandidates() != null && geminiResponse.getCandidates().length > 0) {
                String text = geminiResponse.getCandidates()[0].getContent().getParts()[0].getText();
                geminiResponse.setContent(text);
            }
            return geminiResponse;
        } catch (Exception e) {
            logger.error("Error calling Gemini API: {}", e.getMessage(), e);
            return new GeminiResponse("Có lỗi khi xử lý phản hồi từ Gemini: " + e.getMessage());
        }
    }

    private List<Map<String, String>> getUpcomingAssignments(String userEmail, String time) {
        Date now = new Date();
        List<Assignment> assignments;
        if ("week".equalsIgnoreCase(time)) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(now);
            calendar.add(Calendar.DAY_OF_MONTH, 7);
            Date endOfWeek = calendar.getTime();
            assignments = assignmentRepository.findByClassUserEmailAndDeadlineWithinWeek(userEmail, now, endOfWeek);
        } else {
            assignments = assignmentRepository.findByClassUserEmailAndDeadlineAfter(userEmail, now);
        }

        logger.info("Found {} assignments for user: {}", assignments.size(), userEmail);
        return assignments.stream()
                .map(a -> new HashMap<String, String>() {{
                    put("title", a.getTitle());
                    put("deadline", dateFormat.format(a.getDeadline()));
                    put("class", a.getClass1() != null ? String.valueOf(a.getClass1().getId()) : "N/A");
                }})
                .collect(Collectors.toList());
    }

    private List<Map<String, String>> getTodayLectures(String userEmail) {
        Date today = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(today);
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date tomorrow = calendar.getTime();

        List<Lecture> lectures = lectureRepository.findByClassUserEmailAndStartTimeToday(userEmail, today, tomorrow);
        logger.info("Found {} lectures for user: {}", lectures.size(), userEmail);

        return lectures.stream()
                .map(l -> new HashMap<String, String>() {{
                    put("subject", l.getTitle());
                    put("time", dateFormat.format(l.getStartTime()) + " đến " + dateFormat.format(l.getEndTime()));
                    put("room", "");
                    put("class", l.getClass1() != null ? String.valueOf(l.getClass1().getId()) : "N/A");
                }})
                .collect(Collectors.toList());
    }

    private String getAssignmentGrade(String userEmail, String assignmentTitle) {
        Optional<Submission> submission = submissionRepository.findByUserEmailAndAssignmentTitle(userEmail, assignmentTitle);
        if (submission.isEmpty()) {
            return "Không tìm thấy bài nộp cho bài tập " + assignmentTitle;
        }
        return "Điểm của bạn cho bài tập " + assignmentTitle + " là: " + submission.get().getGrade();
    }

    private List<Map<String, String>> getLatestNotifications(String userEmail) {
        List<UserNotification> userNotifications = userNotificationRepository.findByUserEmail(userEmail);
        logger.info("Found {} notifications for user: {}", userNotifications.size(), userEmail);

        return userNotifications.stream()
                .map(un -> {
                    Notifications n = un.getNotification();
                    return new HashMap<String, String>() {{
                        put("title", n.getTitle());
                        put("content", n.getContent());
                        put("date", un.getTime() != null ? dateFormat.format(un.getTime()) : "N/A");
                    }};
                })
                .collect(Collectors.toList());
    }

    private String extractAssignmentTitle(String message) {
        String[] words = message.split("\\s+");
        StringBuilder title = new StringBuilder();
        boolean foundAssignment = false;
        for (String word : words) {
            if (word.equalsIgnoreCase("bài") || word.equalsIgnoreCase("tập") || word.equalsIgnoreCase("assignment")) {
                foundAssignment = true;
                continue;
            }
            if (foundAssignment) {
                title.append(word).append(" ");
            }
        }
        String result = title.toString().trim();
        return result.isEmpty() ? null : result;
    }
}