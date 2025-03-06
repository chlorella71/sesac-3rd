/**
 * CSRF 토큰 관련 기능을 제공하는 모듈
 */

// 캐시된 CSRF 토큰 정보 (중복 호출 방지)
let csrfInfoCache = null;

/**
 * CSRF 토큰 정보를 가져오는 함수
 * @returns {Object|null} CSRF 토큰 정보 객체 또는 null
 */
export function getCsrfInfo() {
    // 캐시된 정보가 있으면 반환
    if (csrfInfoCache) {
        return csrfInfoCache;
    }

    // 메타 태그에서 CSRF 토큰 찾기
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]');

    if (csrfToken && csrfHeader) {
        csrfInfoCache = {
            token: csrfToken.content,
            header: csrfHeader.content
        };
        return csrfInfoCache;
    }

    // 폼 내의 CSRF 필드를 찾아보는 대체 방법
    const csrfInput = document.querySelector('input[name="_csrf"]');
    if (csrfInput) {
        // 서버에서 사용하는 기본 CSRF 헤더 이름 (Spring Security 기준)
        csrfInfoCache = {
            token: csrfInput.value,
            header: 'X-CSRF-TOKEN'  // Spring Security 기본 헤더 이름
        };
        return csrfInfoCache;
    }

    console.error('CSRF 토큰을 찾을 수 없습니다.');
    return null;
}

/**
 * CSRF 헤더를 fetch 요청에 추가하는 함수
 * @returns {Object} CSRF 토큰이 추가된 헤더 객체
 */
export function addCsrfToHeaders() {
    const csrfInfo = getCsrfInfo();
    if (csrfInfo) {
        return {
            [csrfInfo.header]: csrfInfo.token
        };
    }
    console.warn('CSRF 토큰을 헤더에 추가할 수 없습니다.');
    return {};
}

///**
// * CSRF 토큰 관련 기능을 제공하는 모듈
// * window 객체에 직접 할당하지 않고 함수로 캡슐화하여 보안성 향상
// */
//
///**
// * CSRF 토큰 정보를 가져오는 함수
// * @returns {Object|null} CSRF 토큰 정보 객체 또는 null
// */
//export function getCsrfInfo() {
//    const csrfToken = document.querySelector('meta[name="_csrf"]');
//    const csrfHeader = document.querySelector('meta[name="_csrf_header"]');
//
//    if (csrfToken && csrfHeader) {
//        return {
//            token: csrfToken.content,
//            header: csrfHeader.content
//        };
//    }
//    return null;
//}
//
///**
// * CSRF 헤더를 fetch 요청에 추가하는 함수
// * @param {Object} headers - 기존 헤더 객체
// * @returns {Object} CSRF 토큰이 추가된 헤더 객체
// */
//export function addCsrfToHeaders(headers = {}) {
//    const csrfInfo = getCsrfInfo();
//    if (csrfInfo) {
//        return {
//            ...headers,
//            [csrfInfo.header]: csrfInfo.token
//        };
//    }
//    return headers;
//}