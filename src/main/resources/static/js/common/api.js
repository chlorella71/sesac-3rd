/**
 * 공통 API 모듈
 * 모든 API 호출에 대한 기본 기능을 제공합니다.
 */
import { getBlogIdFromURL } from "../utils/dom.js";
import { getCsrfInfo } from "./csrf.js";

/**
 * 공통 API 호출 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - 요청 옵션
 * @returns {Promise} API 응답 Promise
 */
export async function callApi(endpoint, options = {}) {
    // 기본 옵션 설정
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // 옵션 병합
    const mergedOptions = { ...defaultOptions, ...options };

    // CSRF 토큰 추가 (GET 메소드가 아닌 경우에만)
    if (mergedOptions.method !== 'GET') {
        const csrfInfo = getCsrfInfo();
        if (!csrfInfo) {
            return Promise.reject(new Error('인증 정보를 찾을 수 없습니다.'));
        }

        // 헤더에 CSRF 토큰 추가
        mergedOptions.headers = {
            ...mergedOptions.headers,
            [csrfInfo.header]: csrfInfo.token
        };
    }

    // body가 객체인 경우 JSON 문자열로 변환
    if (mergedOptions.body && typeof mergedOptions.body === 'object') {
        mergedOptions.body = JSON.stringify(mergedOptions.body);
    }

    try {
        const response = await fetch(endpoint, mergedOptions);

        // 응답 오류 확인
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`서버 오류 (${response.status}): ${errorText}`);
        }

        // 응답이 JSON인지 확인
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }

        // JSON이 아닌 경우 텍스트로 반환
        return await response.text();
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
    }
}

/**
 * 블로그 관련 API 호출 베이스 URL 생성
 * @param {string} blogId - 블로그 ID (없으면 URL에서 추출)
 * @returns {string} 블로그 API 베이스 URL
 */
export function getBlogApiBaseUrl(blogId = null) {
    const id = blogId || getBlogIdFromURL();
    if (!id) {
        throw new Error('블로그 ID를 찾을 수 없습니다.');
    }
    return `/blog/${id}`;
}