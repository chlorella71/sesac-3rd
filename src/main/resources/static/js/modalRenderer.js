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

/**
 * 카테고리 폼을 렌더링하는 함수
 * @param {HTMLElement} container - 내용을 넣을 컨테이너
 * @param {Object} data - 초기 데이터 (필요한 경우}
 */
export function renderCategoryCreateForm(container, data) {
    // 폼 생성
    const form = document.createElement('form');
    form.id = 'categoryCreateDTO';
    form.method = 'post';

    // CSRF 토큰 추가 (서버 사이드 템플릿 대신 직접 추가)
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]');

    if (csrfToken && csrfHeader) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf';   // 스프링 시큐리티 기본값 또는 서버 설정에 맞춰 조정
        csrfInput.value = csrfToken.getAttribute('content');
//        csrfInput.name = csrfToken.getAttribute('name');
//        csrfInput.value = csrfHeader.getAttribute('content');
        form.appendChild(csrfInput);
    }

    // 블로그 ID 가져오기 (URL에서 추출 또는 다른 방법으로)
    const blogId = getBlogIdFromURL();  // 이 함수는 구현 필요
    form.action = `/blog/${blogId}/category/create`;

    // 카테고리 이름 입력 필드
    const formGroup = document.createElement('div');
    formGroup.classList.add('mb-3');

    const label = document.createElement('label');
    label.htmlFor = 'categoryName';
    label.classList.add('form-label');
    label.textContent = '카테고리 이름';
    formGroup.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('form-control');
    input.id = 'categoryName';
    input.name = 'name';
    input.required = true;
    formGroup.appendChild(input);

    const feedback = document.createElement('div');
    feedback.classList.add('invalid-feedback');
    feedback.textContent = '카테고리 이름을 입력해주세요.';
    formGroup.appendChild(feedback);

    form.appendChild(formGroup);

    // 버튼 그룹
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('modal-buttons');

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.classList.add('btn', 'btn-secondary', 'modal-close');
    cancelButton.textContent = '취소';
    cancelButton.addEventListener('click', function() {
        // 가장 가까운 모달 찾아서 닫기
        const modal = this.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
    buttonGroup.appendChild(cancelButton);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.classList.add('btn', 'btn-primary');
    submitButton.textContent = '생성';
    buttonGroup.appendChild(submitButton);

    form.appendChild(buttonGroup);

    // 폼 제출 이벤트 핸들러
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 유효성 검사
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            return;
        }

        // 폼 제출
        this.submit();
    });

    // 컨테이너에 폼 추가
    container.appendChild(form);
}

/**
 * URL에서 블로그 ID 추출
 * @returns {string} 블로그 ID
 */
export function getBlogIdFromURL() {
    // URL 경로에서 블로그 ID 추출
    // 예: "/blog/123/view" -> "123"
    const path = window.location.pathname;
    const match = path.match(/\/blog\/(\d+)/);

    if (match && match[1]) {
        return match[1];
    }

    // 기본값 또는 오류 처리
    console.error('블로그 ID를 URL에서 찾을 수 없습니다.');
    return '';
}

/**
 * 카테고리 수정 폼을 렌더링하는 함수
 * @param {HTMLElement} container - 내용을 넣을 컨테이너
 * @param {Object} data - 카테고리 정보 (id, name 등)
 */
export function renderCategoryEditForm(container, data) {
    // 데이터 검증
    if (!data || !data.categoryId) {
        container.innerHTML = '<p class="text-danger">카테고리 정보가 올바르지 않습니다.</p>';
        return;
    }

    const blogId = getBlogIdFromURL();
    const categoryId = data.categoryId;
    const categoryName = data.categoryName || '';

    // 폼 생성
    const form = document.createElement('form');
    form.id = 'categoryEditForm'
    form.classList.add('category-edit-form');

    // CSRF 토큰 추가
    const csrfToken = document.querySelector('meta[name="_csrf"]');
    const csrfHeader = document.querySelector('meta[name="_csrf_header"]');

    if (csrfToken && csrfHeader) {
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_csrf';
        csrfInput.value = csrfToken.content;
        form.appendChild(csrfInput);
    }

    // 카테고리 이름 입력 필드
    const formGroup = document.createElement('div');
    formGroup.classList.add('mb-3');

    const label = document.createElement('label');
    label.htmlFor = 'editCategoryName';
    label.classList.add('form-label');
    label.textContent = '카테고리 이름';
    formGroup.appendChild(label);

    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('form-control');
    input.id = 'editCategoryName';
    input.name = 'name';
    input.value = categoryName;
    input.required = true;
    formGroup.appendChild(input);

    const feedback = document.createElement('div');
    feedback.classList.add('invalid-feedback');
    feedback.textContent = '카테고리 이름을 입력해주세요.';
    formGroup.appendChild(feedback);

    form.appendChild(formGroup);

    // 버튼 그룹
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('modal-buttons');

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.classList.add('btn', 'btn-secondary', 'modal-close');
    cancelButton.textContent = '취소';
    cancelButton.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
    buttonGroup.appendChild(cancelButton);

    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.classList.add('btn', 'btn-primary', 'save-category');
    submitButton.textContent = '저장';
    submitButton.dataset.categoryId = categoryId;
    buttonGroup.appendChild(submitButton);

    form.appendChild(buttonGroup);

    // 컨테이너에 폼 추가
    container.appendChild(form);
}
