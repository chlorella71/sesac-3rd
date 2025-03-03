/**
 * CSRF 토큰 관련 기능을 제공하는 모듈
 * window 객체에 직접 할당하지 않고 함수로 캡슐화하여 보안성 향상
 */

/**
 * CSRF 토큰 정보를 가져오는 함수
 * @returns {Object|null} CSRF 토큰 정보 객체 또는 null
 */
export function getCsrfInfo() {
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]');

    if (csrfToken && csrfHeader) {
        return {
            token: csrfToken.content,
            header: csrfHeader.content
        };
    }
    return null;
}

/**
 * CSRF 헤더를 fetch 요청에 추가하는 함수
 * @param {Object} headers - 기존 헤더 객체
 * @returns {Object} CSRF 토큰이 추가된 헤더 객체
 */
export function addCsrfToHeaders(headers = {}) {
    const csrfInfo = getCsrfInfo();
    if (csrfInfo) {
        return {
            ...headers,
            [csrfInfo.header]: csrfInfo.token
        };
    }
    return headers;
}