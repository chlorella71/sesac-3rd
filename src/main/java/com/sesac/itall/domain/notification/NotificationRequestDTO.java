package com.sesac.itall.domain.notification;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequestDTO {

    private Long memberId;
    private Long postId;
    private String message;
}