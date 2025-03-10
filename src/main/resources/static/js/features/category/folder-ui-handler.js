/**
 * 폴더 UI 관련 핸들러
 * 파일 경로: /static/js/features/category/folder-ui-handler.js
 */

import { createElement } from "../../utils/dom.js";
import { loadFolderPostsList, loadFolderPostsContent } from "../post/post-folder-view.js";

/**
 * 폴더 클릭 이벤트 핸들러
 * @param {Event} e - 클릭 이벤트
 */
export function handleFolderClick(e) {
    e.preventDefault();

    const folderLink = e.target.closest('.folder-name');
    if (!folderLink) return;

    const folderItem = folderLink.closest('.folder-item');
    if (!folderItem) return;

    const folderId = folderItem.dataset.folderId;
    if (!folderId) return;

    // 1. 하위 폴더 컨테이너 토글
    toggleChildFolders(folderId, folderLink);

    // 2. 포스트 컨테이너 토글
    toggleFolderPosts(folderId, folderItem);

    // 3. 메인 컨텐츠 영역 업데이트
    loadFolderPostsContent(folderId);
}

/**
 * 하위 폴더 토글 함수
 * @param {string} folderId - 폴더 ID
 * @param {HTMLElement} folderLink - 폴더 링크 요소
 */
function toggleChildFolders(folderId, folderLink) {
    const childContainer = document.querySelector(`.folder-children[data-parent-id="${folderId}"]`);
    if (!childContainer) return;

    const isHidden = childContainer.style.display === 'none';
    childContainer.style.display = isHidden ? 'block' : 'none';

    // 폴더 아이콘 업데이트
    const folderIcon = folderLink.querySelector('i');
    if (folderIcon) {
        folderIcon.className = isHidden ? 'bi bi-folder2-open me-1' : 'bi bi-folder2 me-1';
    }
}

/**
 * 폴더 포스트 목록 토글 함수
 * @param {string} folderId - 폴더 ID
 * @param {HTMLElement} folderItem - 폴더 아이템 요소
 */
function toggleFolderPosts(folderId, folderItem) {
    // 포스트 컨테이너 찾기 또는 생성
    let postsContainer = document.querySelector(`.folder-posts[data-folder-id="${folderId}"]`);

    // 포스트 컨테이너가 없으면 생성
    if (!postsContainer) {
        postsContainer = document.createElement('div');
        postsContainer.className = 'folder-posts ms-3 mt-2';
        postsContainer.dataset.folderId = folderId;

        // 로딩 메시지
        postsContainer.innerHTML = '<div class="text-muted small">포스트를 불러오는 중...</div>';

        // 폴더 아이템 다음에 삽입
        folderItem.after(postsContainer);

        // 포스트 목록 로드
        loadFolderPostsList(folderId, postsContainer);
    } else {
        // 이미 있으면 토글
        postsContainer.style.display = postsContainer.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * 폴더 아이템 HTML 요소 생성 함수
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

    // 포스트 컨테이너 찾기
    const postsContainer = document.querySelector(`.folder-posts[data-folder-id="${folderId}"]`);
    if (postsContainer) {
        postsContainer.remove();
    }

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
 * UI에 폴더 추가 함수 (계층 구조 지원)
 * @param {string} categoryId - 카테고리 ID
 * @param {Object} folder - 폴더 정보 객체
 */
export function addFolderToUI(categoryId, folder) {
    const folderList = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
    if (!folderList) return;

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