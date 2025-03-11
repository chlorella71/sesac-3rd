package com.sesac.itall.domain.subscription;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    /**
     * 활성화된 구독 정보 조회
     */
    Optional<Subscription> findBySubscriberAndBlogAndActiveIsTrue(Member subscriber, Blog blog);

    /**
     * 구독 정보 조회 (활성화 여부 무관)
     */
    Optional<Subscription> findBySubscriberAndBlog(Member subscriber, Blog blog);

    /**
     * 블로그별 활성화된 구독 목록 조회
     */
    List<Subscription> findAllByBlogAndActiveIsTrue(Blog blog);

    /**
     * 회원별 활성화된 구독 목록 조회
     */
    List<Subscription> findAllBySubscriberAndActiveIsTrue(Member subscriber);
}