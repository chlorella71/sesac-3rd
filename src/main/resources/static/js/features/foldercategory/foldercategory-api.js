/**
 * 폴더카테고리 관련 API 호출 모듈
 * 모든 폴더카테고리 관련 API 호출을 처리합니다.
 */
import { callApi, getBlogApiBaseUrl } from "../../common/api.js";

/**
 * 폴더카테고리 목록을 불러오는 함수
 * @returns {Promise} 폴더카테고리 목록 Promise
 */
export function fetchCategories() {
    const endpoint = `${getBlogApiBaseUrl()}/categories`;
    return callApi(endpoint);
}

/**
 * 폴더카테고리 생성 API 호출 함수
 * @param {Object} categoryData - 폴더카테고리 데이터 (name 등)
 * @returns {Promise} 생성된 폴더카테고리 정보 Promise
 */
export function createCategory(categoryData) {
    if (!categoryData || !categoryData.name) {
        return Promise.reject(new Error('폴더카테고리 이름이 필요합니다.'));
    }

    const endpoint = `${getBlogApiBaseUrl()}/category/create/ajax`;
    return callApi(endpoint, {
        method: 'POST',
        body: categoryData
    });
}

/**
 * 폴더카테고리 수정 API 호출 함수
 * @param {string} categoryId - 폴더카테고리 ID
 * @param {string} newName - 새 폴더카테고리 이름
 * @returns {Promise} 수정된 폴더카테고리 정보 Promise
 */
export function updateCategory(categoryId, newName) {
    if (!categoryId) {
        return Promise.reject(new Error('폴더카테고리 ID가 필요합니다.'));
    }

    const endpoint = `${getBlogApiBaseUrl()}/category/${categoryId}/update`;
    return callApi(endpoint, {
        method: 'POST',
        body: { name: newName }
    });
}

/**
 * 폴더카테고리 삭제 API 호출 함수
 * @param {string} categoryId - 폴더카테고리 ID
 * @returns {Promise} 삭제 결과 Promise
 */
export function deleteCategory(categoryId) {
    if (!categoryId) {
        return Promise.reject(new Error('폴더카테고리 ID가 필요합니다.'));
    }

    const endpoint = `${getBlogApiBaseUrl()}/category/${categoryId}/delete`;
    return callApi(endpoint, { method: 'POST' });
}