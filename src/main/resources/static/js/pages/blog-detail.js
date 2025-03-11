/**
 * 블로그 상세 페이지 전용 JavaScript
 * 블로그 상세 페이지에서 필요한 기능만 초기화
 */

import { initializeModalEvents } from "../common/modal.js";
import { initializeFolderCategory, toggleFolderList } from "../features/foldercategory/index.js";
import { handleModalOpenClick } from "../features/modal-open-handler.js";
import { initializePostUIHandlers } from "../features/post/post-ui-handler.js";
import { addPostStyles } from "../features/post/post-styles.js";
import { initializeMarkdownRendering } from "../features/markdown/markdown-ui.js";
import { initializeDraftHandlers } from '../features/post/draft.js';


/**
 * 블로그 상세 페이지 초기화 함수
 */
function initializeBlogDetailPage() {
    console.log('블로그 상세 페이지 초기화');

    // 기본 모달 이벤트 초기화
    initializeModalEvents();

    // 폴더카테고리 관련 이벤트 초기화
    initializeFolderCategory();

    // 마크다운 렌더링 초기화
    initializeMarkdownRendering();

    // 포스트 UI 핸들러 초기화
    initializePostUIHandlers();

    // 포스트 스타일 추가
    addPostStyles();

    // 모달 열기 버튼 이벤트 초기화
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', handleModalOpenClick);
    });

   // 초안 관련 핸들러 초기화
   initializeDraftHandlers();

}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', initializeBlogDetailPage);