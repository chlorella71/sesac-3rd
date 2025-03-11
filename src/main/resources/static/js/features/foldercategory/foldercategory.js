/**
 * 폴더카테고리 관련 기능을 처리하는 모듈
 * 카테고리 기능의 진입점 역할을 하며 이벤트 핸들러를 초기화합니다.
 */
import { openModal, closeModal } from "../../common/modal.js";
import { validateForm } from "../../utils/dom.js";
import { getCsrfInfo } from "../../common/csrf.js"; // CSRF 공통 모듈 사용
import * as CategoryAPI from "./foldercategory-api.js";
import * as CategoryUI from "./foldercategory-ui.js";
import { toggleFolderList } from "./folder.js";

// 중복 초기화 방지를 위한 플래그
let isInitialized = false;

/**
 * 카테고리 관련 이벤트 핸들러 초기화 함수
 */
export function initializeCategoryHandlers() {
    // 이미 초기화됐다면 중복 실행 방지
    if (isInitialized) return;
    isInitialized = true;

//    console.log('폴더카테고리 핸들러 초기화');

//    // 카테고리 클릭 이벤트 핸들러 (이벤트 위임 방식)
//    document.addEventListener('click', function(e) {
//        const categoryLink = e.target.closest('.category-link');
//        if (categoryLink) {
//            e.preventDefault();
//
//            const categoryItem = categoryLink.closest('.list-group-item');
//            if (categoryItem) {
//                const categoryId = categoryItem.dataset.categoryId;
//                if (categoryId) {
//                    console.log('카테고리 클릭:', categoryId);
//                    toggleFolderList(categoryId);
//                }
//            }
//        }
//    });

    // 카테고리 추가 버튼 이벤트 처리
    document.querySelectorAll('.add-category').forEach(button => {
        button.addEventListener('click', handleAddCategory);
    });

    // 카테고리 수정 버튼 이벤트 처리
    document.addEventListener('click', function(e) {
        const editButton = e.target.closest('.edit-category');
        if (editButton) {
            handleCategoryEdit(editButton);
        }
    });

    // 카테고리 삭제 버튼 이벤트 처리
    document.addEventListener('click', function(e) {
        const deleteButton = e.target.closest('.delete-category');
        if (deleteButton) {
            handleCategoryDelete(deleteButton);
        }
    });

    // 저장 버튼 클릭 이벤트 위임 처리
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('save-category')) {
            const categoryId = e.target.dataset.categoryId;
            handleCategoryUpdate(categoryId);
        }
    });

    // 카테고리 클릭 시 폴더 목록 토글 기능
    document.addEventListener('click', function(e) {
        const categoryLink = e.target.closest('.category-link');
        console.log('Category Link:', categoryLink); // 로그 추가

        if (categoryLink) {
            e.preventDefault();
            console.log('Category Link Clicked'); // 클릭 확인 로그

            const categoryItem = categoryLink.closest('.list-group-item');
            console.log('Category Item:', categoryItem); // 카테고리 아이템 로그

            if (categoryItem) {
                const categoryId = categoryItem.dataset.categoryId;
                console.log('Category ID:', categoryId); // 카테고리 ID 로그

                if (categoryId) {
                    console.log('Calling toggleFolderList'); // 함수 호출 로그
                    toggleFolderList(categoryId);
                }
            }
        }
    });
}

/**
 * 카테고리 추가 버튼 클릭 이벤트 핸들러
 */
function handleAddCategory() {
    // 모달 표시
    const modal = document.getElementById('categoryModal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = '카테고리 생성';
    }

    const modalContent = modal.querySelector('.modal-content-body');
    if (!modalContent) return;

    // 폼 렌더링
    const form = CategoryUI.renderCategoryCreateForm(modalContent);

    // 폼 제출 이벤트 핸들러 추가
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm(this)) {
            return;
        }

        handleCategoryCreate(this);
    });

    // 모달 표시
    modal.style.display = 'block';
}

/**
 * 카테고리 생성 처리 함수
 * @param {HTMLFormElement} form - 카테고리 생성 폼
 */
