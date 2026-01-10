// ===============================
// GOVERNMENT-GRADE INTERACTIONS
// ===============================
// 
/*
WHAT THE join-us.js IS MEANT TO DO (IN SIMPLE WORDS)
The JavaScript on the Join Us page is NOT for security and NOT for subscription logic.
Its purpose is purely user experience (UX).
It does three main things:
1️⃣ VISUAL INTERACTION (PILLS / CARDS)
What the user sees
Clickable pills like:
🔐 Privacy
🛡️ Security
⚖️ Compliance
Cards that zoom or highlight when clicked
What the JS does
Adds or removes CSS classes like active or zoomed
Ensures only one pill/card is active at a time
Prevents accidental multiple selections
👉 This makes the page feel interactive and modern
2️⃣ ZOOM / OVERLAY BEHAVIOR
What the user sees
Clicking a card enlarges it
Background darkens
Clicking outside closes it
What the JS does
Toggles a .zoomed class on the card
Toggles a .active class on the overlay
Listens for click events to close cleanly
👉 This is visual polish, not data processing
3️⃣ PREVENTS ACCIDENTAL CLICKS / MISFIRES
Some JS blocks:
e.preventDefault();
e.stopPropagation();
Why?
Prevents clicks from triggering parent elements
Prevents unexpected page behavior
Keeps UI predictable
👉 This is defensive UI coding, not tracking.
WHAT THE JS IS NOT DOING (VERY IMPORTANT)
❌ It does NOT:
Read email input
Send data to server
Touch /subscribe
Log user behavior
Track users
Store cookies
Call third-party APIs
So from a privacy + government compliance view:
✅ Completely safe
✅ No personal data handling
✅ No DPDP impact
✅ No CERT-In concern */
// --------------------------------
// CLICK INTERACTIONS (Mouse + Touch)
// --------------------------------
document
  .querySelectorAll('.interactive, .value-chip, .info-card, .pill')
  .forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      el.classList.add('active');

      setTimeout(() => {
        el.classList.remove('active');
      }, 400);
    });
  });


// --------------------------------
// AMAZON-STYLE PARALLAX (Desktop only)
// --------------------------------
document.querySelectorAll('.info-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const moveX = (x / rect.width - 0.5) * 6;
    const moveY = (y / rect.height - 0.5) * 6;

    card.style.transform =
      `translateY(-6px) scale(1.025) translate(${moveX}px, ${moveY}px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// --------------------------------
// SCROLL REVEAL (Fade-in)
// --------------------------------
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
// ZOOM OVERLAY SYSTEM
// ===============================

// Create overlay once
const overlay = document.createElement('div');
overlay.className = 'zoom-overlay';
document.body.appendChild(overlay);


// --------------------------------
// CARD ZOOM
// --------------------------------
document.querySelectorAll('.zoom-card').forEach(card => {
  card.addEventListener('click', e => {
    e.stopPropagation();

    document.querySelectorAll('.zoom-card').forEach(c => {
      c.classList.remove('zoomed');
    });

    overlay.classList.add('active');
    card.classList.add('zoomed');
  });
});


// --------------------------------
// WORD ZOOM
// --------------------------------
document.querySelectorAll('.zoom-word').forEach(word => {
  word.addEventListener('click', e => {
    e.stopPropagation();

    word.classList.add('zoomed');

    setTimeout(() => {
      word.classList.remove('zoomed');
    }, 500);
  });
});


// --------------------------------
// CLOSE ON BACKGROUND CLICK
// --------------------------------
overlay.addEventListener('click', () => {
  overlay.classList.remove('active');

  document.querySelectorAll('.zoom-card').forEach(c => {
    c.classList.remove('zoomed');
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.select-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });
});

