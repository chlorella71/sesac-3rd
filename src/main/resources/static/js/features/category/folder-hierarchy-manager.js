/**
 * 폴더 계층 구조 관리자
 * 분리된 모듈들을 통합하여 폴더 계층 구조 관리 기능 제공
 * 파일 경로: /static/js/features/category/folder-hierarchy-manager.js
 */

import { initializeFolderHierarchy, loadFolderHierarchy } from "./folder-hierarchy-core.js";
import { initializeFolderModals } from "./folder-modal-handler.js";
import { createFolder, deleteFolder, updateFolder } from "./folder-api.js";
import { handleFolderClick, addFolderToUI, removeFolderFromUI } from "./folder-ui-handler.js";
import { loadFolderPostsList, loadFolderPostsContent, addSidebarPostStyles } from "../post/post-folder-view.js";

/**
 * 폴더 관련 기능 초기화 함수
 */
export function initializeFolderManager() {
    // 폴더 계층 구조 초기화
    initializeFolderHierarchy();

    // 폴더 모달 이벤트 초기화
    initializeFolderModals();

    // 폴더 삭제 이벤트 위임
    setupFolderDeleteHandlers();

    // 폴더 편집 이벤트 위임
    setupFolderEditHandlers();

    // 카테고리 클릭 이벤트 위임 - 폴더 목록 토글
    setupCategoryClickHandlers();
}

/**
 * 폴더 삭제 버튼 이벤트 핸들러 설정
 */
function setupFolderDeleteHandlers() {
    document.addEventListener('click', function(e) {
        const deleteButton = e.target.closest('.delete-folder');
        if (!deleteButton) return;

        const folderId = deleteButton.dataset.folderId;
        const folderName = deleteButton.dataset.folderName;

        if (!folderId) {
            console.error('폴더 ID가 없습니다.');
            return;
        }

        // 확인 대화상자
        if (confirm(`"${folderName}" 폴더를 삭제하시겠습니까?\n하위 폴더가 있는 경우 함께 삭제됩니다.`)) {
            deleteFolder(
                folderId,
                // 성공 콜백 - UI는 deleteFolder 내부에서 업데이트
                () => {
                    console.log('폴더가 성공적으로 삭제되었습니다.');
                },
                // 실패 콜백
                (errorMessage) => {
                    alert('폴더 삭제 중 오류가 발생했습니다: ' + errorMessage);
                }
            );
        }
    });
}

/**
 * 폴더 편집 버튼 이벤트 핸들러 설정
 */
function setupFolderEditHandlers() {
    document.addEventListener('click', function(e) {
        const editButton = e.target.closest('.edit-folder');
        if (!editButton) return;

        const folderId = editButton.dataset.folderId;
        const folderName = editButton.dataset.folderName;

        if (!folderId) {
            console.error('폴더 ID가 없습니다.');
            return;
        }

        // 편집 모달 열기
        openFolderEditModal(folderId, folderName);
    });
}

/**
 * 카테고리 클릭 이벤트 핸들러 설정 - 폴더 목록 토글
 */
function setupCategoryClickHandlers() {
    document.addEventListener('click', function(e) {
        const categoryLink = e.target.closest('.category-link');
        if (!categoryLink) return;

        e.preventDefault();

        const categoryItem = categoryLink.closest('.list-group-item');
        if (!categoryItem) return;

        const categoryId = categoryItem.dataset.categoryId;
        if (!categoryId) return;

        toggleFolderList(categoryId);
    });
}

/**
 * 폴더 편집 모달 열기
 * @param {string} folderId - 폴더 ID
 * @param {string} folderName - 현재 폴더 이름
 */
function openFolderEditModal(folderId, folderName) {
    const modal = document.getElementById('editFolderModal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = '폴더 수정';
    }

    const modalContent = modal.querySelector('.modal-content-body');
    if (!modalContent) return;

    modalContent.innerHTML = '';

    // 폼 생성
    const form = document.createElement('form');
    form.id = 'folderEditForm';
    form.className = 'folder-edit-form';

    // 폴더 이름 입력 필드
    const formGroup = document.createElement('div');
    formGroup.className = 'mb-3';

    const label = document.createElement('label');
    label.htmlFor = 'editFolderName';
    label.className = 'form-label';
    label.textContent = '폴더 이름';
    formGroup.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.id = 'editFolderName';
    input.name = 'name';
    input.value = folderName;
    input.required = true;
    formGroup.appendChild(input);

    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = '폴더 이름을 입력해주세요.';
    formGroup.appendChild(feedback);

    form.appendChild(formGroup);

    // 버튼 그룹
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'modal-buttons';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'btn btn-secondary modal-close';
    cancelButton.textContent = '취소';
    cancelButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    buttonGroup.appendChild(cancelButton);

    const saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.className = 'btn btn-primary save-folder';
    saveButton.textContent = '저장';
    saveButton.dataset.folderId = folderId;
    buttonGroup.appendChild(saveButton);

    form.appendChild(buttonGroup);
    modalContent.appendChild(form);

    // 모달 표시
    modal.style.display = 'block';
}

/**
 * 폴더 목록 토글 및 필요시 데이터 로드
 * @param {string} categoryId - 카테고리 ID
 */
export function toggleFolderList(categoryId) {
    const folderList = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
    if (!folderList) return;

    // 토글 상태 변경
    const isCollapsed = folderList.style.display === 'none';

    // 펼치는 경우 (현재 숨겨져 있음)
    if (isCollapsed) {
        // 폴더 목록이 비어있고 처음 펼치는 경우만 데이터 로드
        if (folderList.children.length === 0 || folderList.dataset.loaded !== 'true') {
            loadFolderHierarchy(categoryId);
        }
        folderList.style.display = 'block';
    } else {
        // 접는 경우
        folderList.style.display = 'none';
    }
}

// 모듈 내보내기
export {
    createFolder,
    deleteFolder,
    updateFolder,
    loadFolderHierarchy,
    handleFolderClick,
    addFolderToUI,
    removeFolderFromUI,
    loadFolderPostsList,
    loadFolderPostsContent
};