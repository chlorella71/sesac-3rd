/**
 * 폴더 계층 구조 코어 로직
 * 파일 경로: /static/js/features/category/folder-hierarchy-core.js
 */

import { createElement } from "../../utils/dom.js";
import { loadFolders } from "./folder-api.js";
import { createFolderItemElement, handleFolderClick } from "./folder-ui-handler.js";
import { addSidebarPostStyles } from "../post/post-folder-view.js";

/**
 * 폴더 계층 구조 초기화 함수
 */
export function initializeFolderHierarchy() {
    // 폴더 클릭 이벤트 위임
    document.addEventListener('click', function(e) {
        const folderLink = e.target.closest('.folder-name');
        if (folderLink) {
            handleFolderClick(e);
        }
    });

    // 하위 폴더 추가 버튼 이벤트 위임
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

        // 이벤트 발생 - 하위 폴더 생성 모달 표시 요청
        const event = new CustomEvent('openSubfolderModal', {
            detail: { categoryId, folderId, folderName }
        });
        document.dispatchEvent(event);
    });

    // 사이드바 포스트 스타일 추가
    addSidebarPostStyles();
}

/**
 * 카테고리 내 폴더 목록 로드 및 계층 구조 렌더링
 * @param {string} categoryId - 카테고리 ID
 */
export function loadFolderHierarchy(categoryId) {
    const folderListElement = document.querySelector(`.folder-list[data-category-id="${categoryId}"]`);
    if (!folderListElement) return;

    // 로딩 표시
    folderListElement.innerHTML = '<div class="text-center py-2"><small>폴더를 불러오는 중...</small></div>';

    // 폴더 목록 로드
    loadFolders(
        categoryId,
        // 성공 콜백
        (folders) => {
            // 데이터 로드 완료 표시
            folderListElement.dataset.loaded = 'true';

            // 폴더 목록 계층 구조 렌더링
            renderFolderHierarchy(categoryId, folders);
        },
        // 실패 콜백
        (errorMessage) => {
            folderListElement.innerHTML = `
                <div class="alert alert-danger py-2 my-2">
                    <small>폴더 목록을 불러오지 못했습니다: ${errorMessage}</small>
                </div>
            `;
        }
    );
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