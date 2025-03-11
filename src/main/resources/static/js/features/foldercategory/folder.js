/**
 * 폴더 관련 기능을 처리하는 모듈
 * 폴더 기능의 진입점 역할을 하며 이벤트 핸들러를 초기화합니다.
 */
import { openModal, closeModal } from "../../common/modal.js";
import { validateForm } from "../../utils/dom.js";
import { getCsrfInfo } from "../../common/csrf.js";
import * as FolderAPI from "./folder-api.js";
import * as FolderUI from "./folder-ui.js";

// 중복 초기화 방지를 위한 플래그
let isInitialized = false;

/**
 * 폴더 관련 이벤트 초기화 함수
 */
export function initializeFolderHandlers() {
    // 이미 초기화됐다면 중복 실행 방지
    if (isInitialized) return;
    isInitialized = true;

//    console.log('폴더 핸들러 초기화');

    // 폴더 추가 버튼 이벤트 처리
    document.querySelectorAll('.add-folder').forEach(button => {
        button.addEventListener('click', handleAddFolder);
    });

    // 이벤트 위임 방식으로 폴더 관련 모든 버튼 처리
    document.addEventListener('click', handleFolderEvents);

    // 폴더 확장/축소 이벤트
    document.addEventListener('click', handleFolderExpandCollapse);

    // 폼 제출 이벤트 리스너
    document.addEventListener('folderFormSubmit', handleFolderFormSubmit);
}

/**
 * 폴더 관련 버튼 클릭 이벤트 처리 (이벤트 위임)
 * @param {Event} e - 이벤트 객체
 */
function handleFolderEvents(e) {
    // 폴더 수정 버튼
    const editButton = e.target.closest('.edit-folder');
    if (editButton) {
        handleFolderEdit(editButton);
        return;
    }

    // 폴더 저장 버튼
    if (e.target.classList.contains('save-folder')) {
        const folderId = e.target.dataset.folderId;
        handleFolderUpdate(folderId);
        return;
    }

    // 폴더 삭제 버튼
    const deleteButton = e.target.closest('.delete-folder');
    if (deleteButton) {
        handleFolderDelete(deleteButton);
        return;
    }

    // 하위 폴더 추가 버튼
    const addSubfolderButton = e.target.closest('.add-subfolder');
    if (addSubfolderButton) {
        handleAddSubfolder(addSubfolderButton);
        return;
    }
}

/**
 * 폴더 확장/축소 처리 함수
 * @param {Event} e - 이벤트 객체
 */
function handleFolderExpandCollapse(e) {
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
            folderIcon.className = isHidden
                ? 'bi bi-folder2-open me-1'
                : 'bi bi-folder2 me-1';
        }
    }
}

/**
 * 폴더 추가 버튼 클릭 이벤트 핸들러
 * @param {Event} e - 이벤트 객체
 */
export function handleAddFolder(e) {
//    e.stopPropagation(); // 이벤트 버블링 방지

    const categoryId = this.dataset.categoryId;
    if (!categoryId) {
        console.error('카테고리 ID가 없습니다.');
        return;
    }

    // 모든 모달 출력
    const allModals = document.querySelectorAll('div[id]');
    console.log('모든 모달:', Array.from(allModals).map(modal => ({
        id: modal.id,
        className: modal.className
    })));

    // 모달 찾기 로직 변경
    const modal = document.getElementById('folderModal');
    console.log('찾은 모달:', modal);

    if (!modal) {
        console.error('모달 요소를 찾을 수 없습니다.');
        return;
    }

    // 나머지 기존 코드 유지
    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = '폴더 생성';
    }

    const modalContent = modal.querySelector('.modal-content-body');
    if (modalContent) {
        const form = FolderUI.renderFolderCreateForm(modalContent, {
            categoryId: categoryId
        });

        // 폼 제출 이벤트 핸들러
        form.addEventListener('submit', function(evt) {
            evt.preventDefault();
            if (validateForm(this)) {
                const formData = new FormData(this);
                const folderData = {
                    name: formData.get('name'),
                    categoryId: formData.get('categoryId')
                };

                // 폼 제출 이벤트 발생
                const customEvent = new CustomEvent('folderFormSubmit', {
                    detail: { categoryId, folderData }
                });
                document.dispatchEvent(customEvent);
            }
        });
    }
    openModal('folderModal');
}

