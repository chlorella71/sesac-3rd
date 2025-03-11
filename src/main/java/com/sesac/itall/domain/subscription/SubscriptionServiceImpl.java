package com.sesac.itall.domain.subscription;

import com.sesac.itall.domain.blog.Blog;
import com.sesac.itall.domain.blog.BlogRepository;
import com.sesac.itall.domain.common.DataNotFoundException;
import com.sesac.itall.domain.common.DuplicateResourceException;
import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionServiceImpl implements SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final MemberRepository memberRepository;
    private final BlogRepository blogRepository;

    @Override
    @Transactional(readOnly = true)
    public boolean isSubscribed(String email, Long blogId) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("사용자를 찾을 수 없습니다."));

        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataNotFoundException("블로그를 찾을 수 없습니다."));

        return subscriptionRepository.findBySubscriberAndBlogAndActiveIsTrue(member, blog).isPresent();
    }

    @Override
    @Transactional
    public SubscriptionResponseDTO subscribe(String email, Long blogId) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("사용자를 찾을 수 없습니다."));

        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataNotFoundException("블로그를 찾을 수 없습니다."));

        // 자기 자신의 블로그는 구독할 수 없음
        if (blog.getMember().equals(member)) {
            throw new IllegalArgumentException("자신의 블로그는 구독할 수 없습니다.");
        }

        // 이미 구독 중인지 확인
        if (isSubscribed(email, blogId)) {
            throw new DuplicateResourceException("이미 구독 중인 블로그입니다.");
        }

        // 이전에 구독했다가 취소한 경우, 해당 레코드를 활성화
        Subscription existingSubscription = subscriptionRepository.findBySubscriberAndBlog(member, blog)
                .orElse(null);

        if (existingSubscription != null) {
            existingSubscription.setActive(true);
            return new SubscriptionResponseDTO(subscriptionRepository.save(existingSubscription));
        }

        // 새로운 구독 생성
        Subscription subscription = Subscription.builder()
                .subscriber(member)
                .blog(blog)
                .active(true)
                .build();

        return new SubscriptionResponseDTO(subscriptionRepository.save(subscription));
    }

    @Override
    @Transactional
    public void unsubscribe(String email, Long blogId) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("사용자를 찾을 수 없습니다."));

        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataNotFoundException("블로그를 찾을 수 없습니다."));

        Subscription subscription = subscriptionRepository.findBySubscriberAndBlogAndActiveIsTrue(member, blog)
                .orElseThrow(() -> new DataNotFoundException("구독 정보를 찾을 수 없습니다."));

        // 실제로 삭제하지 않고 비활성화
        subscription.setActive(false);
        subscriptionRepository.save(subscription);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Member> getSubscribersByBlog(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new DataNotFoundException("블로그를 찾을 수 없습니다."));

        return subscriptionRepository.findAllByBlogAndActiveIsTrue(blog)
                .stream()
                .map(Subscription::getSubscriber)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubscriptionResponseDTO> getSubscriptionsByMember(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("사용자를 찾을 수 없습니다."));

        return subscriptionRepository.findAllBySubscriberAndActiveIsTrue(member)
                .stream()
                .map(SubscriptionResponseDTO::new)
                .collect(Collectors.toList());
    }
}