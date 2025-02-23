document.addEventListener("DOMContentLoaded", function () {
    const csrfMeta = document.querySelector('meta[name="_csrf"]');
    const csrfHeaderMeta = document.querySelector('meta[name="_csrf_header"]');

    if (csrfMeta && csrfHeaderMeta) {   // 로그인한 경우에만 실행
        window.csrfToken = csrfMeta.content;
        window.csrfHeader = csrfHeaderMeta.content;
    }
})

//document.addEventListener("DOMContentLoaded", function () {
//    window.csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
//    window.csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;
//})