//        // 폴더 목록 표시 (이미 표시되어 있다면 그대로 유지)
//        if (folderList.style.display === 'none') {
//            folderList.style.display = 'block';
//        }
//    }
//}

/**
 * 하위 폴더 추가 버튼 클릭 이벤트 핸들러
 * @param {HTMLElement} button - 버튼 요소
 */
export function handleAddSubfolder(button) {
    const folderId = button.dataset.folderId;
    const folderName = button.dataset.folderName;
    const categoryId = button.dataset.categoryId;

    if (!folderId || !categoryId) {
        console.error('폴더 ID 또는 카테고리 ID가 없습니다.');
        return;
    }

    // 하위 폴더 생성 모달 표시
    const modal = document.getElementById('folderModal');
    if (modal) {
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = '하위 폴더 생성';
        }

        const modalContent = modal.querySelector('.modal-content-body');
        if (modalContent) {
            const form = FolderUI.renderSubfolderModal(modalContent, categoryId, folderId, folderName);

            // 폼 제출 이벤트 핸들러
            form.addEventListener('submit', function(evt) {
                evt.preventDefault();
                if (validateForm(this)) {
                    const folderData = {
                        name: document.getElementById('folderName').value.trim(),
                        parentFolderId: document.getElementById('parentFolderId').value
                    };

                    // 폼 제출 이벤트 발생
                    const customEvent = new CustomEvent('folderFormSubmit', {
                        detail: { categoryId, folderData }
                    });
                    document.dispatchEvent(customEvent);
                }
            });
        }
        openModal('folderModal');
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
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = '폴더 수정';
        }

        const modalContent = modal.querySelector('.modal-content-body');
        if (modalContent) {
            FolderUI.renderFolderEditForm(modalContent, {
                folderId: folderId,
                folderName: folderName
            });
        }
        openModal(modal);
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

    // 폴더 삭제 전 확인
    const childContainer = document.querySelector(`.folder-children[data-parent-id="${folderId}"]`);
    let confirmMessage = `"${folderName}" 폴더를 삭제하시겠습니까?`;

    if (childContainer && childContainer.children.length > 0) {
        confirmMessage += "\n\n주의: 모든 하위 폴더도 함께 삭제됩니다.";
    }

    if (confirm(confirmMessage)) {
        // 버튼 비활성화 (중복 클릭 방지)
        button.disabled = true;

        // 폴더 삭제 API 호출
        FolderAPI.deleteFolder(folderId)
            .then(data => {
                if (data.success) {
                    // 성공적으로 삭제된 경우 UI에서 폴더와 하위 폴더 모두 제거
                    FolderUI.removeFolderFromUI(folderId);
                } else {
                    alert(data.message || '폴더 삭제 중 오류가 발생했습니다.');
                }
            })
            .catch(error => {
                console.error('폴더 삭제 오류:', error);
                alert('폴더 삭제 중 오류가 발생했습니다: ' + error.message);
            })
            .finally(() => {
                // 버튼 다시 활성화
                button.disabled = false;
            });
    }
}

/**
 * 폴더 수정 처리 함수
 * @param {string} folderId - 폴더 ID
 */
