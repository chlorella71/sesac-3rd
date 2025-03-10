/**
 * 향상된 블로그 페이지 스크립트
 * 동적 컨텐츠 로드 및 SPA 같은 사용자 경험 제공
 */

import { initializeModalEvents } from "../common/modal.js";
import { initializeCategoryHandlers } from "../features/category/category.js";
import { initializeFolderHandlers } from "../features/category/folder.js";
import { initializeFolderHierarchy } from "../features/category/folder-hierarchy.js";
import { handleModalOpenClick } from "../features/modal-open-handler.js";
import { showAllPosts } from "../features/post/post-ui-handler.js";
import { addPostStyles } from "../features/post/post-styles.js";

// 페이지 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 기본 모달 이벤트 초기화
    initializeModalEvents();

    // 카테고리 기능 초기화
    initializeCategoryHandlers();

    // 폴더 기능 초기화
    initializeFolderHandlers();

    // 폴더 계층 구조 초기화
    initializeFolderHierarchy();

    // 포스트 스타일 추가
    addPostStyles();

    // 모달 열기 버튼 이벤트 초기화
    document.querySelectorAll('.open-modal').forEach(button => {
        button.addEventListener('click', handleModalOpenClick);
    });

    // 초안 보기 버튼 이벤트 리스너
    const draftButton = document.getElementById('view-drafts');
    if (draftButton) {
        draftButton.addEventListener('click', function() {
            loadDraftPosts();
        });
    }

    // 전체 포스트 보기 버튼 이벤트 리스너
    const allPostsButton = document.getElementById('view-all-posts');
    if (allPostsButton) {
        allPostsButton.addEventListener('click', function() {
            showAllPosts();
        });
    }

    // 링크 클릭 이벤트 위임
    document.addEventListener('click', function(e) {
        // 포스트 링크 클릭 처리
        const postItem = e.target.closest('.post-item');
        if (postItem && postItem.tagName === 'A') {
            e.preventDefault();
            const href = postItem.getAttribute('href');
            const matches = href.match(/\/blog\/(\d+)\/post\/(\d+)/);

            if (matches) {
                const blogId = matches[1];
                const postId = matches[2];

                // 포스트 내용 로드
                loadPostContent(blogId, postId);

                // 히스토리 API로 URL 업데이트
                history.pushState({ type: 'post', blogId, postId }, '', href);
            }
        }

        // 블로그로 돌아가기 버튼 클릭 처리
        const backButton = e.target.closest('.back-to-blog');
        if (backButton) {
            e.preventDefault();
            const blogId = backButton.dataset.blogId || getBlogIdFromURL();

            // 블로그 메인으로 이동
            loadBlogContent(blogId);

            // 히스토리 API로 URL 업데이트
            history.pushState({ type: 'blog', blogId }, '', `/blog/${blogId}`);
        }

        // 카테고리 링크 클릭 처리
        const categoryLink = e.target.closest('.category-link');
        if (categoryLink) {
            const categoryId = categoryLink.dataset.categoryId;
            if (categoryId) {
                // 클릭 이벤트 계속 진행 (기존 카테고리 처리 함수 실행)
                // 그러나 URL은 업데이트
                const blogId = getBlogIdFromURL();
                history.pushState(
                    { type: 'category', blogId, categoryId },
                    '',
                    `/blog/${blogId}?category=${categoryId}`
                );
            }
        }

        // 폴더 링크 클릭 처리
        const folderLink = e.target.closest('.folder-name');
        if (folderLink) {
            const folderItem = folderLink.closest('.folder-item');
            if (folderItem) {
                const folderId = folderItem.dataset.folderId;
                if (folderId) {
                    // 클릭 이벤트 계속 진행 (기존 폴더 처리 함수 실행)
                    // 그러나 URL은 업데이트
                    const blogId = getBlogIdFromURL();
                    history.pushState(
                        { type: 'folder', blogId, folderId },
                        '',
                        `/blog/${blogId}?folder=${folderId}`
                    );
                }
            }
        }
    });

    // 브라우저 뒤로가기/앞으로가기 이벤트 처리
    window.addEventListener('popstate', function(event) {
        const state = event.state;

        if (state) {
            // 상태에 따른 컨텐츠 로드
            if (state.type === 'post') {
                loadPostContent(state.blogId, state.postId);
            } else if (state.type === 'blog') {
                loadBlogContent(state.blogId);
            }
            // 카테고리와 폴더 상태는 URL 파라미터로만 추적하고
            // 실제 액션은 다른 이벤트 핸들러에서 처리
        } else {
            // 상태가 없는 경우 현재 URL에서 판단하여 처리
            handleCurrentURL();
        }
    });

    // 초기 URL 처리
    handleCurrentURL();

    // 기본적으로 블로그 컨텐츠 및 포스트 로드 - 여기에 코드 추가
    const blogId = getBlogIdFromURL();
    if (blogId) {
        showAllPosts();
    }
});

