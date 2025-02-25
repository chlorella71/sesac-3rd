document.addEventListener("DOMContentLoaded", function () {
    const likeElements = document.querySelectorAll(".like");

    likeElements.forEach(button => {
        button.addEventListener("click", function () {

            const answerId = this.dataset.answerId;
            console.log("추천 버튼 클릭됨! Answer Id:", answerId);

            // csrf 토큰 가져오기 (로그인하지 않은 경우 undefined가 될 수 있음)
            const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
            const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

            // csrf 토큰이 없는 경우 (비로그인 상태)
            if (!csrfToken || !csrfHeader) {
                alert("csrf 토큰을 찾을 수 없습니다. 다시 로그인해 주세요.");
                return;
            }

            console.log("CSRF Token:", csrfToken);
            console.log("CSRF Header:", csrfHeader);

            const likeCountSpan = button.querySelector(".like-count");
            let currentCount = parseInt(likeCountSpan.textContent, 10) || 0;
            const isLiked = button.classList.contains("btn-success"); // 현재 추천 상태 확인

            if (!isLiked) {
                button.classList.remove("btn-outline-secondary");
                button.classList.add("btn-success", "text-white");
                likeCountSpan.textContent = currentCount + 1; // 추천 증가
            } else {
                button.classList.remove("btn-success", "text-white");
                button.classList.add("btn-outline-secondary");
                likeCountSpan.textContent = currentCount - 1;   // 추천 취소
            }

            fetch("/answer-like/toggle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    [csrfHeader]: csrfToken   // csrf 토큰 추가
                },
                body: JSON.stringify({ answerId: answerId })
//                body: JSON.stringify({ answerId: answerId, email: email })
            })
            .then(response => response.json())
            .then(data => {
                console.log("서버 응답 수신:", data);

                if (data.success) {
                    // 서버 응답값으로 다시 개수를 업데이트 (최종 보정)
                    likeCountSpan.textContent = data.likeCount;

                    // 버튼 스타일 유지 (추가적인 조작 없이 클래스 적용)
                    if (data.liked) {
                        button.classList.remove("btn-outline-secondary");
                        button.classList.add("btn-success", "text-white");
                    } else {
                        button.classList.remove("btn-success", "text-white");
                        button.classList.add("btn-outline-secondary");
                    }

                } else {
                    alert("추천 처리 중 오류가 발생했습니다.");
                    //  서버 오류 발생 시 ui 롤백
                    likeCountSpan.textContent = currentCount;
                    if (!isLiked) {
                        button.classList.remove("btn-success", "text-white");
                        button.classList.add("btn-outline-secondary");
                    } else {
                        button.classList.remove("btn-outline-secondary");
                        button.classList.add("btn-success", "text-white");
                    }
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("네트워크 오류가 발생했습니다.");

                likeCountSpan.textContent = currentCount;
                if (!isLiked) {
                    button.classList.remove("btn-success", "text-white");
                    button.classList.add("btn-outline-secondary");
                } else {
                    button.classList.remove("btn-outline-secondary");
                    button.classList.add("btn-success", "text-white");
                }
            });

        console.log(button.classList);

        });
    });
});