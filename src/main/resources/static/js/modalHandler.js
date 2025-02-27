import { renderNicknameList } from "./modalRenderer.js";    // 모듈 가져오기
import { renderCategoryCreateForm } from "./categoryRenderer.js";

document.addEventListener("DOMContentLoaded", function () {
    function openModal(modalId, title, data, modalType) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`모달 ID '${modalId}'를 찾을 수 없습니다.`);
            return;
        }

        const modalTitle= modal.querySelector("modal-title");
        const modalContent = modal.querySelector(".modal-content-body");

        // 제목 변경 (제공된 경우)
        if (modalTitle && title) {
            modalTitle.textContent = title;
        }

        // 모달 내용 초기화
        if (modalContent) {
            modalContent.innerHTML = "";

            // 모달 타입에 따라 다른 렌더링 함수 사용
            switch(modalType) {
                case "nicknameList":
                    renderNicknameList(modalContent, data);
                    break;
                default:
                    // 기본값은 추천자 목록
                    renderNicknameList(modalContent, data);
            }
        }

        // 모달 표시
        modal.style.display = "block";

//        // 모달 내용 채우기
//        if (modalContent) {
//            modalContent.innerHTML = "";    // 기존 내용 초기화
//            renderNicknameList(modalContent, data);
//        }
//
////        modalTitle.textContent = title; // 모달 제목 변경
////        modalContent.innerHTML = "";    // 기존 내용 초기화
////        renderFunction(modalContent, data); // 렌더링 함수 실행
//
//        modal.style.display = "block";  // 모달 표시
//
//        fetch(contentUrl)
//            .then(response => response.json())
//            .then(data => {
//                modalContent.innerHTML = "";    // 기존 내용 초기화
//                renderFunction(modalContent, data); // 렌더링 함수 실행
//                modal.style.display = "block";  // 모달 표시
//            })
//            .catch(error => console.error(`${title} 가져오기 실패:`, error));

    }

    // API를 통해 데이터를 가져와 모달에 표시하는 함수
    function fetchDataAndOpenModal(modalId, title, url, modalType) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`모달 ID '${modalId}'를 찾을 수 없습니다.`);
            return;
        }

        const modalTitle = modal.querySelector(".modal-title");
        const modalContent = modal.querySelector(".modal-content-body");

        // 제목 변경 (제공된 경우)
        if (modalTitle && title) {
            modalTitle.textContent = title;
        }

        // 로딩 표시
        if (modalContent) {
            modalContent.innerHTML = "<p class='loading'>데이터를 불러오는 중...</p>";
        }

        // 모달 먼저 표시
        modal.style.display = "block";

        // API 호출
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("서버 응답 오류: " + response.status);
                }
                return response.json();
            })
            .then(data => {
                // 성공적으로 데이터를 가져왔을 때 모달 내용 업데이트
                if (modalContent) {
                    modalContent.innerHTML = "";

                    // 모달 타입에 따라 다른 렌더링 함수 사용
                    switch(modalType) {
                        case "nicknameList":
                            renderNicknameList(modalContent, data);
                            break;
                        default:
                            // 기본값은 추천자 목록
                            renderNicknameList(modalContent, data);
                    }
                }
            })
            .catch(error => {
                console.error("데이터 가져오기 오류:", error);
                if (modalContent) {
                    modalContent.innerHTML = `<p class='error'>데이터를 불러오는 중 오류가 발생했습니다: ${error.message}</p>`;
                }
            })
    }

    // 모달 닫기 함수
    function closeModal(modal) {
        if (modal) {
            modal.style.display = "none";
        }
    }

    // 모달 열기 버튼에 이벤트 리스터 추가
    document.querySelectorAll(".open-modal").forEach(button => {
        button.addEventListener("click", function() {
            // 데이터 속성에서 정보 가져오기
            const answerId = this.dataset.answerId;
            const modalId = answerId ? `likeModal-${answerId}` : this.dataset.modalId;
            const title = this.dataset.modalTitle;
            const modalType = this.dataset.modalType || "nicknameList"; // 기본값은 추천자 목록

            // 데이터 소스 유형 확인
            const dataSource = this.dataset.dataSource || "inline"; // 기본값은 인라인 데이터

            if (dataSource === "api") {
                // API에서 데이터 가져오기
                const apiUrl = this.dataset.apiUrl;
                if (!apiUrl) {
                    console.error("API URL이 저장되지 않았습니다.");
                    return;
                }
                fetchDataAndOpenModal(modalId, title, apiUrl, modalType);
            } else {
                // 인라인 데이터 사용
                let data;

                switch(modalType) {
                    case "nicknameList":
                        data = this.dataset.nicknameList;
                        break;
                    default:
                        data = this.dataset.modalData;
                }

                openModal(modalId, title, data, modalType);
            }
        });
    });

//    // 모든 모달 열기 버튼에 대해 이벤트 추가
//    document.querySelectorAll(".open-modal").forEach(button => {
//        button.addEventListener("click", function() {
//            const modalId = this.dataset.modalId || "dynamicModal"; // 기본 모달 Id
//            const title = this.dataset.modalTitle || "정보";
//            const type = this.dataset.type; // 데이터 유형 (nicknameList, Ajax 등)
//            let content = this.dataset.content || "";   // 기본 데이터
////            const contentUrl = this.dataset.contentUrl;
//
//            let renderFunction = (container, data) => { container.innerHTML = `<p>${data}</p>`; };  // 기본 렌더링
//
//            if (type === "nicknameList") {
//                renderFunction = renderNicknameList;    // 추천 목록 렌더링
//                content = this.dataset.nicknameList || "";
//            } else if (type === "ajax") {
//                const contentUrl = this.dataset.contentUrl;
//                fetch(contentUrl)
//                    .then(response => response.json())
//                    .then(data => {
//                        openModal(modalId, title, data, renderFunction);
//                    })
//                    .catch(error => console.error(`${title} 가져오기 실패:`, error));
//                return;
//            }
//
//            openModal(modalId, title, contentUrl, renderFunction);

//            openModal(modalId, title, contentUrl, (container, data) => {
//                if (data.length === 0) {
//                    container.innerHTML = "<p>데이터가 없습니다.</p>";
//                } else {
//                    const list = document.createElement("ul");
//                    data.forEach(item => {
//                        const li= document.createElement("li");
//                        li.textContent= item;
//                        list.appendChild(li);
//                    });
//                    container.appendChild(list);
//                }
//            });
//        }) ;
//    });

    // 모든 모달 닫기 버튼에 대해 이벤트 추가
    document.querySelectorAll(".modal .close").forEach(closeButton => {
        closeButton.addEventListener("click", function () {
            closeModal(this.closest(".modal"));
        });
    });

    // 모달 바깥 클릭 시 닫기
    window.addEventListener("click", (event) => {
        document.querySelectorAll(".modal").forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });

    // ESC 키 누르면 모달 닫기
    document.addEventListener("keydown", function(event) {
        if (event.key === "Escape") {
            document.querySelectorAll(".modal").forEach(modal => {
                if (modal.style.display === "block") {
                    closeModal(modal);
                }
            });
        }
    });
});