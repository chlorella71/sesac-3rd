/**
 * 마크다운 렌더링 관련 기능을 처리하는 모듈
 */

/**
 * 마크다운 텍스트를 HTML로 변환하여 지정된 요소에 렌더링
 * @param {string} elementId - 마크다운을 렌더링할 요소 ID
 * @param {string} dataAttribute - 마크다운 내용이 저장된 데이터 속성 이름 (기본값: 'data-content')
 */
export function renderMarkdown(elementId, dataAttribute = 'data-content') {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with ID "${elementId}" not found for markdown rendering`);
            return;
        }

        const content = element.getAttribute(dataAttribute);
        if (!content) {
            console.warn(`No content found in "${dataAttribute}" attribute`);
            return;
        }

        // marked.js가 로드되었는지 확인
        if (typeof marked !== 'undefined') {
            element.innerHTML = marked.parse(content);
        } else {
            console.error('marked.js library is not loaded');
            // 폴백: 일반 텍스트로 표시
            element.textContent = content;
        }
    } catch (error) {
        console.error('Error rendering markdown:', error);
    }
}

/**
 * 페이지의 모든 마크다운 요소 렌더링
 */
function renderAllMarkdown() {
    // 페이지에 있는 모든 markdown-content 요소 찾기
    const markdownElements = document.querySelectorAll('.markdown-body[id="markdown-content"]');
    markdownElements.forEach(element => {
        try {
            renderMarkdown(element.id);
        } catch (error) {
            console.error(`Error rendering markdown for element ${element.id}:`, error);
        }
    });
}

/**
 * DOM이 로드된 후 마크다운 렌더링 초기화
 */
export function initializeMarkdownRendering() {

    // DOM이 이미 로드되었는지 확인
    if (document.readyState === 'loading') {
        // 아직 로딩 중이면 이벤트 리스너 등록
        document.addEventListener('DOMContentLoaded', renderAllMarkdown);
    } else {
        // 이미 로드되었으면 바로 실행
        renderAllMarkdown();
    }

//    document.addEventListener('DOMContentLoaded', function() {
//        // 페이지에 있는 모든 markdown-content 요소 찾기
//        const markdownElements = document.querySelectorAll('.markdown-body[id="markdown-content"]');
//        markdownElements.forEach(element => {
//            try {
//                renderMarkdown(element.id);
//            } catch (error) {
//                console.error(`Error rendering markdown for element ${element.id}:`, error);
//            }
//        });
//    });
}

//// 직접 import되었을 때 자동으로 초기화
//initializeMarkdownRendering();