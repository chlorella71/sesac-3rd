/**
 * 폴더 UI 관련 모듈
 * 폴더 렌더링 및 DOM 조작 기능을 담당합니다.
 */
import { createElement } from "../../utils/dom.js";

/**
 * 폴더 항목 HTML 요소 생성 함수
 * @param {Object} folder - 폴더 정보 객체
 * @returns {HTMLElement} 폴더 항목 요소
 */
export function createFolderItemElement(folder) {
    const folderItem = createElement('div', {
        className: 'folder-item d-flex justify-content-between align-items-center my-1'
    });
    folderItem.dataset.folderId = folder.id;

    if (folder.parentFolderId) {
        folderItem.dataset.parentId = folder.parentFolderId;
    }

    // 폴더 링크 생성
    const folderLink = createElement('a', {
        href: '#',
        className: 'folder-name'
    });

    // 폴더 아이콘 (하위 폴더가 있는 경우 다른 아이콘 사용)
    const hasChildren = folder.childFolderCount > 0;
    folderLink.innerHTML = `<i class="bi bi-folder${hasChildren ? '2' : ''} me-1"></i> ${folder.name}`;

    // 부모 폴더가 있는 경우 정보 표시
    if (folder.parentFolderName) {
        folderLink.innerHTML += `<small class="text-muted ms-1">(상위: ${folder.parentFolderName})</small>`;
    }

    folderItem.appendChild(folderLink);

    // 폴더 액션 버튼들 추가
    const actionDiv = createElement('div', {
        className: 'folder-actions'
    });

    // 하위 폴더 추가 버튼
    const addSubfolderButton = createElement('button', {
        type: 'button',
        className: 'btn btn-sm add-subfolder',
        title: '하위 폴더 추가'
    });
    addSubfolderButton.dataset.folderId = folder.id;
    addSubfolderButton.dataset.folderName = folder.name;
    addSubfolderButton.dataset.categoryId = folder.categoryId;
    addSubfolderButton.innerHTML = '<i class="bi bi-folder-plus"></i>';
    actionDiv.appendChild(addSubfolderButton);

    // 폴더 편집 버튼
    const editButton = createElement('button', {
        type: 'button',
        className: 'btn btn-sm edit-folder',
        title: '폴더 수정'
    });
    editButton.dataset.folderId = folder.id;
    editButton.dataset.folderName = folder.name;
    editButton.innerHTML = '<i class="bi bi-pencil"></i>';
    actionDiv.appendChild(editButton);

    // 폴더 삭제 버튼
    const deleteButton = createElement('button', {
        type: 'button',
        className: 'btn btn-sm delete-folder',
        title: '폴더 삭제'
    });
    deleteButton.dataset.folderId = folder.id;
    deleteButton.dataset.folderName = folder.name;
    deleteButton.innerHTML = '<i class="bi bi-x"></i>';
    actionDiv.appendChild(deleteButton);

    folderItem.appendChild(actionDiv);

    return folderItem;
}

/**
 * UI에 폴더 추가 함수 (계층 구조 지원)
 * @param {string} categoryId - 카테고리 ID
 * @param {Object} folder - 폴더 정보 객체
 */
export function addFolderToUI(categoryId, folder) {
    const folderList = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
    if (!folderList) {
        console.error('폴더 목록 요소를 찾을 수 없습니다:', categoryId);
        return;
    }

    // 폴더 표시 영역 보이게 설정
    folderList.style.display = 'block';

    // '폴더가 없습니다' 메시지 제거
    const emptyMessage = folderList.querySelector('.text-muted');
    if (emptyMessage) {
        emptyMessage.remove();
    }

    // 새 폴더 HTML 요소 생성
    const folderItem = createFolderItemElement(folder);

    // 부모 폴더가 있는 경우
    if (folder.parentFolderId) {
        // 부모 폴더의 하위 폴더 컨테이너 찾기 또는 생성
        let childContainer = folderList.querySelector(`.folder-children[data-parent-id="${folder.parentFolderId}"]`);

        if (!childContainer) {
            // 부모 폴더 요소 찾기
            const parentFolderItem = folderList.querySelector(`.folder-item[data-folder-id="${folder.parentFolderId}"]`);

            if (parentFolderItem) {
                // 하위 폴더 컨테이너 생성
                childContainer = createElement('div', {
                    className: 'folder-children ms-4'
                });
                childContainer.dataset.parentId = folder.parentFolderId;

                // 부모 폴더 뒤에 하위 폴더 컨테이너 삽입
                parentFolderItem.after(childContainer);

                // 부모 폴더 아이콘 업데이트
                const folderIcon = parentFolderItem.querySelector('.folder-name i');
                if (folderIcon) {
                    folderIcon.className = 'bi bi-folder2-open me-1';
                }
            } else {
                // 부모 폴더를 찾을 수 없는 경우 일반 목록에 추가
                folderList.appendChild(folderItem);
                return;
            }
        }

        // 하위 폴더 컨테이너에 새 폴더 추가
        childContainer.appendChild(folderItem);

        // 하위 폴더 컨테이너 표시
        childContainer.style.display = 'block';
    } else {
        // 최상위 폴더인 경우 목록에 직접 추가
        folderList.appendChild(folderItem);
    }
}

