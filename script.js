// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Word-by-word stagger reveal for any element marked [data-words]
(function staggerWords() {
  document.querySelectorAll('[data-words]').forEach((el) => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      span.style.animationDelay = (0.35 + i * 0.09) + 's';
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.classList.add('words-ready');
  });
})();

// Force-start the hero video on every browser that's bashful about autoplay
// (iOS Safari, some Android browsers in low-power mode, etc.)
(function ensureVideoPlays() {
  const v = document.querySelector('.hero-video');
  if (!v) return;
  v.muted = true;
  v.defaultMuted = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');
  const tryPlay = () => {
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };
  tryPlay();
  v.addEventListener('canplay', tryPlay, { once: true });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlay();
  });
  // One-shot user-gesture fallback for browsers that block autoplay entirely
  const onGesture = () => { tryPlay(); cleanup(); };
  const cleanup = () => {
    document.removeEventListener('touchstart', onGesture);
    document.removeEventListener('click', onGesture);
    document.removeEventListener('scroll', onGesture);
  };
  document.addEventListener('touchstart', onGesture, { once: true, passive: true });
  document.addEventListener('click', onGesture, { once: true });
  document.addEventListener('scroll', onGesture, { once: true, passive: true });
})();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Subtle parallax on background blobs
const blobs = document.querySelectorAll('.bg-blob');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const y = window.scrollY;
      blobs.forEach((b, i) => {
        const speed = (i + 1) * 0.05;
        b.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