/**
 * 현재 URL에 따라 적절한 컨텐츠 로드
 */
function handleCurrentURL() {
    const path = window.location.pathname;
    const blogId = getBlogIdFromURL();

    if (!blogId) return;

    // URL 파라미터 파싱
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    const folderId = urlParams.get('folder');

    // URL이 포스트 상세 URL인지 확인
    const postMatch = path.match(/\/blog\/(\d+)\/post\/(\d+)/);

    if (postMatch) {
        // 포스트 상세 페이지
        const postId = postMatch[2];
        loadPostContent(blogId, postId);
        // 히스토리 상태 업데이트
        history.replaceState({ type: 'post', blogId, postId }, '', path);
    } else if (categoryId) {
        // 카테고리 선택 상태
        // 카테고리 링크를 프로그래밍 방식으로 클릭
        const categoryLink = document.querySelector(`.category-link[data-category-id="${categoryId}"]`);
        if (categoryLink) {
            categoryLink.click();
        }
        // 히스토리 상태 업데이트
        history.replaceState({ type: 'category', blogId, categoryId }, '', path + `?category=${categoryId}`);
    } else if (folderId) {
        // 폴더 선택 상태
        // 폴더 링크를 프로그래밍 방식으로 클릭
        const folderItem = document.querySelector(`.folder-item[data-folder-id="${folderId}"]`);
        if (folderItem) {
            const folderLink = folderItem.querySelector('.folder-name');
            if (folderLink) {
                folderLink.click();
            }
        }
        // 히스토리 상태 업데이트
        history.replaceState({ type: 'folder', blogId, folderId }, '', path + `?folder=${folderId}`);
    } else {
        // 기본 블로그 메인 페이지
        // 히스토리 상태 업데이트
        history.replaceState({ type: 'blog', blogId }, '', path);
        // 전체 포스트 로드
        showAllPosts();
    }
}

/**
 * 포스트 내용 로드 함수
 * @param {string} blogId - 블로그 ID
 * @param {string} postId - 포스트 ID
 */
function loadPostContent(blogId, postId) {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    // 로딩 인디케이터 표시
    contentArea.innerHTML = `
        <div class="loading-indicator">
            <i class="bi bi-hourglass-split"></i>
            <p>포스트를 불러오는 중...</p>
        </div>
    `;

    // 포스트 내용 요청
    fetch(`/blog/${blogId}/post/${postId}/content`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;

            // 삭제 버튼 이벤트 재설정
            setupDeleteButtonEvents();

            // 포스트 상세 페이지 이벤트 설정 추가
            setupPostDetailEvents();
        })
        .catch(error => {
            console.error('포스트 내용 로드 오류:', error);
            contentArea.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i>
                    포스트를 불러오는 중 오류가 발생했습니다: ${error.message}
                </div>
                <div class="text-center mt-3">
                    <a href="/blog/${blogId}" class="btn btn-outline-secondary">
                        <i class="bi bi-arrow-left"></i> 블로그로 돌아가기
                    </a>
                </div>
            `;
        });
}

/**
 * 블로그 메인 컨텐츠 로드 함수
 * @param {string} blogId - 블로그 ID
 */
function loadBlogContent(blogId) {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    // 로딩 인디케이터 표시
    contentArea.innerHTML = `
        <div class="loading-indicator">
            <i class="bi bi-hourglass-split"></i>
            <p>블로그 내용을 불러오는 중...</p>
        </div>
    `;

    // 블로그 메인 내용 요청
    fetch(`/blog/${blogId}/content`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP 오류: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            contentArea.innerHTML = html;

            // 포스트 목록 로드
            showAllPosts();
        })
        .catch(error => {
            console.error('블로그 내용 로드 오류:', error);
            contentArea.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i>
                    블로그 내용을 불러오는 중 오류가 발생했습니다: ${error.message}
                </div>
            `;
        });
}

/**
 * 초안 포스트 로드 함수
 */
