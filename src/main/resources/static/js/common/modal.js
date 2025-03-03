/**
 * 모달 관련 공통 기능을 제공하는 모듈
 */

/**
 * 모달을 열어주는 함수
 * @param {string} modalId - 모달 요소의 ID
 * @param {string} title - 모달 제목 (선택적)
 * @returns {HTMLElement|null} - 열린 모달 요소 또는 null
 */
export function openModal(modalId, title = null) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`모달 ID '${modalId}'를 찾을 수 없습니다.`);
        return null;
    }

    // 제목 변경 (제공된 경우)
    if (title) {
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = title;
        }
    }

    // 모달 표시
    modal.style.display = 'block';
    return modal;
}

/**
 * 모달을 닫는 함수
 * @param {HTMLElement} modal - 모달 요소
 */
export function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * 모달 내용 초기화 함수
 * @param {HTMLElement} modal - 모달 요소
 * @param {string} content - 설정할 내용 HTML (선택적)
 * @returns {HTMLElement|null} - 모달 내용 요소 또는 null
 */
export function clearModalContent(modal, content = '') {
    const modalContent = modal.querySelector('.modal-content-body');
    if (modalContent) {
        modalContent.innerHTML = content;
        return modalContent;
    }
    return null;
}

/**
 * 로딩 표시 함수
 * @param {HTMLElement} container - 로딩을 표시할 컨테이너
 */
export function showLoading(container) {
    container.innerHTML = '<p class="loading">데이터를 불러오는 중...</p>';
}

/**
 * 오류 메시지 표시 함수
 * @param {HTMLElement} container - 오류를 표시할 컨테이너
 * @param {string} message - 오류 메시지
 */
export function showError(container, message) {
    container.innerHTML = `<p class="error">${message}</p>`;
}

/**
 * 모달 이벤트 핸들러 초기화 함수
 * 모든 모달에 대한 닫기 기능 추가
 */
export function initializeModalEvents() {
    // 모든 모달 닫기 버튼에 이벤트 추가
    document.querySelectorAll('.modal .close').forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            closeModal(this.closest('.modal'));
        });
    });

    // 모달 바깥 클릭 시 닫기
    window.addEventListener('click', (event) => {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    // ESC 키 누르면 모달 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal);
                }
            });
        }
    });
}