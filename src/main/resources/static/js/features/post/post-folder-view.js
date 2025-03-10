/**
 * 폴더별 포스트 목록 컴포넌트
 * 파일 경로: /static/js/features/post/post-folder-view.js
 */

import { getBlogIdFromURL } from "../../utils/dom.js";

/**
 * 폴더의 포스트 목록을 사이드바에 로드하는 함수
 * @param {string} folderId - 폴더 ID
 * @param {HTMLElement} container - 포스트 목록을 표시할 컨테이너
 */
export function loadFolderPostsList(folderId, container) {
    const blogId = getBlogIdFromURL();
    if (!blogId || !folderId) {
        console.error('블로그 ID 또는 폴더 ID가 없습니다.');
        container.innerHTML = '<div class="text-danger small">포스트를 불러올 수 없습니다.</div>';
        return;
    }

    // 로딩 표시
    container.innerHTML = '<div class="text-center py-2"><small>포스트를 불러오는 중...</small></div>';

    // AJAX 요청으로 폴더의 포스트 목록 가져오기
    fetch(`/blog/${blogId}/folder/${folderId}/posts`)
        .then(response => {
            if (!response.ok) {
                throw new Error('포스트를 불러오는데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.posts && data.posts.length > 0) {
                // 포스트 목록 렌더링
                renderFolderPostsList(container, data.posts, folderId);
            } else {
                // 포스트가 없는 경우
                container.innerHTML = '<div class="text-muted small ps-2">포스트가 없습니다.</div>';
            }
        })
        .catch(error => {
            console.error('폴더 포스트 로드 오류:', error);
            container.innerHTML = '<div class="text-danger small ps-2">포스트 로드 실패</div>';
        });
}

/**
 * 폴더 포스트 목록을 사이드바에 렌더링하는 함수
 * @param {HTMLElement} container - 포스트 목록을 표시할 컨테이너
 * @param {Array} posts - 포스트 목록
 * @param {string} folderId - 폴더 ID
 */
function renderFolderPostsList(container, posts, folderId) {
    // 최대 5개만 표시
    const maxPosts = Math.min(posts.length, 5);
    const postsList = document.createElement('ul');
    postsList.className = 'list-unstyled ps-2 mb-0';

    for (let i = 0; i < maxPosts; i++) {
        const post = posts[i];
        const postItem = document.createElement('li');
        postItem.className = 'sidebar-post-item py-1';

        const postLink = document.createElement('a');
        postLink.href = `/blog/${post.blogId}/post/${post.id}`;
        postLink.className = 'text-decoration-none text-truncate d-block sidebar-post-link';
        postLink.title = post.title;
        postLink.dataset.postId = post.id;

        // 포스트 제목 (초안인 경우 표시)
        postLink.innerHTML = `
            <i class="bi bi-file-text me-1 small"></i>
            <span class="small">${post.title}</span>
            ${post.draft ? '<span class="badge bg-secondary ms-1 small">초안</span>' : ''}
        `;

        // 이벤트 리스너 추가
        postLink.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = this.dataset.postId;
            const blogId = getBlogIdFromURL();

            // 포스트 콘텐츠 로드
            loadPostContent(blogId, postId);

            // 히스토리 API로 URL 업데이트
            history.pushState(
                { type: 'post', blogId, postId },
                '',
                `/blog/${blogId}/post/${postId}`
            );
        });

        postItem.appendChild(postLink);
        postsList.appendChild(postItem);
    }

    // 더 많은 포스트가 있는 경우 "더 보기" 링크 추가
    if (posts.length > maxPosts) {
        const moreItem = document.createElement('li');
        moreItem.className = 'text-center mt-1';

        const moreLink = document.createElement('a');
        moreLink.href = '#';
        moreLink.className = 'text-primary small';
        moreLink.textContent = `외 ${posts.length - maxPosts}개 더보기`;

        // 더보기 클릭 시 메인 컨텐츠 영역에 모든 포스트 표시
        moreLink.addEventListener('click', function(e) {
            e.preventDefault();
            loadFolderPostsContent(folderId);
        });

        moreItem.appendChild(moreLink);
        postsList.appendChild(moreItem);
    }

    container.innerHTML = '';
    container.appendChild(postsList);
}

/**
 * 포스트 내용 로드 함수
 * @param {string} blogId - 블로그 ID
 * @param {string} postId - 포스트 ID
 */
