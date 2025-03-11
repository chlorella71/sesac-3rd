/**
 * 포스트 UI 관련 기능을 처리하는 모듈
 */
import { loadBlogPosts, loadFolderPosts, loadCategoryPosts, renderPosts } from "./post.js";

/**
 * 포스트 UI 관련 이벤트 초기화 함수
 */
export function initializePostUIHandlers() {
    // 폴더 및 카테고리 클릭 이벤트 위임 설정
    document.addEventListener('click', function(e) {
        // 폴더 클릭 처리
        const folderLink = e.target.closest('.folder-name');
        if (folderLink) {
            e.preventDefault();
            const folderItem = folderLink.closest('.folder-item');
            if (folderItem) {
                const folderId = folderItem.dataset.folderId;
                if (folderId) {
                    handleFolderClick(folderLink, folderId);
                }
            }
        }

        // 카테고리 클릭 처리
        const categoryLink = e.target.closest('.category-link');
        if (categoryLink) {
            e.preventDefault();
            const categoryItem = categoryLink.closest('.list-group-item');
            if (categoryItem) {
                const categoryId = categoryItem.dataset.categoryId;
                if (categoryId) {
                    handleCategoryClick(categoryLink, categoryId);
                }
            }
        }
    });

    // 초기 블로그 포스트 로드
    showAllPosts();
}

/**
 * 폴더 클릭 처리 함수
 * @param {HTMLElement} folderElement - 클릭된 폴더 요소
 * @param {string} folderId - 폴더 ID
 */
function handleFolderClick(folderElement, folderId) {
    // 모든 active 클래스 제거
    document.querySelectorAll('.folder-link.active, .category-link.active').forEach(el => {
        el.classList.remove('active');
    });

    // 현재 폴더에 active 클래스 추가
    folderElement.classList.add('active');

    // 포스트 컨테이너 참조
    const postList = document.getElementById('post-list');
    const postInfoMessage = document.getElementById('post-info-message');
    const containerTitle = document.getElementById('post-container-title');

    // 로딩 메시지 표시
    postInfoMessage.textContent = '포스트를 불러오는 중...';
    postInfoMessage.style.display = 'block';
    postList.innerHTML = '';

    // 폴더 이름 가져오기
    const folderName = folderElement.textContent.trim();
    containerTitle.textContent = `폴더: ${folderName}`;

    // 폴더 포스트 로드
    loadFolderPosts(
        folderId,
        // 성공 콜백
        (posts) => {
            renderPosts(posts, postList, postInfoMessage);
        },
        // 실패 콜백
        (errorMessage) => {
            postInfoMessage.textContent = '포스트를 불러오지 못했습니다: ' + errorMessage;
            postInfoMessage.style.display = 'block';
        }
    );
}

/**
 * 카테고리 클릭 처리 함수
 * @param {HTMLElement} categoryElement - 클릭된 카테고리 요소
 * @param {string} categoryId - 카테고리 ID
 */
function handleCategoryClick(categoryElement, categoryId) {
    // 모든 active 클래스 제거
    document.querySelectorAll('.folder-link.active, .category-link.active').forEach(el => {
        el.classList.remove('active');
    });

    // 현재 카테고리에 active 클래스 추가
    categoryElement.classList.add('active');

    // 포스트 컨테이너 참조
    const postList = document.getElementById('post-list');
    const postInfoMessage = document.getElementById('post-info-message');
    const containerTitle = document.getElementById('post-container-title');

    // 로딩 메시지 표시
    postInfoMessage.textContent = '포스트를 불러오는 중...';
    postInfoMessage.style.display = 'block';
    postList.innerHTML = '';

    // 카테고리 이름 가져오기
    const categoryName = categoryElement.textContent.trim();
    containerTitle.textContent = `카테고리: ${categoryName}`;

    // 카테고리 포스트 로드
    loadCategoryPosts(
        categoryId,
        // 성공 콜백
        (posts) => {
            renderPosts(posts, postList, postInfoMessage);
        },
        // 실패 콜백
        (errorMessage) => {
            postInfoMessage.textContent = '포스트를 불러오지 못했습니다: ' + errorMessage;
            postInfoMessage.style.display = 'block';
        }
    );
}

