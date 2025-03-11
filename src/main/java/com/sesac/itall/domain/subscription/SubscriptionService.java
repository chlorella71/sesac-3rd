package com.sesac.itall.domain.subscription;

import com.sesac.itall.domain.member.Member;
import java.util.List;

public interface SubscriptionService {
    /**
     * 특정 블로그를 구독합니다.
     * @param blogId 블로그 ID
     * @param subscriberEmail 구독자의 이메일
     * @return 구독 정보
     */
    Subscription subscribe(Long blogId, String subscriberEmail);

    /**
     * 특정 블로그의 구독을 해지합니다.
     * @param blogId 블로그 ID
     * @param subscriberEmail 구독자의 이메일
     */
    void unsubscribe(Long blogId, String subscriberEmail);

    /**
     * 특정 회원이 구독한 블로그 목록을 조회합니다.
     * @param email 회원 이메일
     * @return 구독한 블로그 목록 (DTO 리스트)
     */
    List<SubscriptionResponseDTO> getSubscriptionsByMember(String email);

    /**
     * 특정 블로그를 구독한 회원 목록을 조회합니다.
     * @param blogId 블로그 ID
     * @return 구독자 목록
     */
    List<Member> getSubscribersByBlog(Long blogId);

    /**
     * 특정 회원이 특정 블로그를 구독 중인지 확인합니다.
     * @param blogId 블로그 ID
     * @param email 회원 이메일
     * @return 구독 여부 (true: 구독 중, false: 구독 안 함)
     */
    boolean isSubscribed(Long blogId, String email);
}
