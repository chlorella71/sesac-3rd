package com.sesac.itall.domain.subscription;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    /**
     * 특정 사용자가 특정 블로그를 구독하고 있는지 조회
     */
    Optional<Subscription> findBySubscriberAndBlogAndActiveIsTrue(Member subscriber, Blog blog);

    /**
     * 특정 사용자의 활성화된 구독 목록 조회
     */
    List<Subscription> findBySubscriberAndActiveIsTrue(Member subscriber);

    /**
     * 특정 블로그를 구독 중인 사용자 목록 조회
     */
    List<Member> findSubscribersByBlogAndActiveIsTrue(Blog blog);
}