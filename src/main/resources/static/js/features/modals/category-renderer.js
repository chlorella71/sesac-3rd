/**
 * 카테고리 관련 모달 렌더링 기능
 */
import { createElement, validateForm } from '../../utils/dom.js';
import { getBlogIdFromURL } from './renderer.js';

/**
 * 카테고리 생성 폼을 렌더링하는 함수
 * @param {HTMLElement} container - 내용을 넣을 컨테이너
 * @param {Object} data - 초기 데이터 (필요한 경우)
 */
export function renderCategoryCreateForm(container, data) {
    container.innerHTML = '';

    // 블로그 ID 확인
    const blogId = data?.blogId || getBlogIdFromURL();
    if (!blogId) {
        container.innerHTML = '<p class="error">블로그 정보를 찾을 수 없습니다.</p>';
        return;
    }

    // 폼 생성
    const form = createElement('form', {
        id: 'categoryCreateForm',
        method: 'post',
        action: `/blog/${blogId}/category/create`
    });

    // CSRF 토큰 추가
    addCsrfTokenToForm(form);

    // 카테고리 이름 입력 필드
    form.appendChild(createCategoryNameField('categoryName'));

    // 버튼 그룹
    form.appendChild(createButtonGroup('생성'));

    // 폼 제출 이벤트 핸들러
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 유효성 검사
        if (validateForm(this)) {
            this.submit();
        }
    });

    container.appendChild(form);
}

/**
 * 카테고리 수정 폼을 렌더링하는 함수
 * @param {HTMLElement} container - 내용을 넣을 컨테이너
 * @param {Object} data - 카테고리 정보 (id, name 등)
 */
export function renderCategoryEditForm(container, data) {
    container.innerHTML = '';

    // 데이터 검증
    if (!data || !data.categoryId) {
        container.innerHTML = '<p class="text-danger">카테고리 정보가 올바르지 않습니다.</p>';
        return;
    }

    const categoryId = data.categoryId;
    const categoryName = data.categoryName || '';

    // 폼 생성
    const form = createElement('form', {
        id: 'categoryEditForm',
        className: 'category-edit-form'
    });

    // CSRF 토큰 추가
    addCsrfTokenToForm(form);

    // 카테고리 이름 입력 필드 (초기값 설정)
    const nameField = createCategoryNameField('editCategoryName');
    nameField.querySelector('input').value = categoryName;
    form.appendChild(nameField);

    // 버튼 그룹 (저장 버튼에 카테고리 ID 데이터 속성 추가)
    const buttonGroup = createButtonGroup('저장', true);
    const saveButton = buttonGroup.querySelector('.btn-primary');
    saveButton.classList.add('save-category');
    saveButton.dataset.categoryId = categoryId;

    form.appendChild(buttonGroup);

    container.appendChild(form);
}

/**
 * 카테고리 이름 입력 필드 생성 헬퍼 함수
 * @param {string} id - 입력 필드 ID
 * @returns {HTMLElement} 폼 그룹 요소
 */
function createCategoryNameField(id) {
    const formGroup = createElement('div', { className: 'mb-3' });

    const label = createElement('label', {
        htmlFor: id,
        className: 'form-label'
    }, '카테고리 이름');
    formGroup.appendChild(label);

    const input = createElement('input', {
        type: 'text',
        className: 'form-control',
        id: id,
        name: 'name',
        required: true
    });
    formGroup.appendChild(input);

    const feedback = createElement('div', {
        className: 'invalid-feedback'
    }, '카테고리 이름을 입력해주세요.');
    formGroup.appendChild(feedback);

    return formGroup;
}

/**
 * 버튼 그룹 생성 헬퍼 함수
 * @param {string} submitText - 제출 버튼 텍스트
 * @param {boolean} isButtonType - 제출 버튼의 type을 button으로 설정할지 여부
 * @returns {HTMLElement} 버튼 그룹 요소
 */
function createButtonGroup(submitText, isButtonType = false) {
    const buttonGroup = createElement('div', { className: 'modal-buttons' });

    const cancelButton = createElement('button', {
        type: 'button',
        className: 'btn btn-secondary modal-close'
    }, '취소');
    cancelButton.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
    buttonGroup.appendChild(cancelButton);

    const submitButton = createElement('button', {
        type: isButtonType ? 'button' : 'submit',
        className: 'btn btn-primary'
    }, submitText);
    buttonGroup.appendChild(submitButton);

    return buttonGroup;
}

/**
 * CSRF 토큰을 폼에 추가하는 헬퍼 함수
 * @param {HTMLFormElement} form - CSRF 토큰을 추가할 폼
 */
function addCsrfTokenToForm(form) {
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    if (csrfToken) {
        const csrfInput = createElement('input', {
            type: 'hidden',
            name: '_csrf',
            value: csrfToken.content
        });
        form.appendChild(csrfInput);
    }
}