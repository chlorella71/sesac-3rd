document.addEventListener("DOMContentLoaded", function () {
    const likeButtons = document.querySelectorAll(".like");

    likeButtons.forEach(button => {
        button.addEventListener("mouseenter", function () {
            let nicknameList = this.dataset.nicknameList;
            if (!nicknameList || nicknameList.trim() === "") {
                nicknameList = "추천한 사람이 없습니다.";
            } else {
                nicknameList = "추천한 사람: " + nicknameList.split(",").join(", ");
            }

            let existingTooltip = document.querySelector(".tooltip-box");
            if (existingTooltip) {
                existingTooltip.remove();
            }

            let tooltip = document.createElement("div");
            tooltip.classList.add("tooltip-box");
            tooltip.textContent = nicknameList;

            tooltip.style.position = "absolute";
            tooltip.style.backgroundColor = "#333";
            tooltip.style.color = "#fff";
            tooltip.style.padding = "5px 10px";
            tooltip.style.borderRadius = "5px";
            tooltip.style.fontSize = "12px";
            tooltip.style.whiteSpace = "nowrap";
            tooltip.style.top = (this.getBoundingClientRect().top + window.scrollY - 30) + "px";
            tooltip.style.left = (this.getBoundingClientRect().left + window.scrollX + 10) + "px";
            tooltip.style.zIndex = "1000";

            document.body.appendChild(tooltip);
        });

        button.addEventListener("mouseleave", function () {
            let tooltip = document.querySelector(".tooltip-box");
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
});