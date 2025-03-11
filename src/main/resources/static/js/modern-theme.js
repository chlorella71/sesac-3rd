/**
 * modern-theme.js
 * 새로운 테마를 동적으로 적용하는 JavaScript 파일
 */

document.addEventListener('DOMContentLoaded', function() {
  // 새 테마 CSS 파일 로드
  loadStylesheet('/css/modern-theme.css');

  // Google Fonts 로드 (Poppins, Montserrat, Noto Sans KR)
  loadGoogleFonts();

  // 클래스 추가 및 동적 스타일 적용
  applyDynamicStyles();

  // 애니메이션 요소 추가
  addAnimationElements();

  console.log('Modern theme has been applied!');
});

/**
 * CSS 파일을 동적으로 로드하는 함수
 * @param {string} url - CSS 파일 경로
 */
function loadStylesheet(url) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;

  // 기존 CSS 파일 이후에 로드되도록 맨 마지막에 추가
  document.head.appendChild(link);
}

/**
 * Google Fonts 로드 함수
 */
function loadGoogleFonts() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Noto+Sans+KR:wght@300;400;500;700&family=Poppins:wght@300;400;500;600;700&display=swap';
  document.head.appendChild(link);
}

/**
 * 동적 스타일 적용 함수
 */
function applyDynamicStyles() {
  // 모든 포스트 아이템에 애니메이션 지연 적용
  document.querySelectorAll('.post-item').forEach((item, index) => {
    item.style.setProperty('--index', index);
    item.style.animationDelay = `${index * 0.05}s`;
  });

  // 작은 스크린에서 사이드바 토글 기능 향상
  const toggleSidebar = document.querySelector('.navbar-toggler');
  if (toggleSidebar) {
    toggleSidebar.addEventListener('click', function() {
      document.querySelector('.navbar-collapse').classList.toggle('show');
    });
  }

  // 블로그 헤더가 있으면 배경 그라데이션 색상 랜덤화
  const blogHeader = document.querySelector('.blog-header');
  if (blogHeader) {
    const colors = [
      'linear-gradient(135deg, #7c5cff, #ff7eb6)',
      'linear-gradient(135deg, #7c5cff, #00ead3)',
      'linear-gradient(135deg, #ff7eb6, #ffd460)'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    blogHeader.style.background = randomColor;
  }

  // 모든 카드에 그림자 효과 강화
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
      this.style.boxShadow = '';
    });
  });

  // 모든 버튼에 마우스 효과 추가
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
    });

    btn.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });
}

/**
 * 애니메이션 요소 추가 함수
 */
function addAnimationElements() {
  // 블로그 헤더에 장식 요소 추가
  const blogHeader = document.querySelector('.blog-header');
  if (blogHeader) {
    const decoration1 = document.createElement('div');
    decoration1.className = 'header-decoration header-decoration-1';
    decoration1.style.cssText = `
      position: absolute;
      top: -50px;
      right: 10%;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1;
    `;

    const decoration2 = document.createElement('div');
    decoration2.className = 'header-decoration header-decoration-2';
    decoration2.style.cssText = `
      position: absolute;
      bottom: -30px;
      left: 15%;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1;
    `;

    blogHeader.appendChild(decoration1);
    blogHeader.appendChild(decoration2);

    // 헤더 요소들에 애니메이션 추가
    const blogTitle = blogHeader.querySelector('.blog-title');
    const blogDescription = blogHeader.querySelector('.blog-description');

    if (blogTitle) {
      blogTitle.style.cssText = `
        opacity: 0;
        transform: translateY(-20px);
        animation: fadeInDown 0.5s forwards 0.2s;
      `;
    }

    if (blogDescription) {
      blogDescription.style.cssText = `
        opacity: 0;
        transform: translateY(-15px);
        animation: fadeInDown 0.5s forwards 0.4s;
      `;
    }

    // 애니메이션 키프레임 추가
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // 카드 헤더에 장식 요소 추가
  document.querySelectorAll('.card-header').forEach(header => {
    const decoration = document.createElement('div');
    decoration.className = 'card-header-decoration';
    decoration.style.cssText = `
      position: absolute;
      top: 0;
      right: 0;
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.1);
      transform: rotate(45deg) translate(50px, -90px);
      border-radius: 30px;
      z-index: 0;
    `;

    // header의 position이 static인 경우 relative로 변경
    if (window.getComputedStyle(header).position === 'static') {
      header.style.position = 'relative';
    }

    header.appendChild(decoration);
  });
}