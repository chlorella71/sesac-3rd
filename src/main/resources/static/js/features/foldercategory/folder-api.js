/**
 * 폴더 관련 API 호출 모듈
 * 모든 폴더 관련 API 호출을 처리합니다.
 */
import { callApi, getBlogApiBaseUrl } from "../../common/api.js";

/**
 * 폴더 목록을 불러오는 함수
 * @param {string} categoryId - 카테고리 ID
 * @returns {Promise} 폴더 목록 Promise
 */
export function fetchFolders(categoryId) {
    if (!categoryId) {
        return Promise.reject(new Error('카테고리 ID가 필요합니다.'));
    }

    const endpoint = `${getBlogApiBaseUrl()}/category/${categoryId}/folders`;
    return callApi(endpoint);
}

/**
 * 폴더 생성 API 호출 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {Object} folderData - 폴더 데이터 (name, parentFolderId)
 * @returns {Promise} 생성된 폴더 정보 Promise
 */
export function createFolder(categoryId, folderData) {
    if (!categoryId) {
        return Promise.reject(new Error('카테고리 ID가 필요합니다.'));
    }

    // 요청 데이터 준비 - 부모 폴더 ID 명확하게 설정
    const requestData = {
        name: folderData.name
    };

    // 부모 폴더 ID가 있는 경우에만 추가 (유효한 값인지 확인)
    if (folderData.parentFolderId &&
        folderData.parentFolderId !== 'null' &&
        folderData.parentFolderId !== 'undefined') {
        requestData.parentFolderId = folderData.parentFolderId;
    }

    const endpoint = `${getBlogApiBaseUrl()}/category/${categoryId}/folder/create`;
    return callApi(endpoint, {
        method: 'POST',
        body: requestData
    });
}

/**
 * 폴더 수정 API 호출 함수
 * @param {string} folderId - 폴더 ID
 * @param {string} newName - 새 폴더 이름
 * @returns {Promise} 수정된 폴더 정보 Promise
 */
export function updateFolder(folderId, newName) {
    if (!folderId) {
        return Promise.reject(new Error('폴더 ID가 필요합니다.'));
    }

    const endpoint = `${getBlogApiBaseUrl()}/folder/${folderId}/update`;
    return callApi(endpoint, {
        method: 'POST',
        body: { name: newName }
    });
}

/**
 * 폴더 삭제 API 호출 함수
 * @param {string} folderId - 폴더 ID
 * @returns {Promise} 삭제 결과 Promise
 */
export function deleteFolder(folderId) {
    if (!folderId) {
        return Promise.reject(new Error('폴더 ID가 필요합니다.'));
    }

    const endpoint = `${getBlogApiBaseUrl()}/folder/${folderId}/delete`;
    return callApi(endpoint, { method: 'POST' });
}