/**
 * 모든 포스트 표시 함수
 */
export function showAllPosts() {
    // 포스트 컨테이너 참조
    const postList = document.getElementById('post-list');
    let postInfoMessage = document.getElementById('post-info-message');
    const containerTitle = document.getElementById('post-container-title');

    // post-list-container 찾기
    const postListContainer = document.getElementById('post-list-container');

    // post-info-message가 없으면 동적으로 생성
    if (!postInfoMessage && postListContainer && postList) {
        postInfoMessage = document.createElement('div');
        postInfoMessage.id = 'post-info-message';
        postInfoMessage.className = 'alert alert-info';
        // postList 앞에 삽입
        postListContainer.insertBefore(postInfoMessage, postList);
    }

    // 이제 요소 사용
    if (postInfoMessage) {
        postInfoMessage.textContent = '포스트를 불러오는 중...';
        postInfoMessage.style.display = 'block';
    }

    if (postList) {
        postList.innerHTML = '';
    }

    if (containerTitle) {
        containerTitle.textContent = '전체 포스트';
    }

    // 모든 active 클래스 제거
    document.querySelectorAll('.folder-link.active, .category-link.active').forEach(el => {
        el.classList.remove('active');
    });

    // 블로그 포스트 로드
    loadBlogPosts(
        // 성공 콜백
        (posts) => {
            if (postList && postInfoMessage) {
                renderPosts(posts, postList, postInfoMessage);
            }
        },
        // 실패 콜백
        (errorMessage) => {
            if (postInfoMessage) {
                postInfoMessage.textContent = '포스트를 불러오지 못했습니다: ' + errorMessage;
                postInfoMessage.style.display = 'block';
            }
        }
    );
}


//export function showAllPosts() {
//    // 포스트 컨테이너 참조
//    const postList = document.getElementById('post-list');
//    const postInfoMessage = document.getElementById('post-info-message');
//    const containerTitle = document.getElementById('post-container-title');
//
//    // 요소가 존재하는지 확인 후 작업 수행
//    if (postInfoMessage) {
//        postInfoMessage.textContent = '포스트를 불러오는 중...';
//        postInfoMessage.style.display = 'block';
//    } else {
//        console.warn("Element with ID 'post-info-message' not found");
//    }
//
//    if (postList) {
//        postList.innerHTML = '';
//    }
//
//    if (containerTitle) {
//        containerTitle.textContent = '전체 포스트';
//    }
//
//    // 모든 active 클래스 제거
//    document.querySelectorAll('.folder-link.active, .category-link.active').forEach(el => {
//        el.classList.remove('active');
//    });
//
//    // 블로그 포스트 로드
//    loadBlogPosts(
//        // 성공 콜백
//        (posts) => {
//            if (postList && postInfoMessage) {
//                renderPosts(posts, postList, postInfoMessage);
//            }
//        },
//        // 실패 콜백
//        (errorMessage) => {
//            if (postInfoMessage) {
//                postInfoMessage.textContent = '포스트를 불러오지 못했습니다: ' + errorMessage;
//                postInfoMessage.style.display = 'block';
//            }
//        }
//    );
//}


//export function showAllPosts() {
//    // 포스트 컨테이너 참조
//    const postList = document.getElementById('post-list');
//    const postInfoMessage = document.getElementById('post-info-message');
//    const containerTitle = document.getElementById('post-container-title');
//
//    // 로딩 메시지 표시
//    postInfoMessage.textContent = '포스트를 불러오는 중...';
//    postInfoMessage.style.display = 'block';
//    postList.innerHTML = '';
//    containerTitle.textContent = '전체 포스트';
//
//    // 모든 active 클래스 제거
//    document.querySelectorAll('.folder-link.active, .category-link.active').forEach(el => {
//        el.classList.remove('active');
//    });
//
//    // 블로그 포스트 로드
//    loadBlogPosts(
//        // 성공 콜백
//        (posts) => {
//            renderPosts(posts, postList, postInfoMessage);
//        },
//        // 실패 콜백
//        (errorMessage) => {
//            postInfoMessage.textContent = '포스트를 불러오지 못했습니다: ' + errorMessage;
//            postInfoMessage.style.display = 'block';
//        }
//    );
//}