/**
 * UI에서 폴더 제거 함수 (하위 폴더 포함)
 * @param {string} folderId - 폴더 ID
 */
export function removeFolderFromUI(folderId) {
    // 폴더 요소 찾기
    const folderItem = document.querySelector(`.folder-item[data-folder-id="${folderId}"]`);
    if (!folderItem) return;

    // 하위 폴더 컨테이너 찾기
    const childContainer = document.querySelector(`.folder-children[data-parent-id="${folderId}"]`);

    // 폴더가 속한 카테고리 ID 찾기
    const folderList = folderItem.closest('.folder-list');
    const categoryId = folderList?.dataset.categoryId;

    // 하위 폴더 컨테이너가 있으면 함께 제거
    if (childContainer) {
        childContainer.remove();
    }

    // 폴더 요소 제거
    folderItem.remove();

    // 폴더 목록이 비었는지 확인
    if (categoryId && folderList && !folderList.querySelector('.folder-item')) {
        folderList.innerHTML = '<div class="py-2 text-muted small">폴더가 없습니다.</div>';
    }
}

/**
 * 폴더 정보 UI 업데이트 함수
 * @param {string} folderId - 폴더 ID
 * @param {Object} updatedFolder - 업데이트된 폴더 정보
 */
export function updateFolderInUI(folderId, updatedFolder) {
    const folderItem = document.querySelector(`.folder-item[data-folder-id="${folderId}"]`);
    if (!folderItem) return;

    // 폴더 이름 업데이트
    const folderLink = folderItem.querySelector('.folder-name');
    if (folderLink) {
        // 현재 아이콘 클래스 유지
        const iconElement = folderLink.querySelector('i');
        const iconClass = iconElement ? iconElement.className : 'bi bi-folder me-1';

        folderLink.innerHTML = `<i class="${iconClass}"></i> ${updatedFolder.name}`;
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

/**
 * 폴더 계층 구조 렌더링 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {Array} folders - 모든 폴더 목록
 */
export function renderFolderHierarchy(categoryId, folders) {
    const folderList = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
    if (!folderList) return;

    // 컨테이너 초기화
    folderList.innerHTML = '';

    // 폴더가 없는 경우
    if (!folders || folders.length === 0) {
        folderList.innerHTML = '<div class="py-2 text-muted small">폴더가 없습니다.</div>';
        return;
    }

    // 폴더 데이터를 계층 구조로 변환
    const folderMap = new Map(); // 모든 폴더를 ID로 매핑
    const rootFolders = []; // 최상위 폴더 목록

    // 먼저 모든 폴더를 맵에 저장
    folders.forEach(folder => {
        folderMap.set(folder.id, folder);
    });

    // 폴더 계층 구조 분류
    folders.forEach(folder => {
        if (folder.parentFolderId) {
            // 부모 폴더가 있는 경우 (하위 폴더)
            const parentFolder = folderMap.get(folder.parentFolderId);
            if (parentFolder) {
                // 부모 폴더의 children 배열이 없으면 생성
                if (!parentFolder.children) {
                    parentFolder.children = [];
                }
                parentFolder.children.push(folder);
            } else {
                // 부모 폴더를 찾을 수 없는 경우 최상위 폴더로 처리
                rootFolders.push(folder);
            }
        } else {
            // 부모 폴더가 없는 경우 (최상위 폴더)
            rootFolders.push(folder);
        }
    });

    // 최상위 폴더 렌더링
    rootFolders.forEach(folder => {
        // 폴더 항목 생성
        const folderItem = createFolderItemElement(folder);
        folderList.appendChild(folderItem);

        // 하위 폴더가 있는 경우 렌더링
        if (folder.children && folder.children.length > 0) {
            renderSubfolders(folderList, folder);
        }
    });
}

/**
 * 하위 폴더 렌더링 함수
 * @param {HTMLElement} container - 부모 컨테이너
 * @param {Object} parentFolder - 부모 폴더 객체
 */
function renderSubfolders(container, parentFolder) {
    // 하위 폴더 컨테이너 생성
    const childContainer = createElement('div', {
        className: 'folder-children ms-4'
    });
    childContainer.dataset.parentId = parentFolder.id;

    // 하위 폴더 항목 생성
    parentFolder.children.forEach(childFolder => {
        const folderItem = createFolderItemElement(childFolder);
        childContainer.appendChild(folderItem);

        // 재귀적으로 하위의 하위 폴더 렌더링
        if (childFolder.children && childFolder.children.length > 0) {
            renderSubfolders(childContainer, childFolder);
        }
    });

    // 하위 폴더 컨테이너를 DOM에 추가
    container.appendChild(childContainer);
}

/**
 * 하위 폴더 생성 모달 렌더링 함수
 * @param {HTMLElement} modalContent - 모달 내용 컨테이너
 * @param {string} categoryId - 카테고리 ID
 * @param {string} parentFolderId - 부모 폴더 ID
 * @param {string} parentFolderName - 부모 폴더 이름
 * @returns {HTMLFormElement} 생성된 폼 요소
 */
export function renderSubfolderModal(modalContent, categoryId, parentFolderId, parentFolderName) {
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
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    if (csrfToken) {
        const csrfInput = createElement('input', {
            type: 'hidden',
            name: '_csrf',
            value: csrfToken.content
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
    buttonGroup.appendChild(cancelButton);

    const submitButton = createElement('button', {
        type: 'submit',
        className: 'btn btn-primary'
    }, '생성');
    buttonGroup.appendChild(submitButton);
    form.appendChild(buttonGroup);

    modalContent.appendChild(form);

    return form;
}

/**
 * 폴더 편집 폼 렌더링 함수
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
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    if (csrfToken) {
        const csrfInput = createElement('input', {
            type: 'hidden',
            name: '_csrf',
            value: csrfToken.content
        });
        form.appendChild(csrfInput);
    }

    // 폴더 이름 입력 필드 (초기값 설정)
    const nameFormGroup = createElement('div', { className: 'mb-3' });
    const nameLabel = createElement('label', {
        htmlFor: 'editFolderName',
        className: 'form-label'
    }, '폴더 이름');
    nameFormGroup.appendChild(nameLabel);

    const nameInput = createElement('input', {
        type: 'text',
        className: 'form-control',
        id: 'editFolderName',
        name: 'name',
        value: folderName,
        required: true
    });
    nameFormGroup.appendChild(nameInput);

    const feedback = createElement('div', {
        className: 'invalid-feedback'
    }, '폴더 이름을 입력해주세요.');
    nameFormGroup.appendChild(feedback);
    form.appendChild(nameFormGroup);

    // 버튼 그룹 (저장 버튼에 폴더 ID 데이터 속성 추가)
    const buttonGroup = createElement('div', { className: 'modal-buttons' });

    const cancelButton = createElement('button', {
        type: 'button',
        className: 'btn btn-secondary modal-close'
    }, '취소');
    buttonGroup.appendChild(cancelButton);

    const saveButton = createElement('button', {
        type: 'button',
        className: 'btn btn-primary save-folder'
    }, '저장');
    saveButton.dataset.folderId = folderId;
    buttonGroup.appendChild(saveButton);

    form.appendChild(buttonGroup);

    container.appendChild(form);
}

/**
 * 폴더 생성 폼 렌더링 함수
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

    const categoryId = data.categoryId;

    // 폼 생성
    const form = createElement('form', {
        id: 'folderCreateForm',
        className: 'folder-create-form'
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

    // 카테고리 ID 히든 필드
    const categoryIdInput = createElement('input', {
        type: 'hidden',
        name: 'categoryId',
        value: categoryId
    });
    form.appendChild(categoryIdInput);

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