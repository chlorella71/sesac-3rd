package com.sesac.itall.domain.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    /**
     * 특정 회원의 읽지 않은 알림 조회 (최신순)
     */
    List<Notification> findByMemberEmailAndReadIsFalseOrderByCreatedAtDesc(String memberEmail);

    /**
     * 특정 회원의 모든 알림 조회 (최신순)
     */
    List<Notification> findByMemberEmailOrderByCreatedAtDesc(String memberEmail);

    /**
     * 특정 회원의 모든 알림을 읽음 처리
     */
    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.read = true WHERE n.member.email = :memberEmail")
    void markAllAsRead(String memberEmail);
}