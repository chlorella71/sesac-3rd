package com.sesac.itall.domain.subscription;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.member.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "subscriber_id")
    private Member subscriber;

    @ManyToOne
    @JoinColumn(name = "blog_id")
    private Blog blog;

    @Column(nullable = false)
    private LocalDateTime subscriptionDate;

    @Column(nullable = false)
    private boolean active = true;

    @PrePersist
    public void prePersist() {
        this.subscriptionDate = LocalDateTime.now();
    }
}