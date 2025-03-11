/**
 * 폴더카테고리 모듈 진입점
 * 카테고리와 폴더 관련 모든 기능을 초기화합니다.
 */
import { initializeCategoryHandlers } from "./foldercategory.js";
import { initializeFolderHandlers, toggleFolderList } from "./folder.js";
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

}

/**
 * 초기 카테고리 토글 상태 설정
 */
function initializeToggleState() {
    // URL 파라미터에서 오픈할 카테고리 ID 확인
    const urlParams = new URLSearchParams(window.location.search);
    const openCategoryId = urlParams.get('category');

    // 모든 카테고리 처리
    const categoryItems = document.querySelectorAll('.list-group-item[data-category-id]');

    if (openCategoryId) {
        // URL에 지정된 카테고리 자동 펼침
        const targetCategory = document.querySelector(`.list-group-item[data-category-id="${openCategoryId}"]`);
        if (targetCategory) {
            toggleFolderList(openCategoryId);
        }
    }
}