function handleFolderUpdate(folderId) {
    const nameInput = document.getElementById('editFolderName');
    const newName = nameInput.value.trim();

    if (!newName) {
        nameInput.classList.add('is-invalid');
        return;
    }

    // 저장 버튼 상태 업데이트
    const saveButton = document.querySelector('.save-folder');
    const originalText = saveButton.textContent;
    saveButton.textContent = '저장 중...';
    saveButton.disabled = true;

    // 폴더 수정 API 호출
    FolderAPI.updateFolder(folderId, newName)
        .then(data => {
            if (data.success) {
                // 성공적으로 업데이트 된 경우
                // UI 업데이트 (폴더 이름 변경)
                FolderUI.updateFolderInUI(folderId, data.folder);

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
            console.error('폴더 수정 오류:', error);
            alert('폴더 수정 중 오류가 발생했습니다: ' + error.message);
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
 * 폴더 생성 폼 제출 이벤트 핸들러
 * @param {CustomEvent} e - 이벤트 객체
 */
function handleFolderFormSubmit(e) {
    const { categoryId, folderData } = e.detail;

//    // CSRF 정보 가져오기
//    const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
//    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;
//
//    console.log('CSRF 토큰:', csrfToken);
//    console.log('CSRF 헤더:', csrfHeader);
//
//    if (!csrfToken || !csrfHeader) {
//        alert('인증 정보를 찾을 수 없습니다. 로그인 후 다시 시도해주세요.');
//        return;
//    }

    // CSRF 정보 가져오기
    const csrfInfo = getCsrfInfo();

    if (!csrfInfo || !csrfInfo.token || !csrfInfo.header) {
        alert('인증 정보를 찾을 수 없습니다. 로그인 후 다시 시도해주세요.');
        return;
    }

    // 중복 요청 방지
    const submitButton = document.querySelector('#folderCreateForm button[type="submit"], #subfolderCreateForm button[type="submit"]');
    if (submitButton && submitButton.disabled) {
        console.log('이미 처리 중인 요청이 있습니다.');
        return;
    }

    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '생성 중...';
    }

    // 폴더 생성 API 호출
    FolderAPI.createFolder(categoryId, folderData, csrfInfo.token, csrfInfo.header)
        .then(data => {
            if (data.success) {

//                const parentFolderId = folderData.parentFolderId;
//
//                // 성공적으로 생성된 경우 UI 업데이트
//                if (parentFolderId) {
//                    console.log(`📂 상위 폴더 (${parentFolderId}) 하위 폴더 다시 불러오기`);
//                    FolderAPI.fetchFolders(categoryId)
//                        .then(folders => {
//                            FolderUI.renderFolderHierarchy(categoryId, folders);
//                        })
//                        .catch(error => console.error("폴더 목록 갱신 오류:", error));
//                } else {
//                    console.log("📂 최상위 폴더이므로 폴더 목록 전체 갱신");
//                    FolderAPI.fetchFolders(categoryId)
//                        .then(folders => {
//                            FolderUI.renderFolderHierarchy(categoryId, folders);
//                        })
//                        .catch(error => console.error("폴더 목록 갱신 오류:", error));
//                }

                // 성공적으로 생성된 경우 UI 업데이트
                FolderUI.addFolderToUI(categoryId, data.folder);

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
                submitButton.textContent = '생성';
                submitButton.disabled = false;
            }
        });
}

/**
 * 폴더 목록 로드 함수
 * @param {string} categoryId - 카테고리 ID
 */
export function loadFolders(categoryId) {
    const folderListElement = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
    if (!folderListElement) {
        console.error('폴더 목록 요소를 찾을 수 없습니다:', categoryId);
        return;
    }

    // 로딩 표시
    folderListElement.innerHTML = '<div class="text-center py-2"><small>폴더를 불러오는 중...</small></div>';
    folderListElement.style.display = 'block'; // 목록을 표시 상태로 변경

    // 폴더 목록 API 호출
    FolderAPI.fetchFolders(categoryId)
        .then(data => {
            // 데이터 로드 완료 표시
            folderListElement.dataset.loaded = 'true';

            // 폴더 목록 렌더링
            FolderUI.renderFolderHierarchy(categoryId, data.folders || []);
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
 * 폴더 목록 토글 함수
 * @param {string} categoryId - 카테고리 ID
 */
export function toggleFolderList(categoryId) {
    console.log('toggleFolderList 호출:', categoryId);

    const categoryItem = document.querySelector(`.list-group-item[data-category-id="${categoryId}"]`);
    console.log('카테고리 아이템:', categoryItem);

    if (!categoryItem) return;

    // 폴더 목록을 직접 찾도록 수정
    const folderList = categoryItem.querySelector('.folder-list');
    console.log('폴더 목록:', folderList);

    if (!folderList) return;

    // 토글 상태 변경
    const isCurrentlyVisible = folderList.style.display !== 'none';
    console.log('현재 표시 상태:', isCurrentlyVisible);

    // 모든 폴더 목록 숨기기
    document.querySelectorAll('.folder-list').forEach(list => {
        list.style.display = 'none';
    });

    // 현재 폴더 목록이 보이지 않은 경우에만 로드 또는 표시
    if (!isCurrentlyVisible) {
        // 폴더 목록이 비어있고 처음 펼치는 경우만 데이터 로드
        if (folderList.children.length === 0 || folderList.dataset.loaded !== 'true') {
            console.log('폴더 로드 시도');
            import('./folder.js').then(module => {
                module.loadFolders(categoryId);
            });
        } else {
            console.log('폴더 목록 표시');
            folderList.style.display = 'block';
        }
    }
}