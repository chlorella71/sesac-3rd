/**
 * 삭제 관련 기능을 처리하는 모듈
 */

/**
 * 삭제 버튼 이벤트 초기화 함수
 * 클래스명이 'delete'인 요소에 대해 클릭 이벤트 처리
 */
export function initializeDeleteHandlers() {
    const deleteElements = document.getElementsByClassName('delete');

    Array.from(deleteElements).forEach(function(element) {
        element.addEventListener('click', function() {
            if(confirm('정말로 삭제하시겠습니까?')) {
                location.href = this.dataset.uri;
            }
        });
    });
}

// DOM이 로드되면 삭제 이벤트 핸들러 초기화
document.addEventListener('DOMContentLoaded', initializeDeleteHandlers);