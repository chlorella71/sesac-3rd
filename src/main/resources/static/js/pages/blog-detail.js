/**
 * 블로그 상세 페이지 전용 JavaScript
 * 블로그 상세 페이지에서 필요한 기능만 초기화
 */

import { initializeModalEvents } from "../common/modal.js";
import { initializeCategoryHandlers } from "../features/category/category.js";
import { initializeFolderHandlers } from "../features/category/folder.js";
import { handleModalOpenClick } from "../features/modal-open-handler.js";
import { initializeFolderHierarchy } from "../features/category/folder-hierarchy.js";


/**
 * 블로그 상세 페이지 초기화 함수
 */
function initializeBlogDetailPage() {
    console.log('블로그 상세 페이지 초기화');

    // 기본 모달 이벤트 초기화
    initializeModalEvents();

    // 카테고리 기능 초기화
    initializeCategoryHandlers();

    // 폴더 기능 초기화
    initializeFolderHandlers();

    // 폴더 계층 구조 초기화
    initializeFolderHierarchy();

    // 모달 열기 버튼 이벤트 초기화
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', handleModalOpenClick);
    });
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', initializeBlogDetailPage);