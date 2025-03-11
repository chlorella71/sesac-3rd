/**
 * 포스트 관련 API 호출 모듈
 */
import { callApi, getBlogApiBaseUrl } from "../common/api.js";

/**
 * 초안 발행 API
 * @param {string} postId - 포스트 ID
 * @returns {Promise} 발행 결과 Promise
 */
export function publishDraft(postId) {
    const endpoint = `${getBlogApiBaseUrl()}/post/${postId}/publish`;
    return callApi(endpoint, { method: 'POST' });
}

/**
 * 초안 목록 조회 API
 * @returns {Promise} 초안 목록 Promise
 */
export function getDraftPosts() {
    const endpoint = `${getBlogApiBaseUrl()}/drafts`;
    return callApi(endpoint);
}