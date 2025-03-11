package com.sesac.itall.domain.subscription;

import com.sesac.itall.domain.member.Member;

import java.util.List;

public interface SubscriptionService {

    /**
     * 블로그 구독 여부 확인
     * @param email 사용자 이메일
     * @param blogId 블로그 ID
     * @return 구독 여부
     */
    boolean isSubscribed(String email, Long blogId);

    /**
     * 블로그 구독
     * @param email 구독자 이메일
     * @param blogId 구독할 블로그 ID
     * @return 구독 정보 DTO
     */
    SubscriptionResponseDTO subscribe(String email, Long blogId);

    /**
     * 블로그 구독 취소
     * @param email 구독자 이메일
     * @param blogId 구독 취소할 블로그 ID
     */
    void unsubscribe(String email, Long blogId);

    /**
     * 특정 블로그의 구독자 조회
     * @param blogId 블로그 ID
     * @return 구독자 목록
     */
    List<Member> getSubscribersByBlog(Long blogId);

    /**
     * 특정 사용자의 구독 목록 조회
     * @param email 사용자 이메일
     * @return 구독 정보 DTO 목록
     */
    List<SubscriptionResponseDTO> getSubscriptionsByMember(String email);
}