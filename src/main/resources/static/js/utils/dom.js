/**
 * DOM 관련 유틸리티 함수 모음
 */

/**
 * URL에서 블로그 ID 추출
 * @returns {string} 블로그 ID 또는 빈 문자열
 */
export function getBlogIdFromURL() {
    const path = window.location.pathname;
    const match = path.match(/\/blog\/(\d+)/);

    if (match && match[1]) {
        return match[1];
    }

    console.error('블로그 ID를 URL에서 찾을 수 없습니다.');
    return '';
}

/**
 * 폼 유효성 검사
 * @param {HTMLFormElement} form - 검사할 폼 요소
 * @returns {boolean} 유효성 여부
 */
export function validateForm(form) {
    let isValid = true;

    // 필수 입력 필드 검사
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    return isValid;
}

/**
 * HTML 요소 생성 헬퍼 함수
 * @param {string} tag - 태그 이름
 * @param {Object} attributes - 속성 객체
 * @param {string|Node|Array} children - 자식 요소 또는 텍스트
 * @returns {HTMLElement} 생성된 HTML 요소
 */
export function createElement(tag, attributes = {}, children = null) {
    const element = document.createElement(tag);

    // 속성 설정
    for (const [key, value] of Object.entries(attributes)) {
        if (key === 'className') {
            // class 속성은 특별 처리
            if (Array.isArray(value)) {
                element.classList.add(...value);
            } else {
                element.className = value;
            }
        } else if (key === 'dataset') {
            // data-* 속성은 dataset으로 처리
            for (const [dataKey, dataValue] of Object.entries(value)) {
                element.dataset[dataKey] = dataValue;
            }
        } else {
            // 일반 속성
            element[key] = value;
        }
    }

    // 자식 요소 추가
    if (children) {
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (child instanceof Node) {
                    element.appendChild(child);
                } else {
                    element.appendChild(document.createTextNode(String(child)));
                }
            });
        } else if (children instanceof Node) {
            element.appendChild(children);
        } else {
            element.textContent = String(children);
        }
    }

    return element;
}