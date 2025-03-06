/**
 * 폴더 관련 기능을 처리하는 모듈
 */
import { openModal, closeModal } from "../../common/modal.js";
import { addCsrfToHeaders } from "../../common/csrf.js";
import { renderFolderCreateForm, renderFolderEditForm } from "../modals/renderer.js";
import { getBlogIdFromURL } from "../../utils/dom.js";
import {
    initializeFolderHierarchy,
    loadFolders,
    deleteFolder as deleteHierarchyFolder,
    createFolder as createHierarchyFolder,
    addFolderToUI as addHierarchyFolderToUI
} from "./folder-hierarchy.js";

/**
 * 폴더 관련 이벤트 초기화 함수
 */
export function initializeFolderHandlers() {
    // 폴더 추가 버튼 이벤트 처리
    document.querySelectorAll('.add-folder').forEach(button => {
        // 이벤트 리스너 중복 등록 방지
        // 기존 이벤트 리스너 제거
        button.removeEventListener('click', handleAddFolder);
        button.addEventListener('click', handleAddFolder);
    });

    // 폴더 수정 및 삭제 버튼 이벤트 처리 (이벤트 위임)
    document.addEventListener('click', function(e) {
        // 폴더 수정 버튼
        const editButton = e.target.closest('.edit-folder');
        if (editButton) {
            handleFolderEdit(editButton);
        }

        // 폴더 저장 버튼
        if (e.target && e.target.classList.contains('save-folder')) {
            const folderId = e.target.dataset.folderId;
            updateFolder(folderId);
        }

        // 폴더 삭제 버튼 - 이 부분이 중요합니다
        const deleteButton = e.target.closest('.delete-folder');
        if (deleteButton) {
            console.log('삭제 버튼 클릭:', deleteButton.dataset.folderId);
            handleFolderDelete(deleteButton);
        }

        // 하위 폴더 추가 버튼
        const addSubfolderButton = e.target.closest('.add-subfolder');
        if (addSubfolderButton) {
            // 이벤트는 folder-hierarchy.js에서 처리
        }
    });

    // 이벤트 위임 방식으로 document에 한 번만 이벤트 리스너 등록
    // 기존 이벤트 리스너 제거 (별도 함수로 분리되어 있다면)

    // 폼 제출 이벤트 리스너 중복 등록 방지 (폴더 생성)
    document.removeEventListener('folderFormSubmit', folderFormSubmitHandler);
    document.addEventListener('folderFormSubmit', folderFormSubmitHandler);

    // 폴더 계층 구조 관련 이벤트 초기화
    // 중복 초기화 방지를 위해 초기화 여부 확인
    if (!window.folderHierarchyInitialized) {
        initializeFolderHierarchy();
        window.folderHierarchyInitialized = true;
    }
}

/**
 * 폴더 생성 폼 제출 이벤트 핸들러
 * @param {CustomEvent} e - 이벤트 객체
 */
function folderFormSubmitHandler(e) {
    const { categoryId, folderData } = e.detail;
    console.log('폼 제출됨:', categoryId, folderData);
    // 중복 요청 방지 - 제출 버튼 비활성화
    const submitButton = document.querySelector('#folderCreateForm button[type="submit"], #subfolderCreateForm button[type="submit"]');
    if (submitButton && submitButton.disabled) {
        console.log('이미 처리 중인 요청이 있습니다.');
        return;
    }

    if (submitButton) {
        submitButton.disabled = true;
    }

    // 폴더 생성 함수 호출
    createHierarchyFolder(categoryId, folderData);
}

