/**
 * 폴더 모달 핸들러
 * 파일 경로: /static/js/features/category/folder-modal-handler.js
 */

import { createElement, validateForm } from "../../utils/dom.js";
import { openModal, closeModal } from "../../common/modal.js";
import { createFolder, updateFolder } from "./folder-api.js";
import { getCsrfInfo } from "../../common/csrf.js";

/**
 * 폴더 모달 이벤트 초기화
 */
export function initializeFolderModals() {
    // 하위 폴더 생성 모달 오픈 이벤트 리스너
    document.addEventListener('openSubfolderModal', function(e) {
        const { categoryId, folderId, folderName } = e.detail;
        openSubfolderModal(categoryId, folderId, folderName);
    });

    // 폼 제출 이벤트 위임
    document.addEventListener('submit', function(e) {
        // 폴더 생성 폼 처리
        if (e.target.id === 'folderCreateForm' || e.target.id === 'subfolderCreateForm') {
            e.preventDefault();
            handleFolderFormSubmit(e.target);
        }

        // 폴더 수정 폼 처리
        if (e.target.id === 'folderEditForm') {
            e.preventDefault();
            handleFolderEditFormSubmit(e.target);
        }
    });

    // 모달 내 버튼 이벤트 위임
    document.addEventListener('click', function(e) {
        // 폴더 저장 버튼 처리
        if (e.target.classList.contains('save-folder')) {
            const folderId = e.target.dataset.folderId;
            if (folderId) {
                const nameInput = document.getElementById('editFolderName');
                if (nameInput) {
                    updateFolderName(folderId, nameInput.value.trim());
                }
            }
        }
    });
}

/**
 * 하위 폴더 생성 모달을 여는 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {string} parentFolderId - 부모 폴더 ID
 * @param {string} parentFolderName - 부모 폴더 이름
 */
function openSubfolderModal(categoryId, parentFolderId, parentFolderName) {
    const modal = document.getElementById('folderModal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = `하위 폴더 생성`;
    }

    const modalContent = modal.querySelector('.modal-content-body');
    if (!modalContent) return;

    modalContent.innerHTML = '';

    // 부모 폴더 정보 표시 영역
    const parentInfo = createElement('div', {
        className: 'alert alert-info mb-3'
    }, `상위 폴더: ${parentFolderName}`);
    modalContent.appendChild(parentInfo);

    // 폼 생성
    const form = createElement('form', {
        id: 'subfolderCreateForm',
        className: 'subfolder-create-form'
    });

    // CSRF 토큰 추가
    const csrfInfo = getCsrfInfo();
    if (csrfInfo) {
        const csrfInput = createElement('input', {
            type: 'hidden',
            name: '_csrf',
            value: csrfInfo.token
        });
        form.appendChild(csrfInput);
    }

    // 카테고리 ID 히든 필드
    const categoryIdInput = createElement('input', {
        type: 'hidden',
        name: 'categoryId',
        value: categoryId
    });
    form.appendChild(categoryIdInput);

    // 부모 폴더 ID 히든 필드
    const parentFolderIdInput = createElement('input', {
        type: 'hidden',
        id: 'parentFolderId',
        name: 'parentFolderId',
        value: parentFolderId
    });
    form.appendChild(parentFolderIdInput);

    // 폴더 이름 입력 필드
    const nameFormGroup = createElement('div', { className: 'mb-3' });
    const nameLabel = createElement('label', {
        htmlFor: 'folderName',
        className: 'form-label'
    }, '폴더 이름');
    nameFormGroup.appendChild(nameLabel);

    const nameInput = createElement('input', {
        type: 'text',
        className: 'form-control',
        id: 'folderName',
        name: 'name',
        required: true
    });
    nameFormGroup.appendChild(nameInput);

    const feedback = createElement('div', {
        className: 'invalid-feedback'
    }, '폴더 이름을 입력해주세요.');
    nameFormGroup.appendChild(feedback);
    form.appendChild(nameFormGroup);

    // 버튼 그룹
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
        type: 'submit',
        className: 'btn btn-primary'
    }, '생성');
    buttonGroup.appendChild(submitButton);
    form.appendChild(buttonGroup);

    modalContent.appendChild(form);
    modal.style.display = 'block';
}

/**
 * 폴더 생성 폼 제출 처리
 * @param {HTMLFormElement} form - 폼 요소
 */
