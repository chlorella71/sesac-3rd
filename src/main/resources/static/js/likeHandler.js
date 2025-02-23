document.addEventListener("DOMContentLoaded", function () {
    const likeElements = document.querySelectorAll(".like");

    likeElements.forEach(button => {
        button.addEventListener("click", function () {
//            if (!confirm("정말로 추천하시겠습니까?")) {
//                return;
//            }

            const answerId = this.dataset.answerId;
            const email = this.dataset.email;

            if (!email || email === "null") {   // "null" 문자열이 들어올 수도 있으므로 추가 체크
                alert("추천 기능을 사용하려면 로그인해야 합니다.");
                return;
            }

            // csrf 토큰 가져오기 (로그인하지 않은 경우 undefined가 될 수 있음)
            const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
            const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

            // csrf 토큰이 없는 경우 (비로그인 상태)
            if (!csrfToken || !csrfHeader) {
                alert("csrf 토큰을 찾을 수 없습니다. 다시 로그인해 주세요.");
                return;
            }

//            const csrfToken = csrfTokenElement.content;
//            const csrfHeader = csrfHeaderElement.content;

            fetch("/answer-like/toggle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    [csrfHeader]: csrfToken   // csrf 토큰 추가
                },
                body: JSON.stringify({ answerId: answerId, email: email })
            })
            .then(response => response.json())
            .then(data => {
                // 추천 개수 업데이트
                this.querySelector(".like-count").textContent = data.likeCount;

                // 버튼 스타일 변경
                if (data.liked) {
                    this.classList.add("btn-success");
                    this.classList.remove("btn-outline-secondary");
                } else {
                    this.classList.add("btn-outline-secondary");
                    this.classList.remove("btn-success");
                }
            })
            .catch(error => console.error("Error:", error))
        });
    });

//    Array.from(likeElements).forEach(function(element) {
//        element.addEventListener('click', function() {
//            if (confirm("정말로 추천하시겠습니까?")) {
//                location.href = this.dataset.uri;
//            }
//        });
//    });
});