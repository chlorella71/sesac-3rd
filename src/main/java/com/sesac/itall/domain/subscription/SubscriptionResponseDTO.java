package com.sesac.itall.domain.subscription;

import com.sesac.itall.domain.subscription.Subscription;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class SubscriptionResponseDTO {

    private final Long id;
    private final String subscriberEmail;
    private final String blogTitle;
    private final Long blogId;
    private final LocalDateTime subscriptionDate;
    private final boolean active;

    public SubscriptionResponseDTO(Subscription subscription) {
        this.id = subscription.getId();
        this.subscriberEmail = subscription.getSubscriber().getEmail();
        this.blogTitle = subscription.getBlog().getTitle();
        this.blogId = subscription.getBlog().getId();
        this.subscriptionDate = subscription.getSubscriptionDate();
        this.active = subscription.isActive();
    }
}