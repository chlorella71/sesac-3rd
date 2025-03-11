package com.sesac.itall.domain.notification;

import com.sesac.itall.domain.member.Member;
import com.sesac.itall.domain.post.Post;
import com.sesac.itall.domain.subscription.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final SubscriptionService subscriptionService;

    @Override
    @Transactional
    public void createPostNotifications(Post post) {
        // 초안이면 알림 생성 안 함
        if (post.isDraft()) {
            return;
        }

        // 블로그 구독자들 조회
        List<Member> subscribers = subscriptionService.getSubscribersByBlog(post.getBlog().getId());

        // 각 구독자에게 알림 생성
        for (Member subscriber : subscribers) {
            Notification notification = Notification.builder()
                    .member(subscriber)
                    .post(post)
                    .message(post.getBlog().getTitle() + "에 새 글 '" + post.getTitle() + "'이 등록되었습니다.")
                    .build();

            notificationRepository.save(notification);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getUnreadNotifications(String memberEmail) {
        return notificationRepository.findByMemberEmailAndReadIsFalseOrderByCreatedAtDesc(memberEmail)
                .stream()
                .map(NotificationResponseDTO::new)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponseDTO> getAllNotifications(String memberEmail) {
        return notificationRepository.findByMemberEmailOrderByCreatedAtDesc(memberEmail)
                .stream()
                .map(NotificationResponseDTO::new)
                .toList();
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("알림을 찾을 수 없습니다."));

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String memberEmail) {
        notificationRepository.markAllAsRead(memberEmail);
    }
}