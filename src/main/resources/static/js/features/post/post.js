/**
 * 포스트 관련 기능을 처리하는 모듈
 */
import { getBlogIdFromURL } from "../../utils/dom.js";

/**
 * 블로그의 모든 포스트 로드 함수
 * @param {Function} onSuccess - 성공 시 콜백 함수
 * @param {Function} onError - 실패 시 콜백 함수
 */
export function loadBlogPosts(onSuccess, onError) {
    const blogId = getBlogIdFromURL();
    if (!blogId) return;

    // API 호출
    fetch(`/blog/${blogId}/posts`)
        .then(response => {
            if (!response.ok) {
                throw new Error('포스트를 불러오는데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (onSuccess) onSuccess(data.posts);
        })
        .catch(error => {
            console.error('포스트 로드 오류:', error);
            if (onError) onError(error.message);
        });
}

/**
 * 특정 폴더의 포스트 로드 함수
 * @param {string} folderId - 폴더 ID
 * @param {Function} onSuccess - 성공 시 콜백 함수
 * @param {Function} onError - 실패 시 콜백 함수
 */
export function loadFolderPosts(folderId, onSuccess, onError) {
    const blogId = getBlogIdFromURL();
    if (!blogId || !folderId) return;

    // API 호출
    fetch(`/blog/${blogId}/folder/${folderId}/posts`)
        .then(response => {
            if (!response.ok) {
                throw new Error('포스트를 불러오는데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (onSuccess) onSuccess(data.posts);
        })
        .catch(error => {
            console.error('폴더 포스트 로드 오류:', error);
            if (onError) onError(error.message);
        });
}

/**
 * 특정 카테고리의 포스트 로드 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {Function} onSuccess - 성공 시 콜백 함수
 * @param {Function} onError - 실패 시 콜백 함수
 */
export function loadCategoryPosts(categoryId, onSuccess, onError) {
    const blogId = getBlogIdFromURL();
    if (!blogId || !categoryId) return;

    // API 호출
    fetch(`/blog/${blogId}/category/${categoryId}/posts`)
        .then(response => {
            if (!response.ok) {
                throw new Error('포스트를 불러오는데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (onSuccess) onSuccess(data.posts);
        })
        .catch(error => {
            console.error('카테고리 포스트 로드 오류:', error);
            if (onError) onError(error.message);
        });
}

/**
 * 포스트 목록 렌더링 함수
 * @param {Array} posts - 포스트 배열
 * @param {HTMLElement} container - 표시할 컨테이너
 * @param {HTMLElement} infoElement - 정보 메시지 요소
 */
export function renderPosts(posts, container, infoElement) {
    // 컨테이너 초기화
    container.innerHTML = '';

    // 포스트가 없는 경우
    if (!posts || posts.length === 0) {
        infoElement.textContent = '포스트가 없습니다.';
        infoElement.style.display = 'block';
        return;
    }

    // 정보 메시지 숨기기
    infoElement.style.display = 'none';

    // 포스트 목록 렌더링
    posts.forEach(post => {
        const postItem = document.createElement('a');
        postItem.href = `/blog/${post.blogId}/post/${post.id}`;
        postItem.className = `list-group-item list-group-item-action post-item ${post.draft ? 'draft' : ''}`;

        // 마크다운으로 미리보기 내용 변환
        let previewContent = post.content.substring(0, 150);
        if (post.content.length > 150) previewContent += '...';

        // marked.js가 로드되었는지 확인하고 마크다운 적용
        let contentPreview = previewContent;
        try {
            if (typeof marked !== 'undefined') {
                // 마크다운을 HTML로 변환
                const parsedHTML = marked.parse(previewContent);

                // HTML 태그 제거 (순수 텍스트로 표시)
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = parsedHTML;
                contentPreview = tempDiv.textContent || tempDiv.innerText || previewContent;
            }
        } catch (error) {
            console.warn('마크다운 변환 중 오류:', error);
            // 오류 발생 시 원본 텍스트 사용
            contentPreview = previewContent;
        }


        // 포스트 내용 HTML
        postItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">
                    ${post.title}
                    ${post.draft ? '<span class="draft-badge">초안</span>' : ''}
                </h5>
                <small class="post-date">${post.formattedRegdate}</small>
            </div>
            <p class="mb-1 post-content-preview">${contentPreview}</p>
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">폴더: ${post.folderName}</small>
                <small class="text-muted">카테고리: ${post.categoryName}</small>
            </div>
        `;

        container.appendChild(postItem);
    });
}