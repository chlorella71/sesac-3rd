/**
 * HTML 문자열 이스케이프 처리 유틸리티
 * XSS 공격 방지를 위한 HTML 특수 문자 변환 함수
 * @param {string} unsafe - 이스케이프 처리할 문자열
 * @returns {string} 이스케이프 처리된 안전한 문자열
 */
export function escapeHtml(unsafe) {
    if (!unsafe) return '';

    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * HTML 태그를 제거하는 함수
 * @param {string} html - HTML 태그가 포함된 문자열
 * @returns {string} HTML 태그가 제거된 순수 텍스트
 */
export function stripHtml(html) {
    if (!html) return '';

    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
}

/**
 * 문자열 길이 제한 함수
 * @param {string} text - 원본 문자열
 * @param {number} maxLength - 최대 길이
 * @param {string} suffix - 생략 표시 문자열 (기본값: '...')
 * @returns {string} 길이가 제한된 문자열
 */
export function truncateText(text, maxLength, suffix = '...') {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    return text.substring(0, maxLength) + suffix;
}