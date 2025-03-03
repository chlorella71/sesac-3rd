/**
 * 카테고리 관련 기능을 처리하는 모듈
 */
import { openModal, closeModal, clearModalContent } from "../../common/modal.js";
import { addCsrfToHeaders } from "../../common/csrf.js";
import { renderCategoryEditForm } from "../modals/renderer.js";
import { getBlogIdFromURL } from "../../utils/dom.js";
import { toggleFolderList } from "./folder.js";

/**
 * 카테고리 관련 이벤트 핸들러 초기화 함수
 */
export function initializeCategoryHandlers() {
    // 카테고리 수정 버튼 이벤트 처리
    document.querySelectorAll('.edit-category').forEach(button => {
        button.addEventListener('click', handleCategoryEdit);
    });

    // 카테고리 삭제 버튼 이벤트 처리
    document.querySelectorAll('.delete-category').forEach(button => {
        button.addEventListener('click', handleCategoryDelete);
    });

    // 저장 버튼 클릭 이벤트 위임 처리
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('save-category')) {
            const categoryId = e.target.dataset.categoryId;
            updateCategory(categoryId);
        }
    });

    // 카테고리 클릭 시 폴더 목록 토글 기능
    document.querySelectorAll('.list-group-item a').forEach(categoryLink => {
        categoryLink.addEventListener('click', handleCategoryClick);
    });
}

/**
 * 카테고리 수정 버튼 클릭 이벤트 핸들러
 */
function handleCategoryEdit() {
    const button = this;
    const blogId = button.dataset.blogId;    // 블로그 ID 추출
    const categoryId = this.dataset.categoryId;
    const categoryName = this.dataset.categoryName;

    if (!categoryId) {
        console.error('카테고리 ID가 없습니다.');
        return;
    }

    // 모달 열기
    const modal = document.getElementById('editCategoryModal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content-body');
        if (modalContent) {
            modalContent.innerHTML = '';
            renderCategoryEditForm(modalContent, {
                categoryId: categoryId,
                categoryName: categoryName
            });
        }
        modal.style.display = 'block';
    }
}

/**
 * 카테고리 삭제 버튼 클릭 이벤트 핸들러
 */
function handleCategoryDelete() {
    const categoryId = this.dataset.categoryId;
    const categoryName = this.dataset.categoryName;

    if (!categoryId) {
        console.error('카테고리 ID가 없습니다.');
        return;
    }

    if (confirm(`"${categoryName}" 카테고리를 정말 삭제하시겠습니까?`)) {
        deleteCategory(categoryId);
    }
}

/**
 * 카테고리 링크 클릭 이벤트 핸들러
 * @param {Event} e - 이벤트 객체
 */
function handleCategoryClick(e) {
    e.preventDefault();

    // 해당 카테고리의 ID 찾기
    const categoryItem = this.closest('.list-group-item');
    if (!categoryItem) return;

    const categoryId = categoryItem.dataset.categoryId;
    if (!categoryId) return;

    // 폴더 목록 토글
    toggleFolderList(categoryId);
}

/**
 * 카테고리 업데이트 함수
 * @param {string} categoryId - 카테고리 ID
 */
function updateCategory(categoryId) {
    const nameInput = document.getElementById('editCategoryName');
    const newName = nameInput.value.trim();

    if (!newName) {
        nameInput.classList.add('is-invalid');
        return;
    }

    // 저장 버튼 상태 업데이트
    const saveButton = document.querySelector('.save-category');
    updateButtonState(saveButton, '저장 중...');

    // API 호출
    sendCategoryUpdateRequest(categoryId, newName)
        .then(handleCategoryUpdateResponse)
        .catch(handleCategoryUpdateError)
        .finally(() => {
            // 버튼 상태 복원
            updateButtonState(saveButton, '저장', false);
        });
}

/**
 * 카테고리 업데이트 API 요청 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {string} newName - 새 카테고리 이름
 * @returns {Promise} Fetch 요청 Promise
 */
function sendCategoryUpdateRequest(categoryId, newName) {
    const blogId = getBlogIdFromURL();

    return fetch(`/blog/${blogId}/category/${categoryId}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...addCsrfToHeaders()
        },
        body: JSON.stringify({ name: newName })
    })
    .then(response => response.json());
}

/**
 * 카테고리 업데이트 응답 처리 함수
 * @param {Object} data - 응답 데이터
 */
function handleCategoryUpdateResponse(data) {
    if (data.success) {
        const categoryId = document.querySelector('.save-category').dataset.categoryId;
        const newName = document.getElementById('editCategoryName').value.trim();

        // UI 업데이트
        updateCategoryUI(categoryId, newName);

        // 모달 닫기
        const modal = document.getElementById('editCategoryModal');
        if (modal) {
            modal.style.display = 'none';
        }
    } else {
        // 실패 시 오류 메시지
        alert(data.message || '카테고리 수정 중 오류가 발생했습니다.');
    }
}

/**
 * 카테고리 UI 업데이트 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {string} newName - 새 카테고리 이름
 */
function updateCategoryUI(categoryId, newName) {
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
 * 카테고리 업데이트 오류 처리 함수
 * @param {Error} error - 오류 객체
 */
function handleCategoryUpdateError(error) {
    console.error('Error:', error);
    alert('카테고리 수정 중 오류가 발생했습니다.');
}

/**
 * 버튼 상태 업데이트 함수
 * @param {HTMLElement} button - 버튼 요소
 * @param {string} text - 버튼 텍스트
 * @param {boolean} disabled - 비활성화 여부
 */
function updateButtonState(button, text, disabled = true) {
    if (!button) return;

    button.textContent = text;
    button.disabled = disabled;
}

/**
 * 카테고리 삭제 함수
 * @param {string} categoryId - 카테고리 ID
 */
export function deleteCategory(categoryId) {
    const blogId = getBlogIdFromURL();

    fetch(`/blog/${blogId}/category/${categoryId}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...addCsrfToHeaders()
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 성공적으로 삭제된 경우 UI에서 카테고리 요소 제거
            removeCategoryFromUI(categoryId);
        } else {
            alert(data.message || '카테고리 삭제 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('카테고리 삭제 중 오류가 발생했습니다.');
    });
}

/**
 * UI에서 카테고리 제거 함수
 * @param {string} categoryId - 카테고리 ID
 */
function removeCategoryFromUI(categoryId) {
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