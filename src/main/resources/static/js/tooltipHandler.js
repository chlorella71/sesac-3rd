document.addEventListener("DOMContentLoaded", function () {
    const likeButtons = document.querySelectorAll(".like");

    likeButtons.forEach(button => {
        button.addEventListener("mouseenter", function () {
            let nicknameList = this.dataset.nicknameList;

            // 추천한 사람이 없는 경우(데이터가 없거나 빈 문자열이면 기본 메세지 설정)
            if (!nicknameList || nicknameList.trim() === "") {
                nicknameList = ["추천한 사람이 없습니다."];   // 배열로 설정
            } else {
                nicknameList = nicknameList.split(",").map(name => name.trim());   // 문자열을 배열로 변환
            }

            let existingTooltip = document.querySelector(".tooltip-box");
            if (existingTooltip) {
                existingTooltip.remove();
            }

            // 툴팁 요소 생성
            let tooltip = document.createElement("div");
            tooltip.classList.add("tooltip-box");
//            tooltip.textContent = nicknameList;

            // 추천자 목록을 세로로 정렬하여 추가
            nicknameList.forEach(nickname => {
                let nameElement = document.createElement("div");
                nameElement.textContent = nickname;
                tooltip.appendChild(nameElement);
            });

            // 툴팁 위치 선정
            let rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top + window.scrollY - 30) + "px";
            tooltip.style.left = (rect.left + window.scrollX + 10) + "px";

            document.body.appendChild(tooltip);

            // 0.1초 뒤에 .show 클래스 추가 (애니메이션 효과 적용)
            setTimeout(() => {
                tooltip.classList.add("show");
            }, 100);
        });

//            tooltip.style.position = "absolute";
//            tooltip.style.backgroundColor = "#333";
//            tooltip.style.color = "#fff";
//            tooltip.style.padding = "5px 10px";
//            tooltip.style.borderRadius = "5px";
//            tooltip.style.fontSize = "12px";
//            tooltip.style.whiteSpace = "nowrap";
//            tooltip.style.top = (this.getBoundingClientRect().top + window.scrollY - 30) + "px";
//            tooltip.style.left = (this.getBoundingClientRect().left + window.scrollX + 10) + "px";
//            tooltip.style.zIndex = "1000";
//
//            document.body.appendChild(tooltip);
//        });

        button.addEventListener("mouseleave", function () {
            let tooltip = document.querySelector(".tooltip-box");
            if (tooltip) {
                tooltip.classList.remove("show");   // 애니메이션 효과 적용 후 제거
                setTimeout(() => tooltip.remove(), 200);    // 0.2초 후에 DOM에서 제거
            }
        });
    });
});