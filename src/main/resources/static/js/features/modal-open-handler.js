/**
 * 모달 열기 버튼 클릭 이벤트 처리 모듈
 */
import { openModal, clearModalContent, showLoading, showError } from "../common/modal.js";
import {
    renderNicknameList,
    renderCategoryCreateForm,
    renderCategoryEditForm,
    getBlogIdFromURL
} from './modals/renderer.js';

/**
 * 모달 열기 버튼 클릭 이벤트 핸들러
 */
export function handleModalOpenClick() {
    // 데이터 속성에서 정보 가져오기
    const answerId = this.dataset.answerId;
    const modalId = answerId ? `likeModal-${answerId}` : this.dataset.modalId;
    const title = this.dataset.modalTitle;
    const modalType = this.dataset.modalType || 'nicknameList'; // 기본값은 추천자 목록

    // 데이터 소스 유형 확인
    const dataSource = this.dataset.dataSource || 'inline'; // 기본값은 인라인 데이터

    if (dataSource === 'api') {
        // API에서 데이터 가져오기
        const apiUrl = this.dataset.apiUrl;
        if (!apiUrl) {
            console.error('API URL이 지정되지 않았습니다.');
            return;
        }
        fetchDataAndOpenModal(modalId, title, apiUrl, modalType);
    } else {
        // 인라인 데이터 사용
        let data;

        switch(modalType) {
            case 'nicknameList':
                data = this.dataset.nicknameList;
                break;
            case 'categoryCreateForm':
                // 카테고리 생성 폼에 필요한 데이터
                data = {
                    blogId: this.dataset.blogId || getBlogIdFromURL()
                };
                break;
            default:
                data = this.dataset.modalData;
        }

        openModalWithContent(modalId, title, data, modalType);
    }
}

/**
 * 데이터로 모달 열기 함수
 * @param {string} modalId - 모달 ID
 * @param {string} title - 모달 제목
 * @param {*} data - 모달 데이터
 * @param {string} modalType - 모달 유형
 */
function openModalWithContent(modalId, title, data, modalType) {
    const modal = openModal(modalId, title);
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content-body');
    if (!modalContent) return;

    modalContent.innerHTML = '';

    // 모달 타입에 따라 다른 렌더링 함수 사용
    renderModalContent(modalContent, modalType, data);
}

/**
 * API를 통해 데이터를 가져와 모달에 표시하는 함수
 * @param {string} modalId - 모달 ID
 * @param {string} title - 모달 제목
 * @param {string} url - API URL
 * @param {string} modalType - 모달 유형
 */
function fetchDataAndOpenModal(modalId, title, url, modalType) {
    const modal = openModal(modalId, title);
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content-body');
    if (!modalContent) return;

    // 로딩 표시
    showLoading(modalContent);

    // API 호출
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답 오류: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // 성공적으로 데이터를 가져왔을 때 모달 내용 업데이트
            clearModalContent(modalContent);
            renderModalContent(modalContent, modalType, data);
        })
        .catch(error => {
            console.error('데이터 가져오기 오류:', error);
            showError(modalContent, `데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`);
        });
}

/**
 * 모달 내용 렌더링 함수
 * @param {HTMLElement} container - 모달 내용 컨테이너
 * @param {string} modalType - 모달 유형
 * @param {*} data - 렌더링 데이터
 */
function renderModalContent(container, modalType, data) {
    switch(modalType) {
        case 'nicknameList':
            renderNicknameList(container, data);
            break;
        case 'categoryCreateForm':
            renderCategoryCreateForm(container, data);
            break;
        case 'categoryEditForm':
            renderCategoryEditForm(container, data);
            break;
        default:
            // 기본값은 추천자 목록
            renderNicknameList(container, data);
    }
}