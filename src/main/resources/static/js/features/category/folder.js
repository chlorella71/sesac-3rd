/**
 * 폴더 관련 기능을 처리하는 통합 모듈 (기존 코드 호환성 유지)
 * 파일 경로: /static/js/features/category/folder.js
 */

import { initializeFolderManager, toggleFolderList } from "./folder-hierarchy-manager.js";

/**
 * 폴더 관련 이벤트 초기화 함수
 * 기존 코드와의 호환성을 위해 유지
 */
export function initializeFolderHandlers() {
    // 새 모듈 시스템으로 초기화 위임
    initializeFolderManager();
}

/**
 * 폴더 목록 토글 함수 (기존 코드와의 호환성 유지)
 * @param {string} categoryId - 카테고리 ID
 */
export { toggleFolderList };

// 이전 버전과의 호환성을 위한 가져오기
import {
    loadFolderHierarchy as loadFolders,
    deleteFolder as deleteHierarchyFolder,
    createFolder as createHierarchyFolder,
    addFolderToUI as addHierarchyFolderToUI
} from "./folder-hierarchy-manager.js";

// 기존 코드와의 호환성을 위해 내보내기
export {
    loadFolders,
    deleteHierarchyFolder as deleteFolder,
    createHierarchyFolder as createFolder,
    addHierarchyFolderToUI as addFolderToUI
};