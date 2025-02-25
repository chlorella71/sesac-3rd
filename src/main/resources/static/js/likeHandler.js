document.addEventListener("DOMContentLoaded", function () {
    const likeElements = document.querySelectorAll(".like");

    likeElements.forEach(button => {
        button.addEventListener("click", function () {
//            if (!confirm("정말로 추천하시겠습니까?")) {
//                return;
//            }

            const answerId = this.dataset.answerId;
            console.log("추천 버튼 클릭됨! Answer Id:", answerId);
//            const email = this.dataset.email;
//
//            if (!email || email === "null") {   // "null" 문자열이 들어올 수도 있으므로 추가 체크
//                alert("추천 기능을 사용하려면 로그인해야 합니다.");
//                return;
//            }

            // csrf 토큰 가져오기 (로그인하지 않은 경우 undefined가 될 수 있음)
            const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
            const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

            console.log("CSRF Token:", csrfToken);
            console.log("CSRF Header:", csrfHeader);
            

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
                body: JSON.stringify({ answerId: answerId })
//                body: JSON.stringify({ answerId: answerId, email: email })
            })
            .then(response => response.json())
            .then(data => {
                console.log("서버 응답 수신:", data);

                if (data.success) {
                    // 추천 개수 업데이트
                    const likeCountSpan = button.querySelector(".like-count");
                    let currentCount = parseInt(likeCountSpan.textContent, 10) || 0;
                    if (likeCountSpan) {
                        likeCountSpan.textContent = data.likeCount;
                        console.log(`추천 개수 업데이트됨: ${data.likeCount}`);
                    } else {
                        console.error("likeCountSpan 요소를 찾을 수 없습니다.")
                    }

                    // 버튼 스타일 변경 (글자색 즉시 반영)
                    if (data.liked) {
                        button.classList.remove("btn-outline-secondary", "text-black", "bg-white"); // 기존 스타일 제거
                        button.classList.add("btn-success", "text-white", "bg-green");  // 초록 버튼 + 흰색 글자
                        likeCountSpan.textContent = currentCount + 1;   // 추천 증가
//                        button.style.backgroundColor = "#198754";   // 초록색 버튼
//                        button.style.color= "#fff"; // 흰색 글자
                    } else {
                        button.classList.remove("btn-success", "text-white", "bg-green");   // 기존 스타일 제거
                        button.classList.add("btn-outline-secondary", "text-black", "bg-white");    // 회색 버튼 + 검은색 글자
                        likeCountSpan.textContent = currentCount - 1;   // 추천 취소
//                        button.style.backgroundColor = "#fff";   // 하얀색 버튼
//                        button.style.color = "#212529"; // 검은색 글자
                    }

                    console.log(button.classList);

//                    // 버튼 내부 텍스트도 변경 (UI 더 직관적으로 만들기
//                    button.innerHTML = `추천 <span class="badge rounded-pill bg-success like-count">${data.likeCount}</span>`;

//                    setTimeout(() => {
//                        if (data.liked) {
//                            button.style.backgroundColor = "#198754";   // Bootstrap btn-success 색상
//                            button.style.color = '#fff'; // 글자색 흰색
//                        } else {
//                            button.style.backgroundColor = "#fff";  // 버튼 원래 색상 (하얀색)
//                            button.style.color = "#212529"; // 글자색 검은색
//                        }
//                    }, 10); // 10ms 후 스타일 강제 적용

                    likeCountSpan.textContent = data.likeCount;

//                    // 추천 개수 업데이트
//                    this.querySelector(".like-count").textContent = data.likeCount;

                    // 버튼 스타일 변경
                    if (data.liked) {
                        this.classList.add("btn-success");
                        this.classList.remove("btn-outline-secondary");
                    } else {
                        this.classList.add("btn-outline-secondary");
                        this.classList.remove("btn-success");
                    }
                } else {
                    alert("추천 처리 중 오류가 발생했습니다.");
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