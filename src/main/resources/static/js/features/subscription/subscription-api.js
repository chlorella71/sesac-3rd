/**
 * 구독 관련 API 호출 모듈
 */
import { callApi } from "../../common/api.js";

/**
 * 블로그 구독 상태 확인 API
 * @param {number} blogId - 블로그 ID
 * @returns {Promise} - 구독 상태 Promise
 */
export function checkSubscription(blogId) {
    return callApi(`/api/subscription/check/${blogId}`);
}

/**
 * 블로그 구독하기 API
 * @param {number} blogId - 블로그 ID
 * @returns {Promise} - 구독 결과 Promise
 */
export function subscribe(blogId) {
    return callApi(`/api/subscription/subscribe/${blogId}`, { method: 'POST' });
}

/**
 * 블로그 구독 취소 API
 * @param {number} blogId - 블로그 ID
 * @returns {Promise} - 구독 취소 결과 Promise
 */
export function unsubscribe(blogId) {
    return callApi(`/api/subscription/unsubscribe/${blogId}`, { method: 'POST' });
}

/**
 * 사용자의 구독 목록 조회 API
 * @returns {Promise} - 구독 목록 Promise
 */
export function getSubscriptionList() {
    console.log('구독 목록 API 호출');
    return callApi('/api/subscription/list');
}