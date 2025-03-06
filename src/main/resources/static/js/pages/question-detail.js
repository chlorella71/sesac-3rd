/**
 * 질문 상세 페이지 전용 JavaScript
 * 질문 상세 페이지에서 필요한 기능만 초기화
 */

import { initializeDeleteHandlers } from "../features/delete.js";
import { initializeModalEvents } from "../common/modal.js";
import { initializeLikeHandlers } from "../features/like.js";
import { initializeTooltips } from "../features/tooltip.js";
import { handleModalOpenClick } from "../features/modal-open-handler.js";

/**
 * 질문 상세 페이지 초기화 함수
 */
function initializeQuestionDetailPage() {
    console.log('질문 상세 페이지 초기화');

    // 삭제 버튼 이벤트 핸들러 초기화
//    initializeDeleteHandlers();

    // 모달 이벤트 초기화
    initializeModalEvents();

    // 좋아요 기능 초기화
    initializeLikeHandlers();

    // 툴팁 기능 초기화
    initializeTooltips();

    // 모달 열기 버튼 이벤트 초기화
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', handleModalOpenClick);
    });
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', initializeQuestionDetailPage);