function handleFolderFormSubmit(form) {
    // 유효성 검사
    if (!validateForm(form)) {
        return;
    }

    // 폼 데이터 수집
    const formData = new FormData(form);
    const categoryId = formData.get('categoryId');
    const folderData = {
        name: formData.get('name'),
        parentFolderId: formData.get('parentFolderId') || null
    };

    // 저장 버튼 상태 업데이트
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.textContent = '생성 중...';
        submitButton.disabled = true;

        // 폴더 생성 API 호출
        createFolder(
            categoryId,
            folderData,
            // 성공 콜백
            (folder) => {
                // 모달 닫기
                const modal = form.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            },
            // 실패 콜백
            (errorMessage) => {
                alert(errorMessage);
                // 버튼 상태 복원
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        );
    } else {
        // 버튼이 없는 경우 직접 API 호출
        createFolder(categoryId, folderData);
    }
}

/**
 * 폴더 수정 폼 제출 처리
 * @param {HTMLFormElement} form - 폼 요소
 */
function handleFolderEditFormSubmit(form) {
    // 유효성 검사
    if (!validateForm(form)) {
        return;
    }

    // 폼 데이터 수집
    const nameInput = form.querySelector('#editFolderName');
    const newName = nameInput.value.trim();
    const folderId = form.querySelector('.save-folder').dataset.folderId;

    if (!folderId) {
        alert('폴더 ID가 없습니다.');
        return;
    }

    // 저장 버튼 상태 업데이트
    const saveButton = form.querySelector('.save-folder');
    if (saveButton) {
        const originalText = saveButton.textContent;
        saveButton.textContent = '저장 중...';
        saveButton.disabled = true;

        // 폴더 수정 API 호출
        updateFolder(
            folderId,
            newName,
            // 성공 콜백
            (folder) => {
                // UI 업데이트
                updateFolderUI(folderId, folder);

                // 모달 닫기
                const modal = form.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            },
            // 실패 콜백
            (errorMessage) => {
                alert(errorMessage);
                // 버튼 상태 복원
                saveButton.textContent = originalText;
                saveButton.disabled = false;
            }
        );
    }
}

/**
 * 폴더 이름 업데이트 처리
 * @param {string} folderId - 폴더 ID
 * @param {string} newName - 새 폴더 이름
 */
function updateFolderName(folderId, newName) {
    if (!newName) {
        const nameInput = document.getElementById('editFolderName');
        if (nameInput) {
            nameInput.classList.add('is-invalid');
        }
        return;
    }

    // 저장 버튼 상태 업데이트
    const saveButton = document.querySelector('.save-folder');
    if (saveButton) {
        const originalText = saveButton.textContent;
        saveButton.textContent = '저장 중...';
        saveButton.disabled = true;

        // 폴더 수정 API 호출
        updateFolder(
            folderId,
            newName,
            // 성공 콜백
            (folder) => {
                // UI 업데이트
                updateFolderUI(folderId, folder);

                // 모달 닫기
                const modal = document.getElementById('editFolderModal');
                if (modal) {
                    modal.style.display = 'none';
                }
            },
            // 실패 콜백
            (errorMessage) => {
                alert(errorMessage);
                // 버튼 상태 복원
                saveButton.textContent = originalText;
                saveButton.disabled = false;
            }
        );
    } else {
        // 버튼이 없는 경우 직접 API 호출
        updateFolder(folderId, newName);
    }
}

/**
 * UI 내 폴더 정보 업데이트
 * @param {string} folderId - 폴더 ID
 * @param {Object} updatedFolder - 업데이트된 폴더 정보
 */
function updateFolderUI(folderId, updatedFolder) {
    const folderItem = document.querySelector(`.folder-item[data-folder-id="${folderId}"]`);
    if (!folderItem) return;

    // 폴더 이름 업데이트
    const folderLink = folderItem.querySelector('.folder-name');
    if (folderLink) {
        const folderIcon = folderLink.querySelector('i');
        const iconHtml = folderIcon ? folderIcon.outerHTML : '<i class="bi bi-folder me-1"></i>';
        folderLink.innerHTML = `${iconHtml} ${updatedFolder.name}`;
    }

    // 버튼 속성 업데이트
    const editButton = folderItem.querySelector('.edit-folder');
    if (editButton) {
        editButton.dataset.folderName = updatedFolder.name;
    }

    const deleteButton = folderItem.querySelector('.delete-folder');
    if (deleteButton) {
        deleteButton.dataset.folderName = updatedFolder.name;
    }

    const addSubfolderButton = folderItem.querySelector('.add-subfolder');
    if (addSubfolderButton) {
        addSubfolderButton.dataset.folderName = updatedFolder.name;
    }
}