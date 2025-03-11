/**
 * 토스트 메시지 유틸리티
 */

/**
 * 토스트 메시지 표시 함수
 * @param {string} type - 메시지 타입 (success, error, warning, info)
 * @param {string} message - 표시할 메시지
 * @param {number} duration - 표시 시간(ms), 기본 3000ms
 */
export function showToast(type, message, duration = 3000) {
    // 기존 토스트 제거
    const existingToasts = document.querySelectorAll('.alert-floating');
    existingToasts.forEach(toast => {
        toast.remove();
    });

    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = `alert alert-floating alert-${getAlertClass(type)}`;
    toast.role = 'alert';
    toast.textContent = message;

    // 문서에 추가
    document.body.appendChild(toast);

    // 일정 시간 후 제거
    setTimeout(() => {
        toast.remove();
    }, duration);
}

/**
 * alert 타입에 따른 Bootstrap 클래스 반환
 * @param {string} type - 메시지 타입
 * @returns {string} - Bootstrap alert 클래스
 */
function getAlertClass(type) {
    switch(type) {
        case 'success': return 'success';
        case 'error': return 'danger';
        case 'warning': return 'warning';
        default: return 'info';
    }
}