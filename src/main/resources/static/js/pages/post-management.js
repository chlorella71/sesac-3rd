import { initializeModalEvents } from "../common/modal.js";
import { initializeMarkdownPreview } from "../features/markdown/markdown-ui.js";
import { initializeMarkdownEditor } from "../features/markdown/markdown-editor.js";
import { initializeDraftHandlers, setupDraftPublishHandler } from '../features/post/draft.js';

function initializePostPage(pageType) {
    console.log(`포스트 ${pageType} 페이지 초기화`);

    // 기본 모달 이벤트 초기화
    initializeModalEvents();

    // 마크다운 에디터 초기화
    initializeMarkdownEditor();

    // 마크다운 미리보기 초기화
    initializeMarkdownPreview();

    // 초안 관련 핸들러 초기화
    initializeDraftHandlers();
    setupDraftPublishHandler();
}

// 페이지별 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 페이지 URL에 따라 다른 초기화
    const path = window.location.pathname;

    if (path.includes('/post/create')) {
        initializePostPage('작성');
    } else if (path.includes('/post/') && path.includes('/edit')) {
        initializePostPage('수정');
    }
});