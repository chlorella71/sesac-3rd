/**
 * 블로그 상세 페이지 전용 JavaScript
 * 블로그 상세 페이지에서 필요한 기능만 초기화
 */

import { initializeModalEvents } from "../common/modal.js";
import { initializeFolderCategory, toggleFolderList } from "../features/foldercategory/index.js";
import { handleModalOpenClick } from "../features/modal-open-handler.js";
import { initializePostUIHandlers } from "../features/post/post-ui-handler.js";
import { addPostStyles } from "../features/post/post-styles.js";

/**
 * 블로그 상세 페이지 초기화 함수
 */
function initializeBlogDetailPage() {
    console.log('블로그 상세 페이지 초기화');

    // 기본 모달 이벤트 초기화
    initializeModalEvents();

    // 폴더카테고리 관련 이벤트 초기화
    initializeFolderCategory();

    // 포스트 UI 핸들러 초기화
    initializePostUIHandlers();

    // 포스트 스타일 추가
    addPostStyles();

    // 모달 열기 버튼 이벤트 초기화
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', handleModalOpenClick);
    });

    // 카테고리 클릭 이벤트 핸들러를 직접 등록 (이벤트 위임 방식으로 변경)
    document.addEventListener('click', function(e) {
        const categoryLink = e.target.closest('.category-name');
        if (categoryLink) {
            e.preventDefault();

            const categoryItem = categoryLink.closest('.list-group-item');
            if (categoryItem) {
                const categoryId = categoryItem.dataset.categoryId;
                if (categoryId) {
                    console.log('카테고리 클릭:', categoryId);
                    toggleFolderList(categoryId);
                }
            }
        }
    });

    // 페이지 로드 시 자동으로 첫 번째 카테고리 펼치기 (선택적)
    setTimeout(() => {
        const firstCategory = document.querySelector('.list-group-item[data-category-id]');
        if (firstCategory) {
            const categoryId = firstCategory.dataset.categoryId;
            if (categoryId) {
                console.log('첫 번째 카테고리 자동 펼침:', categoryId);
                toggleFolderList(categoryId);
            }
        }
    }, 500); // DOM이 완전히 렌더링 된 후 실행하기 위해 약간의 지연 추가
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', initializeBlogDetailPage);