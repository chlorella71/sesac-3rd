/**
 * 폴더카테고리 모듈 진입점
 * 카테고리와 폴더 관련 모든 기능을 초기화합니다.
 */
import { initializeCategoryHandlers } from "./foldercategory.js";
import { initializeFolderHandlers, loadFolders, toggleFolderList } from "./folder.js";
import { initializeModalEvents } from "../../common/modal.js";

/**
 * 폴더카테고리 관련 모든 기능 초기화
 */
export function initializeFolderCategory() {
    // 모달 이벤트 초기화
    initializeModalEvents();

    // 카테고리 핸들러 초기화
    initializeCategoryHandlers();

    // 폴더 핸들러 초기화
    initializeFolderHandlers();

    // 초기 카테고리 토글 상태 설정
    initializeToggleState();

    console.log('폴더카테고리 모듈 초기화 완료');
}

/**
 * 초기 카테고리 토글 상태 설정
 */
function initializeToggleState() {
    // URL 파라미터에서 오픈할 카테고리 ID 확인
    const urlParams = new URLSearchParams(window.location.search);
    const openCategoryId = urlParams.get('category');

    if (openCategoryId) {
        // URL에 지정된 카테고리 자동 펼침
        setTimeout(() => {
            toggleFolderList(openCategoryId);
        }, 100);
    } else {
        // 첫 번째 카테고리 자동 펼침 (선택적)
        const firstCategory = document.querySelector('.list-group-item[data-category-id]');
        if (firstCategory) {
            const categoryId = firstCategory.dataset.categoryId;
            setTimeout(() => {
                toggleFolderList(categoryId);
            }, 100);
        }
    }
}

// 필요한 함수들 내보내기
export {
    loadFolders,
    toggleFolderList
};