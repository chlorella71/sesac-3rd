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

/**
 * 마크다운 미리보기 기능을 처리하는 모듈
 */
export function initializeMarkdownPreview(
    contentElementId = 'content',
    previewElementId = 'preview-content',
    refreshButtonId = 'refreshPreview'
) {
    const contentElement = document.getElementById(contentElementId);
    const previewElement = document.getElementById(previewElementId);
    const refreshButton = document.getElementById(refreshButtonId);

    if (!contentElement || !previewElement) {
        console.warn('Markdown preview elements not found');
        return;
    }

    function updatePreview() {
        const content = contentElement.value;

        // CSRF 토큰 설정
        const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');

        // 서버 측 마크다운 변환 요청
        fetch('/markdown/preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(csrfToken && csrfHeader ? { [csrfHeader]: csrfToken } : {})
            },
            body: JSON.stringify({ markdown: content })
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorText => {
                    throw new Error(errorText || '마크다운 변환 중 오류가 발생했습니다.');
                });
            }
            return response.text();
        })
        .then(html => {
            previewElement.innerHTML = html;
        })
        .catch(error => {
            // 폴백: 클라이언트 측 변환
            console.warn('Server-side markdown preview failed:', error);
            if (typeof marked !== 'undefined') {
                previewElement.innerHTML = marked.parse(content);
            }
        });
    }

    // 내용 변경 시 미리보기 업데이트
    contentElement.addEventListener('input', updatePreview);

    // 미리보기 새로고침 버튼
    if (refreshButton) {
        refreshButton.addEventListener('click', updatePreview);
    }

    // 초기 미리보기 로드
    updatePreview();
}



//// 직접 import되었을 때 자동으로 초기화
//initializeMarkdownRendering();