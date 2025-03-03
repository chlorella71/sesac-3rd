/**
 * 툴팁 관련 기능을 처리하는 모듈
 */

/**
 * 툴팁 생성 함수
 * @param {HTMLElement} target - 툴팁을 표시할 타겟 요소
 * @param {Array|string} nicknameList - 표시할 닉네임 목록 (배열 또는 쉼표로 구분된 문자열)
 * @returns {HTMLElement} 생성된 툴팁 요소
 */
function createTooltip(target, nicknameList) {
    // 기존 툴팁 제거
    let existingTooltip = document.querySelector('.tooltip-box');
    if (existingTooltip) {
        existingTooltip.remove();
    }

    // 데이터 처리
    const nameArray = Array.isArray(nicknameList)
        ? nicknameList
        : (nicknameList && nicknameList.trim() !== '')
            ? nicknameList.split(',').map(name => name.trim())
            : ['추천한 사람이 없습니다.'];

    // 툴팁 요소 생성
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip-box');

    // 닉네임 목록 추가
    nameArray.forEach(nickname => {
        const nameElement = document.createElement('div');
        nameElement.textContent = nickname;
        tooltip.appendChild(nameElement);
    });

    // 툴팁 위치 설정
    const rect = target.getBoundingClientRect();
    tooltip.style.top = (rect.top + window.scrollY - 30) + 'px';
    tooltip.style.left = (rect.left + window.scrollX + 10) + 'px';

    // 문서에 추가
    document.body.appendChild(tooltip);

    // 애니메이션 적용
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 100);

    return tooltip;
}

/**
 * 툴팁 제거 함수
 */
function removeTooltip() {
    const tooltip = document.querySelector('.tooltip-box');
    if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => tooltip.remove(), 200);
    }
}

/**
 * 툴팁 이벤트 초기화 함수
 */
export function initializeTooltips() {
    const likeButtons = document.querySelectorAll('.like');

    likeButtons.forEach(button => {
        // 마우스 진입 시 툴팁 표시
        button.addEventListener('mouseenter', function() {
            const nicknameList = this.dataset.nicknameList;
            createTooltip(this, nicknameList);
        });

        // 마우스 이탈 시 툴팁 제거
        button.addEventListener('mouseleave', function() {
            removeTooltip();
        });
    });
}

// DOM이 로드되면 툴팁 이벤트 핸들러 초기화
document.addEventListener('DOMContentLoaded', initializeTooltips);