import { renderNicknameList, renderCategoryCreateForm, renderCategoryEditForm, getBlogIdFromURL } from "./modalRenderer.js";    // 모듈 가져오기

document.addEventListener("DOMContentLoaded", function () {
    function openModal(modalId, title, data, modalType) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`모달 ID '${modalId}'를 찾을 수 없습니다.`);
            return;
        }

        const modalTitle= modal.querySelector(".modal-title");
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
                case "categoryCreateForm":
                    renderCategoryCreateForm(modalContent, data);
                    break;
                case "categoryEditForm":
                    renderCategoryEditForm(modalContent, data);
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
                        case "categoryCreateForm":
                            renderCategoryCreateForm(modalContent, data);
                            break;
                        case "categoryEditForm":
                            renderCategoryEditForm(modalContent, data);
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
                    case "categoryCreateForm":
                        // 카테고리 생성 폼에 필요한 데이터
                        data = {
                            blogId: this.dataset.blogId || getBlogIdFromURL()
                        };
                        break;
                    default:
                        data = this.dataset.modalData;
                }

                openModal(modalId, title, data, modalType);
            }
        });
    });

    document.querySelectorAll(".edit-category").forEach(button => {
        button.addEventListener("click", function() {
            const categoryId = this.dataset.categoryId;
            const categoryName = this.dataset.categoryName;

            if (!categoryId) {
                console.error("카테고리 ID가 없습니다.");
                return;
            }

            // 모달 열기
            const modal = document.getElementById("editCategoryModal");
            if (modal) {
                const modalContent = modal.querySelector(".modal-content-body");
                if (modalContent) {
                    modalContent.innerHTML = "";
                    renderCategoryEditForm(modalContent, {
                        categoryId: categoryId,
                        categoryName: categoryName
                    });
                }
                modal.style.display = "block";
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

    // 카테고리 삭제 버튼 이벤트 처리
    document.querySelectorAll(".delete-category").forEach(button => {
        button.addEventListener("click", function() {
            const categoryId = this.dataset.categoryId;
            const categoryName = this.dataset.categoryName;

            if (!categoryId) {
                console.error("카테고리 ID가 없습니다.");
                return;
            }

            if (confirm(`"${categoryName}" 카테고리를 정말 삭제하시겠습니까?`)) {
                deleteCategory(categoryId);
            }
        });
    });

    // 저장 버튼 클릭 이벤트 위임 처리
    document.addEventListener("click", function(e) {
        if (e.target && e.target.classList.contains("save-category")) {
            const categoryId = e.target.dataset.categoryId;
            saveCategory(categoryId);
        }
    });

    // 카테고리 저장 기능
    function saveCategory(categoryId) {
        const nameInput = document.getElementById("editCategoryName");
        const newName = nameInput.value.trim();

        if (!newName) {
            nameInput.classList.add("is-invalid");
            return;
        }

        const blogId = getBlogIdFromURL();
//        let blogId = '';
//        const path = window.location.pathname;
//        const match = path.match(/\/blog\/(\d+)/);
//        if (match && match[1]) {
//            blogId = match[1];
//        } else {
//            console.error('블로그 ID를 URL에서 찾을 수 없습니다.');
//        }

        const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;

        // 저장 버튼 상태 업데이트
        const saveButton = document.querySelector(".save-category");
        const originalText = saveButton.textContent;
        saveButton.textContent = "저장 중...";
        saveButton.disabled = true;

        fetch(`/blog/${blogId}/category/${categoryId}/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify({ name: newName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 성공적으로 업데이트 된 경우
                // UI 업데이트 (카테고리 이름 변경)
//                const categoryElements = document.querySelectorAll(`[data-category-id="${categoryId}"]`);
//                categoryElements.forEach(categoryElement => {
//                    // 링크 텍스트나 다른 텍스트 요소 업데이트
//                    categoryElement.textContent = newName;
//                    categoryElement.innerText = newName;
//                });

                // 편집/삭제 버튼의 data-category-name 속성 업데이트
                document.querySelectorAll(`.delete-category[data-category-id="${categoryId}"]`).forEach(btn => {
                    btn.dataset.categoryName = newName;
                });

                document.querySelectorAll(`.delete-category[data-category-id="${categoryId}"]`).forEach(btn => {
                    btn.dataset.categoryName = newName;
                });

                // 리스트 아이템의 내부 텍스트 업데이트
                const listItems = document.querySelectorAll(`.list-group-item[data-category-id="${categoryId}"`);
                listItems.forEach(item => {
                    const link = item.querySelector('a');
                    if (link) {
                        link.textContent = newName;
                    }
                });


//                if (categoryElement) {
//                    categoryElement.textContent = newName;
//                }
//
//                // 편집/삭제 버튼의 data-category-name 속성 업데이트
//                document.querySelectorAll(`.edit-category[data-category-id="${categoryId}"]`).forEach(btn => {
//                    btn.dataset.categoryName = newName;
//                });
//
//                document.querySelectorAll(`.delete-category[data-category-id="${categoryId}"]`).forEach(btn => {
//                    btn.dataset.categoryName = newName;
//                });

                // 모달 닫기
                const modal = document.getElementById("editCategoryModal");
                if (modal) {
                    modal.style.display = "none";
                }

                // 성공 메세지
//                alert("카테고리가 성공적으로 수정되었습니다.");
            } else {
                // 실패 시 오류 메시지
                alert(data.message || "카테고리 수정 중 오류가 발생했습니다.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("카테고리 수정 중 오류가 발생했습니다.");
        })
        .finally(() => {
            // 버튼 상태 복원
            saveButton.textContent = originalText;
            saveButton.disabled = false;
        });
    }

    // 카테고리 삭제 기능
    function deleteCategory(categoryId) {
        const blogId = getBlogIdFromURL();
        const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content

        fetch(`/blog/${blogId}/category/${categoryId}/delete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                [csrfHeader]: csrfToken
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 성공적으로 삭제된 경우 UI에서 카테고리 요소 제거
                const categoryItem = document.querySelector(`.list-group-item:has([data-category-id="${categoryId}"])`);
                if (categoryItem) {
                    categoryItem.remove();
                } else {
                    // :has 선택자가 지원되지 않는 브라우저를 위한 대체 코드
                    document.querySelectorAll(".list-group-item").forEach(item => {
                        if (item.querySelector(`[data-category-id="${categoryId}"]`)) {
                            item.remove();
                        }
                    });
                }

                alert("카테고리가 성공적으로 삭제되었습니다.");

                // 카테고리가 모두 삭제된 경우 메세지 표시
                const categoryList = document.querySelector(".list-group");
                if (categoryList && categoryList.children.length === 0) {
                    const emptyMessage = document.createElement("li");
                    emptyMessage = document.createElement("li");
                    emptyMessage.innerHTML = '<span class="text-muted">카테고리가 없습니다.</span>';
                    categoryList.appendChild(emptyMessage);
                }
            } else {
                alert(data.message || "카테고리 삭제 중 오류가 발생했습니다.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("카테고리 삭제 중 오류가 발생했씁니다.");
        })
    }
});