package com.sesac.itall.domain.subscription;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SubscriptionRequestDTO {

    private Long blogId;
    private String subscriberEmail;

    public SubscriptionRequestDTO(Long blogId, String subscriberEmail) {
        this.blogId = blogId;
        this.subscriberEmail = subscriberEmail;
    }
}