/**
 * 폴더 관련 모달 렌더링 기능
 */
import { createElement, validateForm } from "../../utils/dom.js";
import { getBlogIdFromURL } from "./renderer.js";

/**
 * 폴더 생성 폼을 렌더링하는 함수
 * @param {HTMLElement} container - 내용을 넣을 컨테이너
 * @param {Object} data - 카테고리 정보 (categoryId 등)
 */
export function renderFolderCreateForm(container, data) {
    container.innerHTML = '';

    // 데이터 검증
    if (!data || !data.categoryId) {
        container.innerHTML = '<p class="text-danger">카테고리 정보가 올바르지 않습니다.</p>';
        return;
    }

    const blogId = getBlogIdFromURL();
    const categoryId = data.categoryId;

    // 폼 생성
    const form = createElement('form', {
        id: 'folderCreateForm',
        method: 'post',
        action: `/blog/${blogId}/category/${categoryId}/folder/create`
    });

    // CSRF 토큰 추가
    addCsrfTokenToForm(form);

    // 카테고리 ID 히든 필드
    const categoryIdInput = createElement('input', {
        type: 'hidden',
        name: 'categoryId',
        value: categoryId
    });
    form.appendChild(categoryIdInput);

    // 폴더 이름 입력 필드
    form.appendChild(createFolderNameField('folderName'));

    // 버튼 그룹
    form.appendChild(createButtonGroup('생성'));

    // 폼 제출 이벤트 핸들러
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 유효성 검사
        if (!validateForm(this)) {
            return;
        }

        // 폼 데이터 수집
        const formData = new FormData(this);
        const folderData = {
            name: formData.get('name'),
            categoryId: formData.get('categoryId')
        };

        // 폼 제출 이벤트 발생
        const event = new CustomEvent('folderFormSubmit', {
            detail: { categoryId, folderData }
        });
        document.dispatchEvent(event);
    });

    container.appendChild(form);
}

/**
 * 폴더 수정 폼을 렌더링하는 함수
 * @param {HTMLElement} container - 내용을 넣을 컨테이너
 * @param {Object} data - 폴더 정보 (folderId, folderName 등)
 */
export function renderFolderEditForm(container, data) {
    container.innerHTML = '';

    // 데이터 검증
    if (!data || !data.folderId) {
        container.innerHTML = '<p class="text-danger">폴더 정보가 올바르지 않습니다.</p>';
        return;
    }

    const folderId = data.folderId;
    const folderName = data.folderName || '';

    // 폼 생성
    const form = createElement('form', {
        id: 'folderEditForm',
        className: 'folder-edit-form'
    });

    // CSRF 토큰 추가
    addCsrfTokenToForm(form);

    // 폴더 이름 입력 필드 (초기값 설정)
    const nameField = createFolderNameField('editFolderName');
    nameField.querySelector('input').value = folderName;
    form.appendChild(nameField);

    // 버튼 그룹 (저장 버튼에 폴더 ID 데이터 속성 추가)
    const buttonGroup = createButtonGroup('저장', true);
    const saveButton = buttonGroup.querySelector('.btn-primary');
    saveButton.classList.add('save-folder');
    saveButton.dataset.folderId = folderId;

    form.appendChild(buttonGroup);

    container.appendChild(form);
}

/**
 * 폴더 이름 입력 필드 생성 헬퍼 함수
 * @param {string} id - 입력 필드 ID
 * @returns {HTMLElement} 폼 그룹 요소
 */
function createFolderNameField(id) {
    const formGroup = createElement('div', { className: 'mb-3' });

    const label = createElement('label', {
        htmlFor: id,
        className: 'form-label'
    }, '폴더 이름');
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
    }, '폴더 이름을 입력해주세요.');
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