function handleCategoryCreate(form) {
    const nameInput = form.querySelector('#categoryName');
    const name = nameInput.value.trim();

    if (!name) {
        nameInput.classList.add('is-invalid');
        return;
    }

    // 버튼 상태 업데이트
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = '생성 중...';
    }

    // API 호출
    CategoryAPI.createCategory({ name })
        .then(response => {
            if (response.success) {
                // UI에 새 카테고리 추가
                CategoryUI.addCategoryToUI(response.category);

                // 모달 닫기
                const modal = document.getElementById('categoryModal');
                if (modal) {
                    closeModal(modal);
                }

                // 성공 메시지 표시 (선택적)
                console.log('카테고리가 성공적으로 생성되었습니다:', response.category);
            } else {
                alert(response.message || '카테고리 생성 중 오류가 발생했습니다.');
            }
        })
        .catch(error => {
            console.error('카테고리 생성 오류:', error);
            alert('카테고리 생성 중 오류가 발생했습니다: ' + error.message);
        })
        .finally(() => {
            // 버튼 상태 복원
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = '생성';
            }
        });
}

/**
 * 카테고리 수정 버튼 클릭 이벤트 핸들러
 * @param {HTMLElement} button - 수정 버튼 요소
 */
function handleCategoryEdit(button) {
    const categoryId = button.dataset.categoryId;
    const categoryName = button.dataset.categoryName;

    if (!categoryId) {
        console.error('카테고리 ID가 없습니다.');
        return;
    }

    // 모달 열기
    const modal = document.getElementById('editCategoryModal');
    if (modal) {
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
            modalTitle.textContent = '카테고리 수정';
        }

        const modalContent = modal.querySelector('.modal-content-body');
        if (modalContent) {
            CategoryUI.renderCategoryEditForm(modalContent, {
                categoryId: categoryId,
                categoryName: categoryName
            });
        }
        openModal(modal);
    }
}

/**
 * 카테고리 삭제 버튼 클릭 이벤트 핸들러
 * @param {HTMLElement} button - 삭제 버튼 요소
 */
function handleCategoryDelete(button) {
    const categoryId = button.dataset.categoryId;
    const categoryName = button.dataset.categoryName;

    if (!categoryId) {
        console.error('카테고리 ID가 없습니다.');
        return;
    }

    if (confirm(`"${categoryName}" 카테고리를 정말 삭제하시겠습니까?\n포함된 모든 폴더와 글도 함께 삭제됩니다.`)) {
        // 버튼 비활성화 (중복 클릭 방지)
        button.disabled = true;

        // 카테고리 삭제 API 호출
        CategoryAPI.deleteCategory(categoryId)
            .then(response => {
                if (response.success) {
                    // 성공적으로 삭제된 경우 UI에서 카테고리 요소 제거
                    CategoryUI.removeCategoryFromUI(categoryId);
                } else {
                    alert(response.message || '카테고리 삭제 중 오류가 발생했습니다.');
                }
            })
            .catch(error => {
                console.error('카테고리 삭제 오류:', error);
                alert('카테고리 삭제 중 오류가 발생했습니다: ' + error.message);
            })
            .finally(() => {
                // 버튼 다시 활성화
                button.disabled = false;
            });
    }
}

/**
 * 카테고리 업데이트 처리 함수
 * @param {string} categoryId - 카테고리 ID
 */
function handleCategoryUpdate(categoryId) {
    const nameInput = document.getElementById('editCategoryName');
    const newName = nameInput.value.trim();

    if (!newName) {
        nameInput.classList.add('is-invalid');
        return;
    }

    // 저장 버튼 상태 업데이트
    const saveButton = document.querySelector('.save-category');
    const originalText = saveButton.textContent;
    saveButton.textContent = '저장 중...';
    saveButton.disabled = true;

    // API 호출
    CategoryAPI.updateCategory(categoryId, newName)
        .then(response => {
            if (response.success) {
                // UI 업데이트
                CategoryUI.updateCategoryUI(categoryId, newName);

                // 모달 닫기
                const modal = document.getElementById('editCategoryModal');
                if (modal) {
                    closeModal(modal);
                }
            } else {
                // 실패 시 오류 메시지
                alert(response.message || '카테고리 수정 중 오류가 발생했습니다.');
            }
        })
        .catch(error => {
            console.error('카테고리 수정 오류:', error);
            alert('카테고리 수정 중 오류가 발생했습니다: ' + error.message);
        })
        .finally(() => {
            // 버튼 상태 복원
            saveButton.textContent = originalText;
            saveButton.disabled = false;
        });
}