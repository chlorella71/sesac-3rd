/**
 * 닉네임 목록 관련 모달 렌더링 기능
 */
import { createElement } from "../../utils/dom.js";

/**
 * 닉네임 목록을 렌더링하는 함수
 * @param {HTMLElement} container - 내용을 넣을 컨테이너
 * @param {String|Array} data - 닉네임 목록 (문자열 또는 배열)
 */
export function renderNicknameList(container, data) {
    container.innerHTML = '';

    // 데이터가 없는 경우
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="no-data">추천한 사람이 없습니다.</p>';
        return;
    }

    // 데이터 처리
    const nicknameArray = Array.isArray(data)
        ? data
        : data.split(',').filter(name => name.trim() !== '');

    if (nicknameArray.length === 0) {
        container.innerHTML = '<p class="no-data">추천한 사용자가 없습니다.</p>';
        return;
    }

    // 목록 렌더링
    const list = createElement('ul', { className: 'nickname-list' });

    nicknameArray.forEach(nickname => {
        const li = createElement('li', {}, nickname.trim());
        list.appendChild(li);
    });

    container.appendChild(list);
}