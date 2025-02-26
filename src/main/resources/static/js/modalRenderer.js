/*
추천자 목록을 렌더링하는 함수
@param {HTMLElement} container - 내용을 넣을 컨테이너
@param {String|Array} data - 닉네임 목록 (문자열 또는 배열)
*/

export function renderNicknameList(container, data) {
    container.innerHTML = "";   // 기존 내용 초기화

    // 데이터가 없는 경우
    if (!data || data.length === 0) {
        container.innerHTML = "<p>추천한 사람이 없습니다.</p>";
        return;
    }

    // data가 배열인지 문자열인지 확인
    const nicknameArray = Array.isArray(data) ? data : data.split(",").filter(name => name.trim() !== '');

    if (nicknameArray.length === 0) {
        container.innerHTML = "<p class='no-data'>추천한 사용자가 없습니다.</p>";
        return;
    }

//    const nicknameList= data.split(",").map(nickname => nickname.trim());   // 문자열을 배열로 반환
    const list = document.createElement("ul");
    list.classList.add("nickname-list");

    nicknameArray.forEach(nickname => {
        const li = document.createElement("li");
        li.textContent = nickname.trim();
        list.appendChild(li);
    });

    container.appendChild(list);
}