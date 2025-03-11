// src/main/resources/static/js/features/post/draft.js
import { publishDraft, getDraftPosts } from '../../api/post-api.js';
import { renderPosts } from './post.js';

export function initializeDraftHandlers() {
    // 초안 보기 버튼 이벤트 리스너
    const draftButton = document.getElementById('view-drafts');
    if (draftButton) {
        draftButton.addEventListener('click', loadDraftPosts);
    }
}

export function loadDraftPosts() {
    getDraftPosts()
        .then(posts => {
            const postList = document.getElementById('post-list');
            const postInfoMessage = document.getElementById('post-info-message');
            const containerTitle = document.getElementById('post-container-title');

            // UI 업데이트
            if (postInfoMessage) {
                postInfoMessage.textContent = '초안 목록을 불러오는 중...';
                postInfoMessage.style.display = 'block';
            }

            if (containerTitle) {
                containerTitle.textContent = '초안 포스트';
            }

            // 포스트 렌더링
            renderPosts(posts, postList, postInfoMessage);
        })
        .catch(error => {
            console.error('초안 목록 로드 실패', error);
            const postInfoMessage = document.getElementById('post-info-message');
            if (postInfoMessage) {
                postInfoMessage.textContent = '초안 목록을 불러오는 데 실패했습니다.';
                postInfoMessage.style.display = 'block';
            }
        });
}

export function setupDraftPublishHandler() {
    // 포스트 목록에서 발행 버튼 클릭 이벤트 처리
    document.addEventListener('click', function(e) {
        const publishButton = e.target.closest('.publish-draft');
        if (publishButton) {
            e.preventDefault();
            const postId = publishButton.dataset.postId;
            const blogId = publishButton.dataset.blogId;

            if (confirm('이 초안을 발행하시겠습니까?')) {
                publishDraft(postId)
                    .then(data => {
                        alert('포스트가 성공적으로 발행되었습니다.');
                        loadDraftPosts(); // 목록 새로고침
                    })
                    .catch(error => {
                        console.error('발행 실패', error);
                        alert('포스트 발행 중 오류가 발생했습니다.');
                    });
            }
        }
    });
}