/**
 * 공통 페이지 기능 JavaScript
 * 모든 페이지에서 필요한 기본 기능만 초기화
 */

import { initializeDeleteHandlers } from "../features/delete.js";

/**
 * 공통 페이지 초기화 함수
 */
function initializeCommonPage() {
    console.log('공통 페이지 초기화');

    // 삭제 버튼 이벤트 핸들러 초기화
//    initializeDeleteHandlers();
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', initializeCommonPage);