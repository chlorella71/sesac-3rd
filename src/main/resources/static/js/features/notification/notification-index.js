// notification-index.js (진입점)
import { initializeNotificationHandlers } from './notification-handler.js';

/**
 * 알림 기능 초기화 함수
 */
export function initializeNotifications() {
    // 알림 이벤트 핸들러 초기화
    initializeNotificationHandlers();

    console.log('알림 기능 초기화 완료');
}

// 자동 초기화
document.addEventListener('DOMContentLoaded', initializeNotifications);