package com.sesac.itall.domain.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * 읽지 않은 알림 목록 조회
     */
    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getUnreadNotifications(Principal principal) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<NotificationResponseDTO> notifications =
                    notificationService.getUnreadNotifications(principal.getName());

            response.put("success", true);
            response.put("notifications", notifications);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "알림을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 모든 알림 목록 조회
     */
    @GetMapping("/all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getAllNotifications(Principal principal) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<NotificationResponseDTO> notifications =
                    notificationService.getAllNotifications(principal.getName());

            response.put("success", true);
            response.put("notifications", notifications);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "알림을 불러오는데 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 특정 알림 읽음 표시
     */
    @PostMapping("/read/{notificationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> markAsRead(
            @PathVariable Long notificationId, Principal principal) {
        Map<String, Object> response = new HashMap<>();
        try {
            notificationService.markAsRead(notificationId);

            response.put("success", true);
            response.put("message", "알림을 읽음으로 표시했습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "알림 읽음 처리에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 모든 알림 읽음 표시
     */
    @PostMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> markAllAsRead(Principal principal) {
        Map<String, Object> response = new HashMap<>();
        try {
            notificationService.markAllAsRead(principal.getName());

            response.put("success", true);
            response.put("message", "모든 알림을 읽음으로 표시했습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "알림 읽음 처리에 실패했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}