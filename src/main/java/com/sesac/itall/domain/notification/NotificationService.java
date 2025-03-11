package com.sesac.itall.domain.notification;

import com.sesac.itall.domain.post.Post;

import java.util.List;

public interface NotificationService {

    /**
     * 새로운 게시글이 등록될 때 알림을 생성하는 메서드
     * @param post 게시글 객체
     */
    void createPostNotifications(Post post);

    /**
     * 특정 사용자의 읽지 않은 알림을 조회하는 메서드
     * @param memberEmail 사용자 이메일
     * @return 읽지 않은 알림 목록
     */
    List<NotificationResponseDTO> getUnreadNotifications(String memberEmail);

    /**
     * 특정 사용자의 모든 알림을 조회하는 메서드
     * @param memberEmail 사용자 이메일
     * @return 모든 알림 목록
     */
    List<NotificationResponseDTO> getAllNotifications(String memberEmail);

    /**
     * 특정 알림을 읽음 처리하는 메서드
     * @param notificationId 알림 ID
     */
    void markAsRead(Long notificationId);

    /**
     * 특정 사용자의 모든 알림을 읽음 처리하는 메서드
     * @param memberEmail 사용자 이메일
     */
    void markAllAsRead(String memberEmail);
}