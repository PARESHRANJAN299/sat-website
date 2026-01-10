/* =========================================================
   PRIVACY & LAW – MASTER CONTROLLER
========================================================= */

const UI = {
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
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

  // Day / Night brightness only
  const hour = new Date().getHours();
  video.style.filter =
    hour >= 6 && hour < 18
      ? 'brightness(0.95) contrast(1.05)'
      : 'brightness(0.8) contrast(1.1)';

  video.addEventListener('loadedmetadata', () => {
    video.currentTime = 0;
    video.play().catch(() => {});
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
    { threshold: 0.15 }
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
        document.body.style.setProperty(
          '--zoom-factor',
          scale
        );
        lastScale = scale;
      }
    })
  );
})();
