/**
 * 폴더/카테고리 설정 페이지 전용 JavaScript
 * 설정 페이지에서 필요한 기능만 초기화
 */

import { initializeDeleteHandlers } from "../features/delete.js";
import { initializeModalEvents } from "../common/modal.js";
import { initializeFolderCategory } from "../features/foldercategory/index.js";

/**
 * 폴더/카테고리 설정 페이지 초기화 함수
 */
function initializeCategorySettingsPage() {
    console.log('카테고리 설정 페이지 초기화');

    // 삭제 버튼 이벤트 핸들러 초기화
    initializeDeleteHandlers();

    // 모달 이벤트 초기화
    initializeModalEvents();

    // 폴더 카테고리 기능 초기화
    initializeFolderCategory();

}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', initializeCategorySettingsPage);