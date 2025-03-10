/**
 * 폴더 API 관련 서비스
 * 파일 경로: /static/js/features/category/folder-api.js
 */

import { getBlogIdFromURL } from "../../utils/dom.js";
import { getCsrfInfo } from "../../common/csrf.js";
import { addFolderToUI, removeFolderFromUI } from "./folder-ui-handler.js";

/**
 * 폴더 생성 API 호출 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {Object} folderData - 폴더 데이터 (name, parentFolderId)
 * @param {Function} onSuccess - 성공 시 콜백 함수
 * @param {Function} onError - 실패 시 콜백 함수
 */
export function createFolder(categoryId, folderData, onSuccess, onError) {
    // 이미 실행 중인지 확인 (중복 호출 방지)
    if (window.creatingFolder) {
        console.log('이미 폴더 생성 중입니다.');
        return;
    }

    window.creatingFolder = true;

    const blogId = getBlogIdFromURL();
    const csrfInfo = getCsrfInfo();

    if (!csrfInfo) {
        if (onError) onError('인증 토큰이 없습니다. 다시 로그인해주세요.');
        window.creatingFolder = false;
        return;
    }

    // 요청 데이터 준비 - 부모 폴더 ID 명확하게 설정
    const requestData = {
        name: folderData.name
    };

    // 부모 폴더 ID가 있는 경우에만 추가 (유효한 값인지 확인)
    if (folderData.parentFolderId && folderData.parentFolderId !== 'null' && folderData.parentFolderId !== 'undefined') {
        requestData.parentFolderId = folderData.parentFolderId;
    }

    // 요청 헤더 설정
    const headers = {
        'Content-Type': 'application/json'
    };

    // CSRF 헤더 추가
    headers[csrfInfo.header] = csrfInfo.token;

    // API 호출
    fetch(`/blog/${blogId}/category/${categoryId}/folder/create`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 성공적으로 생성된 경우 UI 업데이트
            addFolderToUI(categoryId, data.folder);

            // 성공 콜백 호출
            if (onSuccess) onSuccess(data.folder);
        } else {
            // 실패 시 오류 메시지
            throw new Error(data.message || '폴더 생성 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('폴더 생성 오류:', error);
        if (onError) onError(error.message);
    })
    .finally(() => {
        // 플래그 초기화
        window.creatingFolder = false;
    });
}

/**
 * 폴더 삭제 API 호출 함수
 * @param {string} folderId - 폴더 ID
 * @param {Function} onSuccess - 성공 시 콜백 함수
 * @param {Function} onError - 실패 시 콜백 함수
 */
export function deleteFolder(folderId, onSuccess, onError) {
    const blogId = getBlogIdFromURL();

    // CSRF 토큰 가져오기
    const csrfInfo = getCsrfInfo();
    if (!csrfInfo) {
        if (onError) onError('인증 토큰이 없습니다. 다시 로그인해주세요.');
        return;
    }

    // 요청 헤더 설정
    const headers = {
        'Content-Type': 'application/json'
    };

    // CSRF 헤더 추가
    headers[csrfInfo.header] = csrfInfo.token;

    // API 호출
    fetch(`/blog/${blogId}/folder/${folderId}/delete`, {
        method: 'POST',
        headers: headers
    })
    .then(response => {
        if (response.status === 403) {
            throw new Error('접근 권한이 없습니다.');
        }
        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 성공적으로 삭제된 경우 UI에서 폴더와 하위 폴더 모두 제거
            removeFolderFromUI(folderId);

            // 성공 콜백 호출
            if (onSuccess) onSuccess();
        } else {
            // 실패 시 오류 메시지
            throw new Error(data.message || '폴더 삭제 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('폴더 삭제 오류:', error);
        if (onError) onError(error.message);
    });
}

/**
 * 폴더 수정 API 호출 함수
 * @param {string} folderId - 폴더 ID
 * @param {string} newName - 새 폴더 이름
 * @param {Function} onSuccess - 성공 시 콜백 함수
 * @param {Function} onError - 실패 시 콜백 함수
 */
export function updateFolder(folderId, newName, onSuccess, onError) {
    const blogId = getBlogIdFromURL();

    // CSRF 토큰 가져오기
    const csrfInfo = getCsrfInfo();
    if (!csrfInfo) {
        if (onError) onError('인증 토큰이 없습니다. 다시 로그인해주세요.');
        return;
    }

    // 요청 헤더 설정
    const headers = {
        'Content-Type': 'application/json'
    };

    // CSRF 헤더 추가
    headers[csrfInfo.header] = csrfInfo.token;

    // API 호출
    fetch(`/blog/${blogId}/folder/${folderId}/update`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ name: newName })
    })
    .then(response => {
        if (response.status === 403) {
            throw new Error('접근 권한이 없습니다.');
        }
        if (!response.ok) {
            throw new Error(`서버 오류: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // 성공 콜백 호출
            if (onSuccess) onSuccess(data.folder);
        } else {
            // 실패 시 오류 메시지
            throw new Error(data.message || '폴더 수정 중 오류가 발생했습니다.');
        }
    })
    .catch(error => {
        console.error('폴더 수정 오류:', error);
        if (onError) onError(error.message);
    });
}

/**
 * 폴더 목록 로드 함수
 * @param {string} categoryId - 카테고리 ID
 * @param {Function} onSuccess - 성공 시 콜백 함수
 * @param {Function} onError - 실패 시 콜백 함수
 */
export function loadFolders(categoryId, onSuccess, onError) {
    const blogId = getBlogIdFromURL();
    if (!blogId || !categoryId) {
        if (onError) onError('블로그 ID 또는 카테고리 ID가 없습니다.');
        return;
    }

    // API 호출
    fetch(`/blog/${blogId}/category/${categoryId}/folders`)
        .then(response => {
            if (!response.ok) {
                throw new Error('폴더 목록을 불러오는데 실패했습니다.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // 성공 콜백 호출
                if (onSuccess) onSuccess(data.folders || []);
            } else {
                throw new Error(data.message || '폴더 목록을 불러오는데 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('폴더 로드 오류:', error);
            if (onError) onError(error.message);
        });
}