function loadDraftPosts() {
    const blogId = getBlogIdFromURL();
    if (!blogId) return;

    // 포스트 컨테이너 참조
    const postList = document.getElementById('post-list');
    const postInfoMessage = document.getElementById('post-info-message');
    const containerTitle = document.getElementById('post-container-title');

    if (!postList || !postInfoMessage || !containerTitle) return;

    // 로딩 메시지 표시
    postInfoMessage.textContent = '초안을 불러오는 중...';
    postInfoMessage.style.display = 'block';
    postList.innerHTML = '';
    containerTitle.textContent = '초안 포스트';

    // 모든 active 클래스 제거
    document.querySelectorAll('.folder-link.active, .category-link.active').forEach(el => {
        el.classList.remove('active');
    });

    // API 호출
    fetch(`/blog/${blogId}/drafts`)
        .then(response => {
            if (response.status === 403) {
                throw new Error('초안을 볼 수 있는 권한이 없습니다.');
            }
            if (!response.ok) {
                throw new Error('초안을 불러오는데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                if (data.posts && data.posts.length > 0) {
                    renderPosts(data.posts, postList);
                    postInfoMessage.style.display = 'none';
                } else {
                    postInfoMessage.textContent = '저장된 초안이 없습니다.';
                    postInfoMessage.style.display = 'block';
                }
            } else {
                throw new Error(data.message || '초안을 불러오는데 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('초안 로드 오류:', error);
            postInfoMessage.textContent = error.message;
            postInfoMessage.style.display = 'block';
        });
}

/**
 * 포스트 목록 렌더링 함수
 * @param {Array} posts - 포스트 배열
 * @param {HTMLElement} container - 표시할 컨테이너
 */
function renderPosts(posts, container) {
    // 컨테이너 초기화
    container.innerHTML = '';

    // 포스트가 없는 경우
    if (!posts || posts.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'alert alert-info';
        emptyMessage.textContent = '포스트가 없습니다.';
        container.appendChild(emptyMessage);
        return;
    }

    // 포스트 목록 렌더링
    posts.forEach(post => {
        const postItem = document.createElement('a');
        postItem.href = `/blog/${post.blogId}/post/${post.id}`;
        postItem.className = `list-group-item list-group-item-action post-item ${post.draft ? 'draft' : ''}`;

        // 포스트 내용 HTML
        postItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">
                    ${post.title}
                    ${post.draft ? '<span class="draft-badge">초안</span>' : ''}
                </h5>
                <small class="post-date">${post.formattedRegdate}</small>
            </div>
            <p class="mb-1 post-content-preview">${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">폴더: ${post.folderName}</small>
                <small class="text-muted">카테고리: ${post.categoryName}</small>
            </div>
        `;

        container.appendChild(postItem);
    });
}

/**
 * URL에서 블로그 ID 추출
 * @returns {string|null} 블로그 ID 또는 null
 */
function getBlogIdFromURL() {
    const path = window.location.pathname;
    const match = path.match(/\/blog\/(\d+)/);
    return match ? match[1] : null;
}

/**
 * 삭제 버튼 이벤트 설정
 */
function setupDeleteButtonEvents() {
    document.querySelectorAll('.delete').forEach(function(element) {
        element.addEventListener('click', function() {
            if(confirm('정말로 삭제하시겠습니까?')) {
                location.href = this.dataset.uri;
            }
        });
    });
}

/**
 * 초안 발행 함수
 * @param {string} blogId - 블로그 ID
 * @param {string} postId - 포스트 ID
 */
function publishDraft(blogId, postId) {
    // CSRF 토큰 가져오기
    const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

    if (!csrfToken || !csrfHeader) {
        alert('인증 정보를 찾을 수 없습니다. 로그인 후 다시 시도해주세요.');
        return;
    }

    // API 호출
    fetch(`/blog/${blogId}/post/${postId}/publish`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [csrfHeader]: csrfToken
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert(data.message);
            // 페이지 새로고침
            window.location.reload();
        } else {
            throw new Error(data.message || '포스트 발행 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('발행 오류:', error);
        alert(error.message || '포스트 발행 중 오류가 발생했습니다.');
    });
}

function setupPostDetailEvents() {
    // 발행 버튼 이벤트 리스너
    const publishButton = document.getElementById('publish-draft');
    if (publishButton) {
        publishButton.addEventListener('click', function() {
            const blogId = this.dataset.blogId;
            const postId = this.dataset.postId;

            if (confirm('이 초안을 발행하시겠습니까? 발행된 포스트는 모든 사용자에게 공개됩니다.')) {
                publishDraft(blogId, postId);
            }
        });
    }

    // 다른 이벤트 리스너들...
}