/* =========================================================
   PRIVACY & LAW – MASTER CONTROLLER
   Mobile-Optimized Version
========================================================= */

const UI = {
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  isMobile: window.innerWidth <= 768,
  
  throttle(fn, wait = 16) {
    let last = 0;
    return (...args) => {
      const now = performance.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      }
    };
  }
};


/* ================= HERO VIDEO ================= */
(function heroVideo() {
  const video = document.querySelector('.hero-video');
  if (!video || UI.reducedMotion) return;

  const hour = new Date().getHours();
  const isMobile = UI.isMobile;
  
  if (isMobile) {
    video.style.filter = 'brightness(0.85) contrast(1.05)';
  } else {
    video.style.filter = hour >= 6 && hour < 18
      ? 'brightness(0.95) contrast(1.05)'
      : 'brightness(0.8) contrast(1.1)';
  }

  video.addEventListener('loadedmetadata', () => {
    video.currentTime = 0;
    video.play().catch(err => {
      console.log('Video autoplay prevented:', err);
      video.poster = '/static/images/privacy-poster.jpg';
    });
  });

  if (video.paused) {
    video.load();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  });
})();


/* ================= REVEAL ON SCROLL ================= */
(function reveal() {
  const items = document.querySelectorAll('.reveal, .privacy-card');
  
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { 
      threshold: UI.isMobile ? 0.1 : 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );
  
  items.forEach(el => observer.observe(el));
})();


/* ================= SCROLL PERFORMANCE PROFILING ================= */
(function scrollProfiler() {
  let lastScale = window.visualViewport?.scale || 1;
  
  window.visualViewport?.addEventListener(
    'resize',
    UI.throttle(() => {
      const scale = window.visualViewport.scale;
      if (scale !== lastScale) {
        document.body.style.setProperty('--zoom-factor', scale);
        lastScale = scale;
      }
    })
  );
})();


/* ================= MOBILE VIDEO ORIENTATION FIX ================= */
(function orientationHandler() {
  if (!UI.isMobile) return;
  
  const video = document.querySelector('.hero-video');
  if (!video) return;
  
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      video.load();
      video.play().catch(() => {});
    }, 300);
  });
})();


/* ================= MOBILE VIEWPORT HEIGHT FIX ================= */
(function viewportFix() {
  if (!UI.isMobile) return;
  
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVh();
  window.addEventListener('resize', UI.throttle(setVh, 100));
})();
