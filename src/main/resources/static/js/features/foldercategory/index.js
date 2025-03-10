/**
 * 폴더카테고리 모듈 진입점
 * 카테고리와 폴더 관련 모든 기능을 초기화합니다.
 */
import { initializeCategoryHandlers } from "./foldercategory.js";
import { initializeFolderHandlers, loadFolders, toggleFolderList } from "./folder.js";

/**
 * 폴더카테고리 관련 모든 기능 초기화
 */
export function initializeFolderCategory() {
    // 카테고리 핸들러 초기화
    initializeCategoryHandlers();

    // 폴더 핸들러 초기화
    initializeFolderHandlers();

    console.log('폴더카테고리 모듈 초기화 완료');
}

// 필요한 함수들 내보내기
export {
    loadFolders,
    toggleFolderList
};