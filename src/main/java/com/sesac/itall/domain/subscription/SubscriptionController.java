package com.sesac.itall.domain.subscription;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    /**
     * 블로그 구독 여부 확인
     */
    @GetMapping("/check/{blogId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> checkSubscription(@PathVariable("blogId") Long blogId, Principal principal) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean isSubscribed = subscriptionService.isSubscribed(principal.getName(), blogId);
            response.put("success", true);
            response.put("subscribed", isSubscribed);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "구독 상태 확인 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 블로그 구독하기
     */
    @PostMapping("/subscribe/{blogId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> subscribe(@PathVariable("blogId") Long blogId, Principal principal) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 중요: principal.getName()이 첫 번째, blogId가 두 번째 매개변수로 전달
            SubscriptionResponseDTO subscription = subscriptionService.subscribe(principal.getName(), blogId);
            response.put("success", true);
            response.put("message", "블로그를 성공적으로 구독했습니다.");
            response.put("subscription", subscription);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "구독 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 블로그 구독 취소
     */
    @PostMapping("/unsubscribe/{blogId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> unsubscribe(@PathVariable("blogId") Long blogId, Principal principal) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 중요: principal.getName()이 첫 번째, blogId가 두 번째 매개변수로 전달
            subscriptionService.unsubscribe(principal.getName(), blogId);
            response.put("success", true);
            response.put("message", "구독이 취소되었습니다.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "구독 취소 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 사용자 구독 목록 조회
     */
    @GetMapping("/list")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getSubscriptionList(Principal principal) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<SubscriptionResponseDTO> subscriptions = subscriptionService.getSubscriptionsByMember(principal.getName());
            response.put("success", true);
            response.put("subscriptions", subscriptions);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "구독 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}