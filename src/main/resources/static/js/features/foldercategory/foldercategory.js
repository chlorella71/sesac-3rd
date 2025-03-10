/**
 * 폴더카테고리 관련 기능을 처리하는 모듈
 * 카테고리 기능의 진입점 역할을 하며 이벤트 핸들러를 초기화합니다.
 */
import { openModal, closeModal } from "../../common/modal.js";
import { validateForm } from "../../utils/dom.js";
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

    console.log('폴더카테고리 핸들러 초기화');

    // 카테고리 수정 버튼 이벤트 처리
    document.querySelectorAll('.edit-category').forEach(button => {
        button.addEventListener('click', handleCategoryEdit);
    });

    // 카테고리 삭제 버튼 이벤트 처리
    document.querySelectorAll('.delete-category').forEach(button => {
        button.addEventListener('click', handleCategoryDelete);
    });

    // 저장 버튼 클릭 이벤트 위임 처리
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('save-category')) {
            const categoryId = e.target.dataset.categoryId;
            updateCategory(categoryId);
        }
    });

    // 카테고리 클릭 시 폴더 목록 토글 기능
    document.querySelectorAll('.list-group-item a').forEach(categoryLink => {
        categoryLink.addEventListener('click', handleCategoryClick);
    });
}

/**
 * 카테고리 수정 버튼 클릭 이벤트 핸들러
 */
function handleCategoryEdit() {
    const categoryId = this.dataset.categoryId;
    const categoryName = this.dataset.categoryName;

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
        modal.style.display = 'block';
    }
}

/**
 * 카테고리 삭제 버튼 클릭 이벤트 핸들러
 */
function handleCategoryDelete() {
    const categoryId = this.dataset.categoryId;
    const categoryName = this.dataset.categoryName;

    if (!categoryId) {
        console.error('카테고리 ID가 없습니다.');
        return;
    }

    if (confirm(`"${categoryName}" 카테고리를 정말 삭제하시겠습니까?\n포함된 모든 폴더와 글도 함께 삭제됩니다.`)) {
        // 버튼 비활성화 (중복 클릭 방지)
        this.disabled = true;

        // 카테고리 삭제 API 호출
        CategoryAPI.deleteCategory(categoryId)
            .then(data => {
                if (data.success) {
                    // 성공적으로 삭제된 경우 UI에서 카테고리 요소 제거
                    CategoryUI.removeCategoryFromUI(categoryId);
                } else {
                    alert(data.message || '카테고리 삭제 중 오류가 발생했습니다.');
                }
            })
            .catch(error => {
                console.error('카테고리 삭제 오류:', error);
                alert('카테고리 삭제 중 오류가 발생했습니다: ' + error.message);
            })
            .finally(() => {
                // 버튼 다시 활성화
                this.disabled = false;
            });
    }
}

/**
 * 카테고리 링크 클릭 이벤트 핸들러
 * @param {Event} e - 이벤트 객체
 */
function handleCategoryClick(e) {
    e.preventDefault();

    // 해당 카테고리의 ID 찾기
    const categoryItem = this.closest('.list-group-item');
    if (!categoryItem) return;

    const categoryId = categoryItem.dataset.categoryId;
    if (!categoryId) return;

    // 폴더 목록 토글
    toggleFolderList(categoryId);
}

/**
 * 카테고리 업데이트 함수
 * @param {string} categoryId - 카테고리 ID
 */
function updateCategory(categoryId) {
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
        .then(data => {
            if (data.success) {
                // UI 업데이트
                CategoryUI.updateCategoryUI(categoryId, newName);

                // 모달 닫기
                const modal = document.getElementById('editCategoryModal');
                if (modal) {
                    modal.style.display = 'none';
                }
            } else {
                // 실패 시 오류 메시지
                alert(data.message || '카테고리 수정 중 오류가 발생했습니다.');
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