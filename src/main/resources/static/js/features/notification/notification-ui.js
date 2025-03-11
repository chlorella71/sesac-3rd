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

    if (!notificationList || !notificationBadge || !emptyNotification) {
        console.warn('알림 UI 요소를 찾을 수 없습니다.');
        return;
    }

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
        const markReadItem = document.getElementById('markAllAsRead');
        if (!markReadItem) {
            console.warn('markAllAsRead 요소를 찾을 수 없습니다.');
            return;
        }

        const markReadParent = markReadItem.parentElement;
        if (!markReadParent) {
            console.warn('markAllAsRead의 부모 요소를 찾을 수 없습니다.');
            return;
        }

        // 알림 목록에 추가
        notifications.forEach(notification => {
            const notificationItem = document.createElement('li');
            notificationItem.className = 'notification-item';

            // 알림 항목 내용 생성
            const safeTitle = escapeHtml(notification.message || notification.title || '새 알림');
            const safeContent = escapeHtml(notification.content || '');
            const safeDate = notification.createdAt || notification.formattedCreatedAt || '';

            // 링크 생성 (postId가 있는 경우 해당 포스트로, 없으면 '#'으로 설정)
            const href = notification.postId ? `/blog/${notification.blogId}/post/${notification.postId}` : '#';

            notificationItem.innerHTML = `
                <a class="dropdown-item" href="${href}" data-notification-id="${notification.id}">
                    <div>
                        <strong>${safeTitle}</strong>
                        <small class="text-muted d-block">${safeDate}</small>
                    </div>
                    <p class="mb-0 small text-truncate">${safeContent}</p>
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

//            // 모두 읽음 항목 이전에 삽입
//            notificationList.insertBefore(notificationItem, markReadItem);
            // 실제 삽입 위치를 HTML 구조에 맞게 선택 (디버깅을 위해 여러 방법 시도)
            try {
                // 방법 1: markReadItem 앞에 삽입 (기존 코드)
                notificationList.insertBefore(notificationItem, markReadItem.parentElement);
                console.log('알림 항목 삽입 방법 1 성공');
            } catch (e1) {
                console.error('방법 1 실패:', e1);
                try {
                    // 방법 2: emptyNotification 요소 앞에 삽입
                    const emptyItem = document.getElementById('emptyNotification');
                    if (emptyItem && emptyItem.parentElement) {
                        notificationList.insertBefore(notificationItem, emptyItem.parentElement);
                        console.log('알림 항목 삽입 방법 2 성공');
                    } else {
                        // 방법 3: 그냥 목록에 추가
                        notificationList.appendChild(notificationItem);
                        console.log('알림 항목 삽입 방법 3 성공');
                    }
                } catch (e2) {
                    console.error('모든 방법 실패:', e2);
                }
            }
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
    const loadingSpinner = document.getElementById('notificationLoadingSpinner');


    if (notificationBadge) {
        notificationBadge.style.display = 'none';
    }

    if (emptyNotification) {
        emptyNotification.style.display = 'block';
    }

    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    } else {
        // 로딩 스피너가 없다면 생성
        createLoadingSpinner();
    }
}

/**
 * 알림 로딩 상태 표시 함수
 * @param {boolean} isLoading - 로딩 중 여부
 */
export function setNotificationLoading(isLoading) {
    let loadingSpinner = document.getElementById('notificationLoadingSpinner');

    // 로딩 스피너가 없다면 생성
    if (!loadingSpinner) {
        loadingSpinner = createLoadingSpinner();
    }


    if (loadingSpinner) {
        loadingSpinner.style.display = isLoading ? 'block' : 'none';
    }

    const emptyNotification = document.getElementById('emptyNotification');
    if (emptyNotification && isLoading) {
        emptyNotification.style.display = 'none';
    }
}

/**
 * 로딩 스피너 생성 함수
 * @returns {HTMLElement} 생성된 로딩 스피너 요소
 */
function createLoadingSpinner() {
    const notificationList = document.getElementById('notificationList');
    if (!notificationList) return null;

    const loadingItem = document.createElement('li');
    loadingItem.id = 'notificationLoadingSpinner';
    loadingItem.className = 'dropdown-item text-center';
    loadingItem.innerHTML = `
        <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">로딩 중...</span>
        </div>
        <span class="ms-2">알림을 불러오는 중...</span>
    `;
    loadingItem.style.display = 'none';

    // 리스트의 첫 번째 자식으로 추가
    notificationList.prepend(loadingItem);

    return loadingItem;
}

// 개발용: 전역 스코프에 함수 노출
if (typeof window !== 'undefined') {
  window.testUpdateNotificationUI = updateNotificationUI;
}