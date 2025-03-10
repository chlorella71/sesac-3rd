/**
 * 폴더카테고리 UI 관련 모듈
 * 폴더카테고리 렌더링 및 DOM 조작 기능을 담당합니다.
 */
import { createElement } from "../../utils/dom.js";

/**
 * 카테고리 UI 업데이트 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {string} newName - 새 카테고리 이름
 */
export function updateCategoryUI(categoryId, newName) {
    // 편집/삭제 버튼의 data-category-name 속성 업데이트
    document.querySelectorAll(`.delete-category[data-category-id="${categoryId}"]`).forEach(btn => {
        btn.dataset.categoryName = newName;
    });

    document.querySelectorAll(`.edit-category[data-category-id="${categoryId}"]`).forEach(btn => {
        btn.dataset.categoryName = newName;
    });

    // 리스트 아이템의 내부 텍스트 업데이트
    const listItems = document.querySelectorAll(`.list-group-item[data-category-id="${categoryId}"]`);
    listItems.forEach(item => {
        const link = item.querySelector('a');
        if (link) {
            link.textContent = newName;
        }
    });
}

/**
 * UI에서 카테고리 제거 함수
 * @param {string} categoryId - 카테고리 ID
 */
export function removeCategoryFromUI(categoryId) {
    const categoryItem = document.querySelector(`.list-group-item[data-category-id="${categoryId}"]`);
    if (categoryItem) {
        categoryItem.remove();
    }

    // 카테고리가 모두 삭제된 경우 메시지 표시
    const categoryList = document.querySelector('.list-group');
    if (categoryList && categoryList.children.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'list-group-item';
        emptyMessage.innerHTML = '<span class="text-muted">카테고리가 없습니다.</span>';
        categoryList.appendChild(emptyMessage);
    }
}

/**
 * 폴더 목록 토글 및 필요시 AJAX로 데이터 로드
 * @param {string} categoryId - 카테고리 ID
 * @param {Function} loadFoldersCallback - 폴더 로드 콜백 함수
 */
export function toggleFolderList(categoryId, loadFoldersCallback) {
    const folderList = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
    if (!folderList) return;

    // 토글 상태 변경
    const isCollapsed = folderList.style.display === 'none';

    // 펼치는 경우 (현재 숨겨져 있음)
    if (isCollapsed) {
        // 폴더 목록이 비어있고 처음 펼치는 경우만 데이터 로드
        if (folderList.children.length === 0 || folderList.dataset.loaded !== 'true') {
            loadFoldersCallback(categoryId);
        }
        folderList.style.display = 'block';
    } else {
        // 접는 경우
        folderList.style.display = 'none';
    }
}

/**
 * 카테고리 편집 폼 렌더링 함수
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
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    if (csrfToken) {
        const csrfInput = createElement('input', {
            type: 'hidden',
            name: '_csrf',
            value: csrfToken.content
        });
        form.appendChild(csrfInput);
    }

    // 카테고리 이름 입력 필드 (초기값 설정)
    const nameFormGroup = createElement('div', { className: 'mb-3' });
    const nameLabel = createElement('label', {
        htmlFor: 'editCategoryName',
        className: 'form-label'
    }, '카테고리 이름');
    nameFormGroup.appendChild(nameLabel);

    const nameInput = createElement('input', {
        type: 'text',
        className: 'form-control',
        id: 'editCategoryName',
        name: 'name',
        value: categoryName,
        required: true
    });
    nameFormGroup.appendChild(nameInput);

    const feedback = createElement('div', {
        className: 'invalid-feedback'
    }, '카테고리 이름을 입력해주세요.');
    nameFormGroup.appendChild(feedback);
    form.appendChild(nameFormGroup);

    // 버튼 그룹 (저장 버튼에 카테고리 ID 데이터 속성 추가)
    const buttonGroup = createElement('div', { className: 'modal-buttons' });

    const cancelButton = createElement('button', {
        type: 'button',
        className: 'btn btn-secondary modal-close'
    }, '취소');
    buttonGroup.appendChild(cancelButton);

    const saveButton = createElement('button', {
        type: 'button',
        className: 'btn btn-primary save-category'
    }, '저장');
    saveButton.dataset.categoryId = categoryId;
    buttonGroup.appendChild(saveButton);

    form.appendChild(buttonGroup);

    container.appendChild(form);
}

/**
 * 카테고리 생성 폼 렌더링 함수
 * @param {HTMLElement} container - 내용을 넣을 컨테이너
 * @param {Object} data - 초기 데이터 (필요한 경우)
 */
export function renderCategoryCreateForm(container, data) {
    container.innerHTML = '';

    // 블로그 ID 확인
    const blogId = data?.blogId;
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
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    if (csrfToken) {
        const csrfInput = createElement('input', {
            type: 'hidden',
            name: '_csrf',
            value: csrfToken.content
        });
        form.appendChild(csrfInput);
    }

    // 카테고리 이름 입력 필드
    const nameFormGroup = createElement('div', { className: 'mb-3' });
    const nameLabel = createElement('label', {
        htmlFor: 'categoryName',
        className: 'form-label'
    }, '카테고리 이름');
    nameFormGroup.appendChild(nameLabel);

    const nameInput = createElement('input', {
        type: 'text',
        className: 'form-control',
        id: 'categoryName',
        name: 'name',
        required: true
    });
    nameFormGroup.appendChild(nameInput);

    const feedback = createElement('div', {
        className: 'invalid-feedback'
    }, '카테고리 이름을 입력해주세요.');
    nameFormGroup.appendChild(feedback);
    form.appendChild(nameFormGroup);

    // 버튼 그룹
    const buttonGroup = createElement('div', { className: 'modal-buttons' });

    const cancelButton = createElement('button', {
        type: 'button',
        className: 'btn btn-secondary modal-close'
    }, '취소');
    buttonGroup.appendChild(cancelButton);

    const submitButton = createElement('button', {
        type: 'submit',
        className: 'btn btn-primary'
    }, '생성');
    buttonGroup.appendChild(submitButton);

    form.appendChild(buttonGroup);

    container.appendChild(form);
}