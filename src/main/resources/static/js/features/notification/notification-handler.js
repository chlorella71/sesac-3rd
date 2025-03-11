// notification-handler.js (이벤트 핸들러)
import { fetchNotifications, markAllNotificationsAsRead } from './notification-api.js';
import { updateNotificationUI, initializeNotificationUI, setNotificationLoading } from './notification-ui.js';

/**
 * 알림 관련 이벤트 핸들러 초기화
 */
export function initializeNotificationHandlers() {
    // 알림 UI 초기화
    initializeNotificationUI();

    // 알림 드롭다운 토글 버튼
    const notificationToggle = document.getElementById('notificationDropdown');
    if (notificationToggle) {
        notificationToggle.addEventListener('click', handleNotificationToggle);
    }

    // 모두 읽음 버튼
    const markAllAsReadBtn = document.getElementById('markAllAsRead');
    if (markAllAsReadBtn) {
        markAllAsReadBtn.addEventListener('click', handleMarkAllAsRead);
    }
}

/**
 * 알림 토글 버튼 클릭 이벤트 핸들러
 * @param {Event} e - 이벤트 객체
 */
function handleNotificationToggle(e) {
    // 알림 데이터 로드
    loadNotifications();
}

/**
 * 모두 읽음 버튼 클릭 이벤트 핸들러
 * @param {Event} e - 이벤트 객체
 */
function handleMarkAllAsRead(e) {
    e.preventDefault();

    // 로딩 상태 표시
    setNotificationLoading(true);

    // API 호출
    markAllNotificationsAsRead()
        .then(() => {
            // 알림 데이터 다시 로드
            loadNotifications();
        })
        .catch(error => {
            console.error('알림 모두 읽음 처리 오류:', error);
            setNotificationLoading(false);
        });
}

/**
 * 알림 데이터 로드 함수
 */
function loadNotifications() {
    // 로딩 상태 표시
    setNotificationLoading(true);

    // API 호출
    fetchNotifications()
        .then(data => {
            if (data.success) {
                // UI 업데이트
                updateNotificationUI(data.notifications);
            } else {
                console.error('알림 로드 실패:', data.message);
            }
        })
        .catch(error => {
            console.error('알림 로드 오류:', error);
        })
        .finally(() => {
            // 로딩 상태 해제
            setNotificationLoading(false);
        });
}