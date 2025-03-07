/**
 * 포스트 관련 스타일 모듈
 */

/**
 * 포스트 관련 스타일을 페이지에 추가하는 함수
 */
export function addPostStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* 포스트 목록 스타일 */
        .post-item {
            border-left: 3px solid #007bff;
            margin-bottom: 10px;
            transition: all 0.2s ease;
        }

        .post-item:hover {
            background-color: #f8f9fa;
            transform: translateX(3px);
        }

        .post-item.draft {
            border-left-color: #6c757d;
        }

        .post-date {
            font-size: 0.8rem;
            color: #6c757d;
        }

        .post-content-preview {
            color: #6c757d;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        .folder-link.active, .category-link.active {
            font-weight: bold;
            color: #007bff;
        }

        .draft-badge {
            background-color: #6c757d;
            color: white;
            font-size: 0.7rem;
            padding: 2px 5px;
            border-radius: 3px;
            margin-left: 5px;
        }
    `;
    document.head.appendChild(styleElement);
}