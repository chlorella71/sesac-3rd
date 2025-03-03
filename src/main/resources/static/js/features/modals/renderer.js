/**
 * 모달 렌더링 관련 기능의 엔트리 포인트
 * 각 모달 유형에 맞는 렌더러 함수를 내보냄
 */
import { renderNicknameList } from './nickname-renderer.js';
import { renderCategoryCreateForm, renderCategoryEditForm } from './category-renderer.js';
import { renderFolderCreateForm, renderFolderEditForm } from './folder-renderer.js';

export {
    renderNicknameList,
    renderCategoryCreateForm,
    renderCategoryEditForm,
    renderFolderCreateForm,
    renderFolderEditForm
};

// URL에서 블로그 ID 추출하는 함수 (공통)
export function getBlogIdFromURL() {
    const path = window.location.pathname;
    const match = path.match(/\/blog\/(\d+)/);

    if (match && match[1]) {
        return match[1];
    }

    console.error('블로그 ID를 URL에서 찾을 수 없습니다.');
    return '';
}