/**
 * 폴더 계층 구조를 위한 프론트엔드 JavaScript
 * 파일 경로: /static/js/features/category/folder-hierarchy.js
 */

import { createElement, validateForm, getBlogIdFromURL } from "../../utils/dom.js";
import { addCsrfToHeaders, getCsrfInfo } from "../../common/csrf.js";
import { openModal, closeModal } from "../../common/modal.js";

/**
 * 폴더 계층 구조 초기화 함수
 */
export function initializeFolderHierarchy() {
    // 폴더 확장/축소 기능
    document.addEventListener('click', function(e) {
        const folderLink = e.target.closest('.folder-name');
        if (!folderLink) return;

        const folderItem = folderLink.closest('.folder-item');
        if (!folderItem) return;

        const folderId = folderItem.dataset.folderId;
        if (!folderId) return;

        // 해당 폴더의 하위 폴더 컨테이너 찾기
        const childContainer = document.querySelector(`.folder-children[data-parent-id="${folderId}"]`);

        if (childContainer) {
            // 표시 상태 토글
            const isHidden = childContainer.style.display === 'none';
            childContainer.style.display = isHidden ? 'block' : 'none';

            // 폴더 아이콘 업데이트
            const folderIcon = folderLink.querySelector('i');
            if (folderIcon) {
                folderIcon.className = isHidden ? 'bi bi-folder2-open me-1' : 'bi bi-folder2 me-1';
            }
        }
    });

    // 하위 폴더 추가 버튼 이벤트
    document.addEventListener('click', function(e) {
        const addSubfolderButton = e.target.closest('.add-subfolder');
        if (!addSubfolderButton) return;

        const folderId = addSubfolderButton.dataset.folderId;
        const folderName = addSubfolderButton.dataset.folderName;
        const categoryId = addSubfolderButton.dataset.categoryId;

        if (!folderId || !categoryId) {
            console.error('폴더 ID 또는 카테고리 ID가 없습니다.');
            return;
        }

        // 하위 폴더 생성 모달 표시
        openSubfolderModal(categoryId, folderId, folderName);
    });

    // 폴더 생성 폼 제출 이벤트
    document.addEventListener('folderFormSubmit', function(e) {
        const { categoryId, folderData } = e.detail;
        createFolder(categoryId, folderData);
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
    const csrfInfo = addCsrfToHeaders();
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

    // 폼 제출 이벤트 핸들러
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 유효성 검사
        if (!validateForm(this)) {
            return;
        }

        // 폼 데이터 수집
        const formParentFolderId = document.getElementById('parentFolderId').value;
        console.log('폼 제출 - 부모 폴더 ID:', formParentFolderId);

        const folderData = {
            name: nameInput.value.trim(),
            parentFolderId: parentFolderId
        };
        console.log('폼 제출 - 폴더 데이터:', folderData);

        // 폼 제출 이벤트 발생
        const event = new CustomEvent('folderFormSubmit', {
            detail: { categoryId, folderData }
        });
        document.dispatchEvent(event);
    });

    modalContent.appendChild(form);
    modal.style.display = 'block';
}

/**
 * 폼 제출 이벤트 핸들러
 * @param {CustomEvent} e - 이벤트 객체
 */
function folderFormSubmitHandler(e) {
    const { categoryId, folderData } = e.detail;
    console.log('폴더 폼 제출:', { categoryId, folderData });

    // 부모 폴더 ID 검증
    if (folderData.parentFolderId) {
        console.log('하위 폴더 생성 - 부모 폴더 ID:', folderData.parentFolderId);
    } else {
        console.log('최상위 폴더 생성');
    }

    // 중복 제출 방지
    const submitButton = document.querySelector('#folderCreateForm button[type="submit"], #subfolderCreateForm button[type="submit"]');
    if (submitButton && submitButton.disabled) {
        console.log('이미 처리 중인 요청이 있습니다.');
        return;
    }

    if (submitButton) {
        submitButton.disabled = true;
    }

    // 폴더 생성 함수 호출
    createFolder(categoryId, folderData);
}

