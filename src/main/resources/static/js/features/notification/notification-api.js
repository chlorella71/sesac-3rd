/**
 * 알림 관련 API 호출 모듈
 */
import { callApi } from "../../common/api.js";

/**
 * 읽지 않은 알림 목록 조회 API
 * @returns {Promise} - 알림 목록 Promise
 */
export function getUnreadNotifications() {
    return callApi('/api/notifications/unread');
}


/**
 * 모든 알림 목록 조회 API
 * @returns {Promise} - 알림 목록 Promise
 */
export function getAllNotifications() {
    console.log('모든 알림 API 호출');
    return callApi('/api/notifications/all');
}

/**
 * 모든 알림 읽음으로 표시 API
 * @returns {Promise} - 처리 결과 Promise
 */
export function markAllNotificationsAsRead() {
    return callApi('/api/notifications/read-all', { method: 'POST' });
}

/**
 * 특정 알림 읽음으로 표시 API
 * @param {number} notificationId - 알림 ID
 * @returns {Promise} - 처리 결과 Promise
 */
export function markNotificationAsRead(notificationId) {
    return callApi(`/api/notifications/read/${notificationId}`, { method: 'POST' });
}