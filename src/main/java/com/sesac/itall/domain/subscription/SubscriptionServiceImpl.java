package com.sesac.itall.domain.subscription;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogService;
import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final MemberService memberService;
    private final BlogService blogService;

    @Override
    @Transactional
    public Subscription subscribe(Long blogId, String subscriberEmail) {
        Member subscriber = memberService.getMemberByEmail(subscriberEmail);
        Blog blog = blogService.getBlogById(blogId);

        // 이미 구독 중인지 확인
        if (subscriptionRepository.findBySubscriberAndBlogAndActiveIsTrue(subscriber, blog).isPresent()) {
            throw new IllegalStateException("이미 구독 중인 블로그입니다.");
        }

        Subscription subscription = Subscription.builder()
                .subscriber(subscriber)
                .blog(blog)
                .active(true)
                .build();

        return subscriptionRepository.save(subscription);
    }

    @Override
    @Transactional
    public void unsubscribe(Long blogId, String subscriberEmail) {
        Member subscriber = memberService.getMemberByEmail(subscriberEmail);
        Blog blog = blogService.getBlogById(blogId);

        Subscription subscription = subscriptionRepository.findBySubscriberAndBlogAndActiveIsTrue(subscriber, blog)
                .orElseThrow(() -> new DataNotFoundException("구독 정보를 찾을 수 없습니다."));

        subscription.setActive(false);
        subscriptionRepository.save(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionResponseDTO> getSubscriptionsByMember(String email) {
        Member subscriber = memberService.getMemberByEmail(email);
        List<Subscription> subscriptions = subscriptionRepository.findBySubscriberAndActiveIsTrue(subscriber);

        return subscriptions.stream()
                .map(SubscriptionResponseDTO::new)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Member> getSubscribersByBlog(Long blogId) {
        Blog blog = blogService.getBlogById(blogId);
        return subscriptionRepository.findSubscribersByBlogAndActiveIsTrue(blog);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isSubscribed(Long blogId, String email) {
        try {
            Member subscriber = memberService.getMemberByEmail(email);
            Blog blog = blogService.getBlogById(blogId);
            return subscriptionRepository.findBySubscriberAndBlogAndActiveIsTrue(subscriber, blog).isPresent();
        } catch (Exception e) {
            return false;
        }
    }
}