///**
// * 폴더 관련 이벤트 초기화 함수
// */
//export function initializeFolderHandlers() {
//    // 폴더 추가 버튼 이벤트 처리
//    document.querySelectorAll('.add-folder').forEach(button => {
//        button.addEventListener('click', handleAddFolder);
//    });
//
//    // 폴더 수정 및 삭제 버튼 이벤트 처리 (이벤트 위임)
//    document.addEventListener('click', function(e) {
//        // 폴더 수정 버튼
//        const editButton = e.target.closest('.edit-folder');
//        if (editButton) {
//            handleFolderEdit(editButton);
//        }
//
//        // 폴더 저장 버튼
//        if (e.target && e.target.classList.contains('save-folder')) {
//            const folderId = e.target.dataset.folderId;
//            updateFolder(folderId);
//        }
//
//        // 폴더 삭제 버튼
//        if (e.target && e.target.classList.contains('delete-folder')) {
//            handleFolderDelete(e.target);
//        }
//
//        // 하위 폴더 추가 버튼 - folder-hierarchy.js에서 처리
//        const addSubfolderButton = e.target.closest('.add-subfolder');
//        if (addSubfolderButton) {
//            // 이벤트는 folder-hierarchy.js에서 처리
//        }
//    });
//
////    // 폼 제출 이벤트 리스너 (폴더 생성)
////    document.addEventListener('folderFormSubmit', function(e) {
////        const { categoryId, folderData } = e.detail;
////        createFolder(categoryId, folderData.name);
////    });
//
//    // 폼 제출 이벤트 리스너 (폴더 생성)
//    document.addEventListener('folderFormSubmit', function(e) {
//        const { categoryId, folderData } = e.detail;
//        createHierarchyFolder(categoryId, folderData);
//    });
//
//    // 폴더 계층 구조 관련 이벤트 초기화
//    initializeFolderHierarchy();
//}

/**
 * 폴더 추가 버튼 클릭 이벤트 핸들러
 * @param {Event} e - 이벤트 객체
 */
function handleAddFolder(e) {
    e.stopPropagation(); // 이벤트 버블링 방지

    const categoryId = this.dataset.categoryId;
    if (!categoryId) {
        console.error('카테고리 ID가 없습니다.');
        return;
    }

    // 폴더 목록 참조
    const folderList = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
    if (folderList) {
        // 폴더 생성 모달 표시
        const modal = document.getElementById('folderModal');
        if (modal) {
            const modalContent = modal.querySelector('.modal-content-body');
            if (modalContent) {
                modalContent.innerHTML = '';
                renderFolderCreateForm(modalContent, {
                    categoryId: categoryId
                });
            }
            modal.style.display = 'block';
        }

        // 폴더 목록 표시 (이미 표시되어 있다면 그대로 유지)
        if (folderList.style.display === 'none') {
            folderList.style.display = 'block';
        }
    }
}

/**
 * 폴더 수정 버튼 클릭 이벤트 핸들러
 * @param {HTMLElement} button - 수정 버튼 요소
 */
function handleFolderEdit(button) {
    const folderId = button.dataset.folderId;
    const folderName = button.dataset.folderName;

    if (!folderId) {
        console.error('폴더 ID가 없습니다.');
        return;
    }

    // 모달 열기
    const modal = document.getElementById('editFolderModal');
    if (modal) {
        const modalContent = modal.querySelector('.modal-content-body');
        if (modalContent) {
            modalContent.innerHTML = '';
            renderFolderEditForm(modalContent, {
                folderId: folderId,
                folderName: folderName
            });
        }
        modal.style.display = 'block';
    }
}

/**
 * 폴더 삭제 버튼 클릭 이벤트 핸들러
 * @param {HTMLElement} button - 삭제 버튼 요소
 */
function handleFolderDelete(button) {
    const folderId = button.dataset.folderId;
    const folderName = button.dataset.folderName;

    if (!folderId) {
        console.error('폴더 ID가 없습니다.');
        return;
    }

//    if (confirm(`"${folderName}" 폴더를 정말 삭제하시겠습니까?`)) {
//        deleteFolder(folderId);
//    }

    // 계층형 폴더 삭제 사용 - 확인 대화상자는 deleteHierarchyFolder 내에서 처리됨
    deleteHierarchyFolder(folderId);
}