export function loadPostContent(blogId, postId) {
    const contentArea = document.getElementById('content-area');
    if (!contentArea) return;

    // 로딩 인디케이터 표시
    contentArea.innerHTML = `
        <div class="loading-indicator text-center py-5">
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
 * 폴더의 포스트 목록을 메인 컨텐츠 영역에 로드하는 함수
 * @param {string} folderId - 폴더 ID
 */
export function loadFolderPostsContent(folderId) {
    // 폴더 요소 찾기
    const folderItem = document.querySelector(`.folder-item[data-folder-id="${folderId}"]`);
    if (!folderItem) return;

    // 폴더 이름 가져오기
    const folderNameEl = folderItem.querySelector('.folder-name');
    const folderName = folderNameEl ? folderNameEl.textContent.trim() : '폴더';

    // active 상태 설정
    document.querySelectorAll('.folder-name.active, .category-link.active').forEach(el => {
        el.classList.remove('active');
    });

    if (folderNameEl) {
        folderNameEl.classList.add('active');
    }

    // 메인 컨텐츠 포스트 리스트 엘리먼트 찾기
    const postList = document.getElementById('post-list');
    const postInfoMessage = document.getElementById('post-info-message');
    const containerTitle = document.getElementById('post-container-title');

    if (!postList || !postInfoMessage) {
        console.warn('포스트 컨테이너를 찾을 수 없습니다.');
        return;
    }

    // 로딩 메시지 표시
    postInfoMessage.textContent = '포스트를 불러오는 중...';
    postInfoMessage.style.display = 'block';
    postList.innerHTML = '';

    if (containerTitle) {
        containerTitle.textContent = `폴더: ${folderName}`;
    }

    // 블로그 ID 가져오기
    const blogId = getBlogIdFromURL();

    // 폴더 포스트 목록 가져오기
    fetch(`/blog/${blogId}/folder/${folderId}/posts`)
        .then(response => {
            if (!response.ok) {
                throw new Error('포스트를 불러오는데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success && data.posts) {
                if (data.posts.length > 0) {
                    // 포스트 목록 렌더링
                    renderPostsInMainContent(data.posts, postList);
                    postInfoMessage.style.display = 'none';
                } else {
                    // 포스트가 없는 경우
                    postInfoMessage.textContent = '이 폴더에는 포스트가 없습니다.';
                    postInfoMessage.style.display = 'block';
                    postList.innerHTML = '';
                }
            } else {
                throw new Error('포스트 데이터가 올바르지 않습니다.');
            }
        })
        .catch(error => {
            console.error('폴더 포스트 로드 오류:', error);
            postInfoMessage.textContent = '포스트를 불러오지 못했습니다: ' + error.message;
            postInfoMessage.style.display = 'block';
            postList.innerHTML = '';
        });
}

/**
 * 메인 컨텐츠 영역에 포스트 목록 렌더링
 * @param {Array} posts - 포스트 목록
 * @param {HTMLElement} container - 포스트 목록을 표시할 컨테이너
 */
function renderPostsInMainContent(posts, container) {
    // 컨테이너 초기화
    container.innerHTML = '';

    // 포스트가 없는 경우
    if (!posts || posts.length === 0) {
        container.innerHTML = '<div class="alert alert-info">포스트가 없습니다.</div>';
        return;
    }

    // 포스트 목록 렌더링
    posts.forEach(post => {
        const postItem = document.createElement('a');
        postItem.href = `/blog/${post.blogId}/post/${post.id}`;
        postItem.className = `list-group-item list-group-item-action post-item ${post.draft ? 'draft' : ''}`;
        postItem.dataset.postId = post.id;

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

        // 클릭 이벤트 - SPA 동작을 위한 핸들러 추가
        postItem.addEventListener('click', function(e) {
            e.preventDefault();
            const postId = this.dataset.postId;
            const blogId = getBlogIdFromURL();

            // 포스트 콘텐츠 로드
            loadPostContent(blogId, postId);

            // 히스토리 API로 URL 업데이트
            history.pushState(
                { type: 'post', blogId, postId },
                '',
                this.href
            );
        });

        container.appendChild(postItem);
    });
}

/**
 * 삭제 버튼 이벤트 설정 함수
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

// 사이드바 CSS 스타일 추가
export function addSidebarPostStyles() {
    // 이미 스타일이 추가되어 있는지 확인
    if (document.getElementById('sidebar-post-styles')) return;

    const styleElement = document.createElement('style');
    styleElement.id = 'sidebar-post-styles';
    styleElement.textContent = `
        /* 사이드바 포스트 관련 스타일 */
        .folder-posts {
            margin-bottom: 10px;
            border-left: 1px solid #dee2e6;
        }

        .sidebar-post-item {
            padding: 2px 0;
        }

        .sidebar-post-link {
            color: #495057;
            font-size: 0.85rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            display: block;
        }

        .sidebar-post-link:hover {
            color: #007bff;
            background-color: rgba(0, 0, 0, 0.03);
            border-radius: 3px;
        }

        .sidebar-post-link .badge {
            font-size: 0.65rem;
            padding: 0.2em 0.4em;
        }

        /* 로딩 인디케이터 스타일 */
        .loading-indicator {
            text-align: center;
            padding: 2rem 0;
            color: #6c757d;
        }

        .loading-indicator i {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            display: block;
        }
    `;

    document.head.appendChild(styleElement);
}