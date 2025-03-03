/**
 * 애플리케이션 메인 JavaScript 파일
 * 전체 애플리케이션의 공통 기능 초기화
 */

// 필요한 모듈 불러오기
import { initializeDeleteHandlers } from './features/delete.js';
import { initializeModalEvents } from './common/modal.js';

// DOM이 준비되면 실행될 초기화 함수
document.addEventListener('DOMContentLoaded', function() {
    // 삭제 버튼 이벤트 핸들러 초기화
    initializeDeleteHandlers();

    // 모달 이벤트 초기화
    initializeModalEvents();

    // 페이지 기능에 따라 필요한 모듈 초기화
    initializePageSpecificFeatures();
});

/**
 * 페이지별 특정 기능 초기화 함수
 * 현재 URL 경로에 따라 필요한 기능을 동적으로 로드
 */
function initializePageSpecificFeatures() {
    const path = window.location.pathname;

    // 블로그 상세 페이지
    if (path.match(/\/blog\/\d+$/)) {
        import('./features/blog-modal-handler.js')
            .then(module => {
                console.log('블로그 모달 핸들러 초기화 완료');
            })
            .catch(error => {
                console.error('블로그 모달 핸들러 로드 실패:', error);
            });
    }

    // 질문 상세 페이지
    if (path.match(/\/question\/detail\/\d+$/)) {
        Promise.all([
            import('./features/like.js'),
            import('./features/tooltip.js')
        ])
        .then(([likeModule, tooltipModule]) => {
            console.log('질문 상세 페이지 기능 초기화 완료');
        })
        .catch(error => {
            console.error('질문 상세 페이지 기능 로드 실패:', error);
        });
    }
}