/**
 * 폴더 목록 토글 및 필요시 AJAX로 데이터 로드
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
            loadFolders(categoryId, folderList);
        }
        folderList.style.display = 'block';
    } else {
        // 접는 경우
        folderList.style.display = 'none';
    }
}

///**
// * AJAX로 폴더 목록 로드
// * @param {string} categoryId - 카테고리 ID
// * @param {HTMLElement} folderListElement - 폴더 목록 요소
// */
//function loadFolders(categoryId, folderListElement) {
//    const blogId = getBlogIdFromURL();
//
//    // 로딩 표시
//    folderListElement.innerHTML = '<div class="text-center py-2"><small>폴더를 불러오는 중...</small></div>';
//
//    // AJAX 요청
//    fetch(`/blog/${blogId}/category/${categoryId}/folders`)
//        .then(response => {
//            if (!response.ok) {
//                throw new Error('폴더 목록을 불러오는데 실패했습니다.');
//            }
//            return response.json();
//        })
//        .then(data => {
//            // 데이터 로드 완료 표시
//            folderListElement.dataset.loaded = 'true';
//
//            // 폴더 목록 렌더링
//            renderFolderList(categoryId, data.folders || []);
//        })
//        .catch(error => {
//            console.error('폴더 로딩 오류:', error);
//            folderListElement.innerHTML = `
//                <div class="alert alert-danger py-2 my-2">
//                    <small>폴더 목록을 불러오지 못했습니다.</small>
//                </div>
//            `;
//        });
//}

///**
// * 폴더 목록 렌더링 함수
// * @param {string} categoryId - 카테고리 ID
// * @param {Array} folders - 폴더 목록 배열
// */
//function renderFolderList(categoryId, folders) {
//    const folderList = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
//    if (!folderList) return;
//
//    // 컨테이너 초기화
//    folderList.innerHTML = '';
//
//    // 폴더가 없는 경우
//    if (!folders || folders.length === 0) {
//        folderList.innerHTML = '<div class="py-2 text-muted small">폴더가 없습니다.</div>';
//        return;
//    }
//
//    // 폴더 목록 렌더링
//    folders.forEach(folder => {
//        const folderItem = createFolderItemElement(folder);
//        folderList.appendChild(folderItem);
//    });
//}

///**
// * 폴더 항목 HTML 요소 생성 함수
// * @param {Object} folder - 폴더 정보 객체
// * @returns {HTMLElement} 폴더 항목 요소
// */
//function createFolderItemElement(folder) {
//    const folderItem = document.createElement('div');
//    folderItem.classList.add('folder-item', 'd-flex', 'justify-content-between', 'align-items-center', 'my-1');
//    folderItem.setAttribute('data-folder-id', folder.id);
//
//    // 폴더 링크 생성
//    const folderLink = document.createElement('a');
//    folderLink.href = `#`;  // 나중에 폴더 상세 링크로 변경 가능
//    folderLink.classList.add('folder-name');
//    folderLink.innerHTML = `<i class="bi bi-folder me-1"></i> ${folder.name}`;
//    folderItem.appendChild(folderLink);
//
//    // 폴더 액션 버튼들 추가
//    const actionDiv = document.createElement('div');
//    actionDiv.classList.add('folder-actions');
//
//    // 폴더 편집 버튼
//    const editButton = document.createElement('button');
//    editButton.type = 'button';
//    editButton.classList.add('btn', 'btn-sm', 'edit-folder');
//    editButton.dataset.folderId = folder.id;
//    editButton.dataset.folderName = folder.name;
//    editButton.innerHTML = '<i class="bi bi-pencil"></i>';
//    actionDiv.appendChild(editButton);
//
//    // 폴더 삭제 버튼
//    const deleteButton = document.createElement('button');
//    deleteButton.type = 'button';
//    deleteButton.classList.add('btn', 'btn-sm', 'delete-folder');
//    deleteButton.dataset.folderId = folder.id;
//    deleteButton.dataset.folderName = folder.name;
//    deleteButton.innerHTML = '<i class="bi bi-x"></i>';
//    actionDiv.appendChild(deleteButton);
//
//    folderItem.appendChild(actionDiv);
//
//    return folderItem;
//}

///**
// * 폴더 생성 함수
// * @param {string} categoryId - 카테고리 ID
// * @param {string} folderName - 폴더 이름
// */
//function createFolder(categoryId, folderName) {
//    const blogId = getBlogIdFromURL();
//
//    // 저장 버튼 상태 업데이트
//    const submitButton = document.querySelector('#folderCreateForm button[type="submit"]');
//    const originalText = submitButton.textContent;
//    submitButton.textContent = '생성 중...';
//    submitButton.disabled = true;
//
//    fetch(`/blog/${blogId}/category/${categoryId}/folder/create`, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json',
//            ...addCsrfToHeaders()
//        },
//        body: JSON.stringify({ name: folderName })
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

