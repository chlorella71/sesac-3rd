/**
 * 폴더카테고리 UI 관련 모듈
 * 폴더카테고리 렌더링 및 DOM 조작 기능을 담당합니다.
 */
import { createElement } from "../../utils/dom.js";

/**
 * 카테고리 항목 요소 생성 함수
 * @param {Object} category - 카테고리 데이터
 * @returns {HTMLElement} 생성된 카테고리 요소
 */
export function createCategoryItemElement(category) {
    const listItem = createElement('li', {
        className: 'list-group-item d-flex justify-content-between align-items-center'
    });
    listItem.dataset.categoryId = category.id;

    // 카테고리 이름 링크
    const link = createElement('a', {
        href: '#',
        className: 'category-name category-link'
    }, category.name);
    listItem.appendChild(link);

    // 폴더 개수 뱃지
    const badge = createElement('span', {
        className: 'badge bg-primary rounded-pill'
    }, `${category.folderCount}개 폴더`);
    listItem.appendChild(badge);

    // 액션 버튼 영역
    const actionDiv = createElement('div', {
        className: 'category-actions'
    });

    // 폴더 추가 버튼
    const addFolderButton = createElement('button', {
        type: 'button',
        className: 'btn btn-sm add-folder',
        title: '폴더 추가'
    });
    addFolderButton.dataset.categoryId = category.id;
    addFolderButton.innerHTML = '<i class="bi bi-folder-plus"></i>';
    actionDiv.appendChild(addFolderButton);

    // 카테고리 수정 버튼
    const editButton = createElement('button', {
        type: 'button',
        className: 'btn btn-sm edit-category',
        title: '카테고리 수정'
    });
    editButton.dataset.categoryId = category.id;
    editButton.dataset.categoryName = category.name;
    editButton.innerHTML = '<i class="bi bi-pencil"></i>';
    actionDiv.appendChild(editButton);

    // 카테고리 삭제 버튼
    const deleteButton = createElement('button', {
        type: 'button',
        className: 'btn btn-sm delete-category',
        title: '카테고리 삭제'
    });
    deleteButton.dataset.categoryId = category.id;
    deleteButton.dataset.categoryName = category.name;
    deleteButton.innerHTML = '<i class="bi bi-x"></i>';
    actionDiv.appendChild(deleteButton);

    listItem.appendChild(actionDiv);

    // 폴더 목록 컨테이너
    const folderListContainer = createElement('div', {
        className: 'folder-list',
        style: 'display: none;'
    });
    folderListContainer.dataset.categoryId = category.id;

    // 빈 폴더 메시지
    if (!category.folderCount || category.folderCount === 0) {
        folderListContainer.innerHTML = '<div class="py-2 text-muted small">폴더가 없습니다.</div>';
    }

    // 최종 요소 구성
    const container = createElement('div', {
        className: 'category-container'
    });
    container.appendChild(listItem);
    container.appendChild(folderListContainer);

    return container;
}

/**
 * UI에 카테고리 추가 함수
 * @param {Object} category - 카테고리 정보 객체
 */
export function addCategoryToUI(category) {
    const categoryList = document.querySelector('.category-list');
    if (!categoryList) {
        console.error('카테고리 목록 요소를 찾을 수 없습니다.');
        return;
    }

    // '카테고리가 없습니다' 메시지 제거
    const emptyMessage = categoryList.querySelector('.text-muted');
    if (emptyMessage) {
        emptyMessage.remove();
    }

    // 새 카테고리 HTML 요소 생성 및 추가
    const categoryElement = createCategoryItemElement(category);
    categoryList.appendChild(categoryElement);
}

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
    // 카테고리 컨테이너 요소 찾기
    const categoryContainer = document.querySelector(`.category-container .list-group-item[data-category-id="${categoryId}"]`).closest('.category-container');
    if (categoryContainer) {
        categoryContainer.remove();
    } else {
        // 이전 구조인 경우 단일 요소만 제거
        const categoryItem = document.querySelector(`.list-group-item[data-category-id="${categoryId}"]`);
        if (categoryItem) {
            categoryItem.remove();
        }
    }

    // 카테고리가 모두 삭제된 경우 메시지 표시
    const categoryList = document.querySelector('.category-list');
    if (categoryList && !categoryList.querySelector('.list-group-item')) {
        const emptyMessage = createElement('li', {
            className: 'list-group-item'
        }, '<span class="text-muted">카테고리가 없습니다.</span>');
        categoryList.appendChild(emptyMessage);
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
 * @returns {HTMLFormElement} 생성된 폼 요소
 */
export function renderCategoryCreateForm(container) {
    container.innerHTML = '';

    // 폼 생성
    const form = createElement('form', {
        id: 'categoryCreateForm',
        className: 'category-create-form'
    });

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
    return form;
}