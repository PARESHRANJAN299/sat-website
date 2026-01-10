document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target); // animate once
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    reveals.forEach(el => observer.observe(el));
});

/* =====================================================
   Seamless background video loop
   Fixes blink / pause on short videos
===================================================== */
/* =====================================================
   Seamless background video loop for privacy_low_video.mp4
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector(".hero-video");
    if (!video) return;

    // Ensure autoplay works on all browsers
    video.play().catch(() => {});

    // Manual seamless loop using requestAnimationFrame
    const loopVideo = () => {
        if (video.currentTime >= video.duration - 0.02) {
            video.currentTime = 0;
        }
        requestAnimationFrame(loopVideo);
    };

    requestAnimationFrame(loopVideo);

    // Resume if browser pauses it
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) video.play().catch(() => {});
    });
});

