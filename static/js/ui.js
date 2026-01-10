// ===============================
// GLOBAL UI INTERACTIONS
/*
WHAT ui.js IS FOR (IN SIMPLE WORDS)
ui.js is a shared user-interface helper file.
Its job is to handle common visual and interaction behavior that can be reused across multiple pages.
Think of it as:
“Small JS utilities that make the site feel smooth and consistent.”
WHAT PROBLEMS ui.js SOLVES
1️⃣ COMMON UI BEHAVIOR (SITE-WIDE)
Typical things handled in ui.js:
Mobile menu open / close
Navbar scroll behavior
Button hover effects
Smooth scrolling
Simple animations
Toggle classes like active, open, visible
These are generic behaviors, not page-specific.
That’s why they live in ui.js, not join-us.js.
2️⃣ AVOID DUPLICATING CODE
Without ui.js:
You’d repeat the same JS in many pages
Bugs get fixed in one place but not others
Audits become messy
With ui.js:
One place to review
One place to audit
One place to improve later
This is professional practice.
3️⃣ CLEAR SEPARATION OF RESPONSIBILITY (IMPORTANT)
File	Responsibility
ui.js	Global UI behavior (menus, layout, animations)
join-us.js	Join page only (pills, cards, zoom)
Backend (app.py)	Data, security, consent, routing
This separation is exactly what auditors like to see.
WHAT ui.js DOES NOT DO (VERY IMPORTANT)
ui.js does NOT:
❌ Handle forms
❌ Touch /subscribe
❌ Read email addresses
❌ Send network requests
❌ Track users
❌ Store cookies
❌ Use analytics
❌ Touch personal data
So from a DPDP / CERT-In / government audit view:
✅ Safe
✅ Non-PII
✅ Non-sensitive
✅ No consent implications
WHY KEEP ui.js EVEN IF IT’S SMALL
Because in the future you may:
Add new pages
Add a mobile menu
Add accessibility helpers
Add keyboard navigation
Add announcement banners
All of that belongs in ui.js, not scattered everywhere.
So ui.js is future insurance, not bloat.*/
// ===============================

// Click interaction (mouse + touch)
document
  .querySelectorAll('.interactive, .value-chip, .info-card, .pill')
  .forEach(el => {
      el.addEventListener('click', () => {
          el.classList.add('active');
          setTimeout(() => el.classList.remove('active'), 350);
      });
  });


// ===============================
// SCROLL REVEAL (SUBTLE)
// ===============================
const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// ===============================
// INFO CARD PARALLAX (DESKTOP ONLY)
// ===============================
if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.info-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;

            card.style.transform =
                `translateY(-6px) scale(1.03) translate(${x * 6}px, ${y * 6}px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}
(function () {
    const viewer = document.getElementById("imageViewer");
    const viewerImg = document.getElementById("viewerImage");

    if (!viewer || !viewerImg) return;

    let scale = 1;
    let lastTap = 0;
    let startDist = null;

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function applyScale() {
        viewerImg.style.transform = `scale(${scale})`;
    }

    window.openViewer = function (src) {
        scale = 1;
        viewerImg.src = src;
        applyScale();
        viewer.style.display = "flex";
        document.body.style.overflow = "hidden";
    };

    window.closeViewer = function () {
        viewer.style.display = "none";
        viewerImg.src = "";
        document.body.style.overflow = "";
    };

    /* Click outside closes */
    viewer.addEventListener("click", e => {
        if (e.target === viewer) closeViewer();
    });

    /* Keyboard accessibility */
    document.addEventListener("keydown", e => {
        if (viewer.style.display !== "flex") return;

        if (e.key === "Escape") closeViewer();
        if (e.key === "+" || e.key === "=") {
            scale = clamp(scale + 0.1, 1, 3);
            applyScale();
        }
        if (e.key === "-") {
            scale = clamp(scale - 0.1, 1, 3);
            applyScale();
        }
        if (e.key === "0") {
            scale = 1;
            applyScale();
        }
    });

    /* Mouse wheel zoom */
    viewerImg.addEventListener("wheel", e => {
        e.preventDefault();
        scale = clamp(scale + (e.deltaY < 0 ? 0.12 : -0.12), 1, 3);
        applyScale();
    });

    /* Double tap to close */
    viewerImg.addEventListener("touchend", () => {
        const now = Date.now();
        if (now - lastTap < 300) closeViewer();
        lastTap = now;
    });

    /* Pinch zoom (mobile) */
    viewerImg.addEventListener("touchstart", e => {
        if (e.touches.length === 2) {
            startDist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
        }
    });

    viewerImg.addEventListener("touchmove", e => {
        if (e.touches.length === 2 && startDist) {
            const newDist = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            scale = clamp(scale * (newDist / startDist), 1, 3);
            startDist = newDist;
            applyScale();
        }
    });

    /* Soft protection */
    viewerImg.addEventListener("contextmenu", e => e.preventDefault());
    viewerImg.setAttribute("draggable", "false");
})();

(function () {
    const emailInput = document.querySelector('input[name="email"]');
    const form = emailInput?.closest("form");

    if (!emailInput || !form) return;

    const errorEl = document.createElement("div");
    errorEl.style.color = "#ffb4b4";
    errorEl.style.fontSize = "0.9rem";
    errorEl.style.marginTop = "6px";
    emailInput.after(errorEl);

    // Strict but practical email rule (production-safe)
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    emailInput.addEventListener("input", () => {
        const value = emailInput.value.trim();

        if (!value) {
            errorEl.textContent = "";
            return;
        }

        if (!EMAIL_REGEX.test(value)) {
            errorEl.textContent =
                "Please enter a valid email address (letters, numbers only).";
            emailInput.setCustomValidity("Invalid email");
        } else {
            errorEl.textContent = "";
            emailInput.setCustomValidity("");
        }
    });

    form.addEventListener("submit", (e) => {
        if (!EMAIL_REGEX.test(emailInput.value.trim())) {
            e.preventDefault();
            emailInput.focus();
        }
    });
})();