///**
// * UI에 폴더 추가하는 함수
// * @param {string} categoryId - 카테고리 ID
// * @param {Object} folder - 폴더 정보 객체
// */
//function addFolderToUI(categoryId, folder) {
//    const folderList = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
//    if (!folderList) return;
//
//    // 폴더 표시 영역 보이게 설정
//    folderList.style.display = 'block';
//
//    // '폴더가 없습니다' 메시지 제거
//    const emptyMessage = folderList.querySelector('.text-muted');
//    if (emptyMessage) {
//        emptyMessage.remove();
//    }
//
//    // 새 폴더 HTML 생성
//    const folderItem = createFolderItemElement(folder);
//    folderList.appendChild(folderItem);
//}

/**
 * 폴더 수정 함수
 * @param {string} folderId - 폴더 ID
 */
function updateFolder(folderId) {
    const nameInput = document.getElementById('editFolderName');
    const newName = nameInput.value.trim();

    if (!newName) {
        nameInput.classList.add('is-invalid');
        return;
    }

    const blogId = getBlogIdFromURL();

    // 저장 버튼 상태 업데이트
    const saveButton = document.querySelector('.save-folder');
    const originalText = saveButton.textContent;
    saveButton.textContent = '저장 중...';
    saveButton.disabled = true;

    fetch(`/blog/${blogId}/folder/${folderId}/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...addCsrfToHeaders()
        },
        body: JSON.stringify({ name: newName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 성공적으로 업데이트 된 경우
            // UI 업데이트 (폴더 이름 변경)
            updateFolderInUI(folderId, data.folder);

            // 모달 닫기
            const modal = document.getElementById('editFolderModal');
            if (modal) {
                modal.style.display = 'none';
            }
        } else {
            // 실패 시 오류 메시지
            alert(data.message || '폴더 수정 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('폴더 수정 중 오류가 발생했습니다.');
    })
    .finally(() => {
        // 버튼 상태 복원
        if (saveButton) {
            saveButton.textContent = originalText;
            saveButton.disabled = false;
        }
    });
}

/**
 * UI 내 폴더 정보 업데이트
 * @param {string} folderId - 폴더 ID
 * @param {Object} updatedFolder - 업데이트된 폴더 정보
 */
function updateFolderInUI(folderId, updatedFolder) {
    const folderItem = document.querySelector(`.folder-item[data-folder-id="${folderId}"]`);
    if (!folderItem) return;

    // 폴더 이름 업데이트
    const folderLink = folderItem.querySelector('.folder-name');
    if (folderLink) {
        folderLink.innerHTML = `<i class="bi bi-folder me-1"></i> ${updatedFolder.name}`;
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

///**
// * 폴더 삭제 함수
// * @param {string} folderId - 폴더 ID
// */
//function deleteFolder(folderId) {
//    const blogId = getBlogIdFromURL();
//
//    fetch(`/blog/${blogId}/folder/${folderId}/delete`, {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json',
//            ...addCsrfToHeaders()
//        }
//    })
//    .then(response => response.json())
//    .then(data => {
//        if (data.success) {
//            // 성공적으로 삭제된 경우 UI에서 폴더 요소 제거
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

///**
// * UI에서 폴더 제거 함수
// * @param {string} folderId - 폴더 ID
// */
//function removeFolderFromUI(folderId) {
//    const folderItem = document.querySelector(`.folder-item[data-folder-id="${folderId}"]`);
//    if (!folderItem) return;
//
//    // 폴더 컨테이너의 부모 카테고리 ID 찾기
//    const folderList = folderItem.closest('.folder-list');
//
//    // 폴더 요소 제거
//    folderItem.remove();
//
//    // 폴더가 모두 삭제된 경우 메세지 표시
//    if (folderList && folderList.querySelectorAll('.folder-item').length === 0) {
//        folderList.innerHTML = '<div class="py-2 text-muted small">폴더가 없습니다.</div>';
//    }
//}