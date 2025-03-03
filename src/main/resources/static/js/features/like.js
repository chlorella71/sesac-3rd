/**
 * 좋아요(추천) 관련 기능을 처리하는 모듈
 */
import { getCsrfInfo } from "../common/csrf.js";

/**
 * 좋아요 버튼 상태 업데이트 함수
 * @param {HTMLElement} button - 좋아요 버튼 요소
 * @param {boolean} isLiked - 좋아요 상태
 * @param {number} likeCount - 좋아요 개수
 */
function updateLikeButtonUI(button, isLiked, likeCount) {
    const likeCountSpan = button.querySelector('.like-count');

    // 좋아요 개수 업데이트
    if (likeCountSpan) {
        likeCountSpan.textContent = likeCount;
    }

    // 버튼 스타일 업데이트
    if (isLiked) {
        button.classList.remove('btn-outline-secondary', 'text-black');
        button.classList.add('btn-success', 'text-white');
    } else {
        button.classList.remove('btn-success', 'text-white');
        button.classList.add('btn-outline-secondary', 'text-black');
    }
}

/**
 * 좋아요 토글 API 호출 함수
 * @param {number} answerId - 답변 ID
 * @param {Function} onSuccess - 성공 시 콜백 함수
 * @param {Function} onError - 실패 시 콜백 함수
 */
function toggleLikeApi(answerId, onSuccess, onError) {
    const csrfInfo = getCsrfInfo();

    // CSRF 토큰이 없는 경우
    if (!csrfInfo) {
        alert('로그인이 필요한 기능입니다.');
        return;
    }

    // API 호출
    fetch('/answer-like/toggle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [csrfInfo.header]: csrfInfo.token
        },
        body: JSON.stringify({ answerId: answerId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            onSuccess(data);
        } else {
            onError(data.message || '추천 처리 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        onError('네트워크 오류가 발생했습니다.');
    });
}

/**
 * 좋아요 버튼 이벤트 초기화 함수
 */
function initializeLikeHandlers() {
    const likeButtons = document.querySelectorAll('.like');

    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const answerId = this.dataset.answerId;
            const likeCountSpan = this.querySelector('.like-count');
            const currentCount = parseInt(likeCountSpan.textContent, 10) || 0;
            const isLiked = this.classList.contains('btn-success');

            // 즉시 UI 피드백 제공 (낙관적 업데이트)
            updateLikeButtonUI(this, !isLiked, isLiked ? currentCount - 1 : currentCount + 1);

            // API 호출
            toggleLikeApi(
                answerId,
                // 성공 콜백
                (data) => {
                    updateLikeButtonUI(this, data.liked, data.likeCount);
                },
                // 실패 콜백
                (errorMessage) => {
                    alert(errorMessage);
                    // UI 롤백
                    updateLikeButtonUI(this, isLiked, currentCount);
                }
            );
        });
    });
}

//// DOM이 로드되면 좋아요 이벤트 핸들러 초기화
//document.addEventListener('DOMContentLoaded', initializeLikeHandlers);

// 함수 내보내기
export { initializeLikeHandlers, updateLikeButtonUI, toggleLikeApi };