/**
 * 폴더 생성 API 호출 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {Object} folderData - 폴더 데이터 (name, parentFolderId)
 */
export function createFolder(categoryId, folderData) {
    // 이미 실행 중인지 확인 (중복 호출 방지)
    if (window.creatingFolder) {
        console.log('이미 폴더 생성 중입니다.');
        return;
    }

    window.creatingFolder = true;

    const blogId = getBlogIdFromURL();
    const csrfInfo = getCsrfInfo();

    if (!csrfInfo) {
        alert('CSRF 토큰이 없습니다. 다시 로그인해주세요.');
        window.creatingFolder = false;
        return;
    }

    // 저장 버튼 상태 업데이트
    const submitButton = document.querySelector('#folderCreateForm button[type="submit"], #subfolderCreateForm button[type="submit"]');
    const originalText = submitButton ? submitButton.textContent : '생성';
    if (submitButton) {
        submitButton.textContent = '생성 중...';
        submitButton.disabled = true;
    }

    // 요청 데이터 준비 - 부모 폴더 ID 명확하게 설정
    const requestData = {
        name: folderData.name
    };

    // 부모 폴더 ID가 있는 경우에만 추가 (유효한 값인지 확인)
    if (folderData.parentFolderId && folderData.parentFolderId !== 'null' && folderData.parentFolderId !== 'undefined') {
        requestData.parentFolderId = folderData.parentFolderId;
    }

    // 요청 헤더 설정
    const headers = {
        'Content-Type': 'application/json',
    };

    // CSRF 헤더 추가
    headers[csrfInfo.header] = csrfInfo.token;

    // fetch 요청 로그 (디버깅용)
    console.log('폴더 생성 요청:', {
        url: `/blog/${blogId}/category/${categoryId}/folder/create`,
        headers: headers,
//        body: folderData
        body: requestData
    });

    fetch(`/blog/${blogId}/category/${categoryId}/folder/create`, {
        method: 'POST',
        headers: headers,
//        body: JSON.stringify(folderData)
        body: JSON.stringify(requestData)
    })
    .then(response => {
        console.log('응답 상태:', response.status);
        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log('폴더 생성 성공:', data.folder);
            // 성공적으로 생성된 경우 UI 업데이트
            addFolderToUI(categoryId, data.folder);

            // 모달 닫기
            const modal = document.getElementById('folderModal');
            if (modal) {
                modal.style.display = 'none';
            }
        } else {
            // 실패 시 오류 메시지
            alert(data.message || '폴더 생성 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('폴더 생성 오류:', error);
        alert('폴더 생성 중 오류가 발생했습니다: ' + error.message);
    })
    .finally(() => {
        // 버튼 상태 복원
        if (submitButton) {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
        // 플래그 초기화
        window.creatingFolder = false;
    });
}

///**
// * 폴더 생성 API 호출 함수
// * @param {string} categoryId - 카테고리 ID
// * @param {Object} folderData - 폴더 데이터 (name, parentFolderId)
// */
//function createFolder(categoryId, folderData) {
//    const blogId = getBlogIdFromURL();
//    const csrfInfo = addCsrfToHeaders();
//
//    if (!csrfInfo) {
//        alert('CSRF 토큰이 없습니다. 다시 로그인해주세요.');
//        return;
//    }
//
//    // 저장 버튼 상태 업데이트
//    const submitButton = document.querySelector('#folderCreateForm button[type="submit"], #subfolderCreateForm button[type="submit"]');
//    const originalText = submitButton ? submitButton.textContent : '생성';
//    if (submitButton) {
//        submitButton.textContent = '생성 중...';
//        submitButton.disabled = true;
//    }
//
//    fetch(`/blog/${blogId}/category/${categoryId}/folder/create`, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json',
//            [csrfInfo.header]: csrfInfo.token
//        },
//        body: JSON.stringify(folderData)
//    })
//    .then(response => response.json())
//    .then(data => {
//        if (data.success) {
//            // 성공적으로 생성된 경우 UI 업데이트
//            addFolderToUI(categoryId, data.folder);
//
//            // 모달 닫기
//            const modal = document.getElementById('folderModal');
//            if (modal) {
//                modal.style.display = 'none';
//            }
//        } else {
//            // 실패 시 오류 메시지
//            alert(data.message || '폴더 생성 중 오류가 발생했습니다.');
//        }
//    })
//    .catch(error => {
//        console.error('Error:', error);
//        alert('폴더 생성 중 오류가 발생했습니다.');
//    })
//    .finally(() => {
//        // 버튼 상태 복원
//        if (submitButton) {
//            submitButton.textContent = originalText;
//            submitButton.disabled = false;
//        }
//    });
//}

/**
 * UI에 폴더 추가 함수 (계층 구조 지원)
 * @param {string} categoryId - 카테고리 ID
 * @param {Object} folder - 폴더 정보 객체
 */
/**
 * UI에 폴더 추가 함수 (계층 구조 지원)
 * @param {string} categoryId - 카테고리 ID
 * @param {Object} folder - 폴더 정보 객체
 */
export function addFolderToUI(categoryId, folder) {
    console.log('UI에 폴더 추가:', categoryId, folder);

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
        console.log('하위 폴더 추가:', folder.parentFolderId);

        // 부모 폴더의 하위 폴더 컨테이너 찾기 또는 생성
        let childContainer = folderList.querySelector(`.folder-children[data-parent-id="${folder.parentFolderId}"]`);

        if (!childContainer) {
            // 부모 폴더 요소 찾기
            const parentFolderItem = folderList.querySelector(`.folder-item[data-folder-id="${folder.parentFolderId}"]`);

            if (parentFolderItem) {
                console.log('부모 폴더 발견, 하위 폴더 컨테이너 생성');

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
                console.error('부모 폴더를 찾을 수 없음:', folder.parentFolderId);
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
        console.log('최상위 폴더 추가');
        // 최상위 폴더인 경우 목록에 직접 추가
        folderList.appendChild(folderItem);
    }
}

/**
 * 폴더 아이템 HTML 요소 생성 함수
 * @param {Object} folder - 폴더 정보 객체
 * @returns {HTMLElement} 폴더 항목 요소
 */
function createFolderItemElement(folder) {
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
 * 폴더 목록 로드 및 렌더링 함수 업데이트 (계층 구조 표시)
 * @param {string} categoryId - 카테고리 ID
 */
export function loadFolders(categoryId) {
    const folderListElement = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
    if (!folderListElement) return;

    const blogId = getBlogIdFromURL();

    // 로딩 표시
    folderListElement.innerHTML = '<div class="text-center py-2"><small>폴더를 불러오는 중...</small></div>';

    // AJAX 요청
    fetch(`/blog/${blogId}/category/${categoryId}/folders`)
        .then(response => {
            if (!response.ok) {
                throw new Error('폴더 목록을 불러오는데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            // 데이터 로드 완료 표시
            folderListElement.dataset.loaded = 'true';

            // 폴더 목록 렌더링
            renderFolderHierarchy(categoryId, data.folders || []);
        })
        .catch(error => {
            console.error('폴더 로딩 오류:', error);
            folderListElement.innerHTML = `
                <div class="alert alert-danger py-2 my-2">
                    <small>폴더 목록을 불러오지 못했습니다.</small>
                </div>
            `;
        });
}

/**
 * 폴더 계층 구조 렌더링 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {Array} folders - 모든 폴더 목록
 */
function renderFolderHierarchy(categoryId, folders) {
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
 * 폴더 삭제 함수 (하위 폴더 처리 포함)
 * @param {string} folderId - 폴더 ID
 */
export function deleteFolder(folderId) {
    const blogId = getBlogIdFromURL();

    // CSRF 토큰 가져오기
    const csrfInfo = getCsrfInfo();
    if (!csrfInfo) {
        console.error('CSRF 토큰을 찾을 수 없습니다.');
        alert('인증 관련 오류가 발생했습니다. 페이지를 새로고침한 후 다시 시도해주세요.');
        return;
    }

    // 폴더 삭제 전 확인
    const folderItem = document.querySelector(`.folder-item[data-folder-id="${folderId}"]`);
    const folderName = folderItem?.querySelector('.folder-name')?.textContent?.trim() || '선택한 폴더';
    const childContainer = document.querySelector(`.folder-children[data-parent-id="${folderId}"]`);

    let confirmMessage = `"${folderName}" 폴더를 삭제하시겠습니까?`;
    if (childContainer && childContainer.children.length > 0) {
        confirmMessage += "\n\n주의: 모든 하위 폴더도 함께 삭제됩니다.";
    }

    if (!confirm(confirmMessage)) {
        return;
    }

    // 헤더 설정 - Content-Type 및 CSRF 토큰
    const headers = {
        'Content-Type': 'application/json'
    };

    // CSRF 헤더 추가
    headers[csrfInfo.header] = csrfInfo.token;

    console.log('삭제 요청 헤더:', headers);
    console.log('삭제 요청 URL:', `/blog/${blogId}/folder/${folderId}/delete`);

    // 요청 보내기
    fetch(`/blog/${blogId}/folder/${folderId}/delete`, {
        method: 'POST',
        headers: headers,
        credentials: 'same-origin' // 쿠키 포함 (세션 기반 인증의 경우)
    })
    .then(response => {
        console.log('응답 상태:', response.status);
        if (response.status === 403) {
            throw new Error('접근 권한이 없습니다. (403 Forbidden)');
        }
        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('삭제 응답:', data);
        if (data.success) {
            // 성공적으로 삭제된 경우 UI에서 폴더와 하위 폴더 모두 제거
            removeFolderFromUI(folderId);
        } else {
            alert(data.message || '폴더 삭제 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('폴더 삭제 오류:', error);
        alert('폴더 삭제 중 오류가 발생했습니다: ' + error.message);
    });
}

///**
// * 폴더 삭제 함수 (하위 폴더 처리 포함)
// * @param {string} folderId - 폴더 ID
// */
//export function deleteFolder(folderId) {
//    const blogId = getBlogIdFromURL();
//    const csrfInfo = addCsrfToHeaders();
//
//    if (!csrfInfo) {
//        alert('CSRF 토큰이 없습니다. 다시 로그인해주세요.');
//        return;
//    }
//
//    // 폴더 삭제 전 확인
//    const folderItem = document.querySelector(`.folder-item[data-folder-id="${folderId}"]`);
//    const folderName = folderItem?.querySelector('.folder-name')?.textContent?.trim() || '선택한 폴더';
//    const childContainer = document.querySelector(`.folder-children[data-parent-id="${folderId}"]`);
//
//    let confirmMessage = `"${folderName}" 폴더를 삭제하시겠습니까?`;
//    if (childContainer && childContainer.children.length > 0) {
//        confirmMessage += "\n\n주의: 모든 하위 폴더도 함께 삭제됩니다.";
//    }
//
//    if (!confirm(confirmMessage)) {
//        return;
//    }
//
//    fetch(`/blog/${blogId}/folder/${folderId}/delete`, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json',
//            [csrfInfo.header]: csrfInfo.token
//        }
//    })
//    .then(response => response.json())
//    .then(data => {
//        if (data.success) {
//            // 성공적으로 삭제된 경우 UI에서 폴더와 하위 폴더 모두 제거
//            removeFolderFromUI(folderId);
//        } else {
//            alert(data.message || '폴더 삭제 중 오류가 발생했습니다.');
//        }
//    })
//    .catch(error => {
//        console.error('Error:', error);
//        alert('폴더 삭제 중 오류가 발생했습니다.');
//    });
//}

/**
 * UI에서 폴더 제거 함수 (하위 폴더 포함)
 * @param {string} folderId - 폴더 ID
 */
function removeFolderFromUI(folderId) {
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

//// 모듈 내보내기
//export {};