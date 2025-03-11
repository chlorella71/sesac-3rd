/**
 * 마크다운 에디터 관련 기능을 처리하는 모듈
 */

/**
 * 마크다운 에디터 초기화 함수
 * @param {string} editorElementId - 에디터 요소 ID
 * @param {string} previewElementId - 미리보기 요소 ID
 * @param {Object} config - 에디터 설정 (선택적)
 * @returns {Object} 초기화된 EasyMDE 인스턴스
 */
export function initializeMarkdownEditor(editorElementId = 'content', previewElementId = 'preview-content', config = {}) {
    const editorElement = document.getElementById(editorElementId);
    if (!editorElement) {
        console.warn(`Editor element with ID "${editorElementId}" not found`);
        return null;
    }

    // 기본 설정과 사용자 설정 병합
    const defaultConfig = {
        element: editorElement,
        spellChecker: false,
        autosave: {
            enabled: true,
            uniqueId: 'post-edit-autosave',
            delay: 1000,
        },
        toolbar: [
            'bold', 'italic', 'heading', '|',
            'quote', 'code', 'unordered-list', 'ordered-list', '|',
            'link', 'image', '|',
            'preview', 'side-by-side', 'fullscreen', '|',
            'guide'
        ],
        placeholder: '마크다운 형식으로 글을 작성해보세요...',
        status: ['autosave', 'words', 'lines', 'cursor']
    };

    const mergedConfig = { ...defaultConfig, ...config };

    // EasyMDE가 로드되었는지 확인
    if (typeof EasyMDE === 'undefined') {
        console.error('EasyMDE library is not loaded');
        return null;
    }

    // 에디터 초기화
    try {
        const easyMDE = new EasyMDE(mergedConfig);

        // 미리보기 요소가 존재하는 경우 이벤트 핸들러 설정
        const previewElement = document.getElementById(previewElementId);
        if (previewElement) {
            // 미리보기 업데이트 함수
            const updatePreview = () => {
                const content = easyMDE.value();
                if (typeof marked !== 'undefined' && previewElement) {
                    previewElement.innerHTML = marked.parse(content);
                }
            };

            // 내용이 변경될 때마다 미리보기 업데이트
            easyMDE.codemirror.on('change', updatePreview);

            // 초기 미리보기 로드
            updatePreview();

            // 미리보기 새로고침 버튼 이벤트 설정
            const refreshButton = document.getElementById('refreshPreview');
            if (refreshButton) {
                refreshButton.addEventListener('click', updatePreview);
            }
        }

        return easyMDE;
    } catch (error) {
        console.error('Error initializing markdown editor:', error);
        return null;
    }
}

/**
 * DOM이 로드된 후 마크다운 에디터 초기화
 */
export function initializeEditor() {
    document.addEventListener('DOMContentLoaded', function() {
        // post_form.html 또는 post_edit.html인 경우에만 에디터 초기화
        const contentElement = document.getElementById('content');
        const previewElement = document.getElementById('preview-content');

        if (contentElement && previewElement) {
            initializeMarkdownEditor('content', 'preview-content');
        }
    });
}

// 직접 import되었을 때 자동으로 초기화
//initializeEditor();