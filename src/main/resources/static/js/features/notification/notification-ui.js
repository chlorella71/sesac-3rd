// notification-ui.js (렌더링 함수)
import { escapeHtml } from '../../utils/html-utils.js';
import { markNotificationAsRead } from './notification-api.js';

/**
 * 알림 UI 업데이트 함수
 * @param {Array} notifications - 알림 목록
 */
export function updateNotificationUI(notifications) {
    const notificationList = document.getElementById('notificationList');
    const notificationBadge = document.getElementById('notificationBadge');
    const emptyNotification = document.getElementById('emptyNotification');

    // 상단 구분선과 헤더 제외한 알림 항목 제거
    const items = notificationList.querySelectorAll('.notification-item');
    items.forEach(item => item.remove());

    // 알림 개수에 따라 배지 표시
    const count = notifications.length;
    if (count > 0) {
        notificationBadge.textContent = count > 99 ? '99+' : count;
        notificationBadge.style.display = 'inline-block';
        emptyNotification.style.display = 'none';

        // 알림 목록에 추가
        const markReadItem = document.getElementById('markAllAsRead').parentElement;

        notifications.forEach(notification => {
            const notificationItem = document.createElement('li');
            notificationItem.className = 'notification-item';
            notificationItem.innerHTML = `
                <a class="dropdown-item" href="${notification.url}" data-notification-id="${notification.id}">
                    <div>
                        <strong>${escapeHtml(notification.title)}</strong>
                        <small class="text-muted d-block">${notification.formattedCreatedAt}</small>
                    </div>
                    <p class="mb-0 small text-truncate">${escapeHtml(notification.content)}</p>
                </a>
            `;

            // 알림 클릭 이벤트 (읽음 처리)
            const link = notificationItem.querySelector('a');
            link.addEventListener('click', function(e) {
                const notificationId = this.dataset.notificationId;
                markNotificationAsRead(notificationId)
                    .catch(error => {
                        console.error('알림 읽음 처리 오류:', error);
                    });
            });

            // 모두 읽음 항목 이전에 삽입
            notificationList.insertBefore(notificationItem, markReadItem);
        });
    } else {
        // 알림이 없는 경우
        notificationBadge.style.display = 'none';
        emptyNotification.style.display = 'block';
    }
}

/**
 * 알림 UI 초기화 함수
 */
export function initializeNotificationUI() {
    // 알림 UI 초기 설정
    const notificationBadge = document.getElementById('notificationBadge');
    const emptyNotification = document.getElementById('emptyNotification');

    if (notificationBadge) {
        notificationBadge.style.display = 'none';
    }

    if (emptyNotification) {
        emptyNotification.style.display = 'block';
    }
}

/**
 * 알림 로딩 상태 표시 함수
 * @param {boolean} isLoading - 로딩 중 여부
 */
export function setNotificationLoading(isLoading) {
    const loadingSpinner = document.getElementById('notificationLoadingSpinner');
    if (loadingSpinner) {
        loadingSpinner.style.display = isLoading ? 'block' : 'none';
    }

    const emptyNotification = document.getElementById('emptyNotification');
    if (emptyNotification && isLoading) {
        emptyNotification.style.display = 'none';
    }
}