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
            enabled: true,  // 자동 저장 활성화
            uniqueId: 'post-edit-autosave', // 저장 키 (개발중엔 로컬스토리지)
            delay: 1000,    // 1초마다 저장
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

        // EasyMDE 인스턴스를 전역 변수로 저장 (beforeunload 이벤트에서 사용하기 위함)
        window.easyMDE = easyMDE;

        // 로컬 스토리지에서 자동 저장된 내용 복원
        setTimeout(() => {
            const savedContent = localStorage.getItem('post-edit-autosave');
            if (savedContent) {
                console.log("📂 복원할 데이터:", savedContent);
                easyMDE.value(savedContent);
            }
        }, 500);

        // 자동 저장 기능 추가 (미리보기 모드에서는 저장 안 함)
        setInterval(() => {
            if (!isPreviewActive(easyMDE)) { // 미리보기 상태에서는 저장하지 않음
                console.log('🔥 자동 저장 실행됨:', easyMDE.value());
                localStorage.setItem('post-edit-autosave', easyMDE.value());
            }
        }, 1000);

        // 사용자가 페이지를 떠나기 전 현재 내용을 저장
        window.addEventListener('beforeunload', function (e) {
            // EasyMDE 에디터 내용 가져오기
            const content = easyMDE.value();

            // 로컬 스토리지에 에디터 내용 저장
            localStorage.setItem('post-edit-autosave', content);

            // 브라우저 기본 동작 수행 (사용자에게 경고)
            e.preventDefault();
            e.returnValue = ''; // 일부 브라우저에서 경고창을 띄우기 위한 코드
        });

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
 * 미리보기 모드인지 확인하는 함수
 * @param {Object} easyMDE - EasyMDE 인스턴스
 * @returns {boolean} 미리보기 모드 여부
 */
function isPreviewActive(easyMDE) {
    return easyMDE.isPreviewActive();
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