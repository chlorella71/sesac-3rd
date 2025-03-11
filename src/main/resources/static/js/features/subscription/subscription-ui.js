/**
 * 구독 기능 UI 핸들러 모듈
 */
import { checkSubscription, subscribe, unsubscribe } from "./subscription-api.js";
import { showToast } from "../../common/toast.js";

/**
 * 구독 버튼 초기화 함수
 */
export function initSubscriptionButton() {
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (!subscribeBtn) return;

    const blogId = subscribeBtn.dataset.blogId;

    // 초기 구독 상태 확인
    checkSubscriptionState(blogId);

    // 구독 버튼 클릭 이벤트
    subscribeBtn.addEventListener('click', function() {
        const isSubscribed = subscribeBtn.classList.contains('active');

        if (isSubscribed) {
            // 구독 취소
            unsubscribe(blogId)
                .then(response => {
                    if (response.success) {
                        updateSubscribeButton(false);
                        showToast('success', '구독이 취소되었습니다.');
                    }
                })
                .catch(error => {
                    console.error('구독 취소 오류:', error);
                    showToast('error', '구독 취소 중 오류가 발생했습니다.');
                });
        } else {
            // 구독 신청
            subscribe(blogId)
                .then(response => {
                    if (response.success) {
                        updateSubscribeButton(true);
                        showToast('success', '블로그를 구독했습니다. 새 글이 등록되면 알림을 받게 됩니다.');
                    }
                })
                .catch(error => {
                    console.error('구독 오류:', error);
                    showToast('error', '구독 중 오류가 발생했습니다.');
                });
        }
    });
}

/**
 * 구독 상태 확인 함수
 * @param {number} blogId - 블로그 ID
 */
function checkSubscriptionState(blogId) {
    checkSubscription(blogId)
        .then(response => {
            updateSubscribeButton(response.subscribed);
        })
        .catch(error => {
            console.error('구독 상태 확인 오류:', error);
        });
}

/**
 * 구독 버튼 상태 업데이트 함수
 * @param {boolean} isSubscribed - 구독 상태
 */
function updateSubscribeButton(isSubscribed) {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscribeText = document.getElementById('subscribeText');

    if (isSubscribed) {
        subscribeBtn.classList.add('active', 'btn-primary');
        subscribeBtn.classList.remove('btn-outline-primary');
        subscribeText.innerText = '구독중';
    } else {
        subscribeBtn.classList.remove('active', 'btn-primary');
        subscribeBtn.classList.add('btn-outline-primary');
        subscribeText.innerText = '구독하기';
    }
}