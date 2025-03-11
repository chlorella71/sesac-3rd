package com.sesac.itall.domain.notification;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class NotificationResponseDTO {

    private final Long id;
    private final String message;
    private final boolean read;
    private final LocalDateTime createdAt;
    private final Long postId;

    public NotificationResponseDTO(Notification notification) {
        this.id = notification.getId();
        this.message = notification.getMessage();
        this.read = notification.isRead();
        this.createdAt = notification.getCreatedAt();
        this.postId = notification.getPost() != null ? notification.getPost().getId() : null; // post가 null일 수도 있음
    }
}