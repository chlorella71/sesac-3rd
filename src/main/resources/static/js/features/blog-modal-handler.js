/**
 * 블로그 페이지의 모달 처리를 위한 메인 핸들러
 */
import { initializeModalEvents } from "../common/modal.js";
import { initializeCategoryHandlers } from "./category/category.js";
import { initializeFolderHandlers } from "./category/folder.js";
import { handleModalOpenClick } from "./modal-open-handler.js";

/**
 * 모든 모달 관련 초기화 함수
 */
function initializeAllModals() {
    // 기본 모달 이벤트 초기화
    initializeModalEvents();

    // 카테고리 기능 초기화
    initializeCategoryHandlers();

    // 폴더 기능 초기화
    initializeFolderHandlers();

    // 모달 열기 버튼 이벤트 초기화
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', handleModalOpenClick);
    });
}

// DOM이 로드되면 모든 모달 초기화
document.addEventListener('DOMContentLoaded', initializeAllModals);