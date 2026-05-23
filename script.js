// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Word-by-word stagger reveal for any element marked [data-words]
// Splits on render, then triggers the stagger animation when the element
// scrolls into view (so below-the-fold headlines animate at the right moment).
(function staggerWords() {
  const els = document.querySelectorAll('[data-words]');
  if (!els.length) return;

  // Pre-split each element into <span class="word"> spans (still paused via opacity:0)
  els.forEach((el) => {
    const text = el.textContent.trim();
    const words = text.split(/\s+/);
    el.textContent = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.classList.add('words-ready');
  });

  // Fire the stagger animation when the heading scrolls into view
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.querySelectorAll('.word').forEach((span, i) => {
        span.style.animationDelay = (i * 0.08) + 's';
        span.classList.add('go');
      });
      io.unobserve(el);
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

  els.forEach((el) => io.observe(el));
})();

// Force-start every <video> on the page across all browsers that are
// bashful about autoplay (iOS Safari, some Android browsers in low-power
// mode, etc.)
(function ensureVideosPlay() {
  const vids = Array.from(document.querySelectorAll('video'));
  if (!vids.length) return;
  vids.forEach((v) => {
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
  });
  const tryPlayAll = () => {
    vids.forEach((v) => {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    });
  };
  tryPlayAll();
  vids.forEach((v) => v.addEventListener('canplay', tryPlayAll, { once: true }));
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tryPlayAll();
  });
  // One-shot user-gesture fallback for browsers that block autoplay entirely
  const onGesture = () => { tryPlayAll(); cleanup(); };
  const cleanup = () => {
    document.removeEventListener('touchstart', onGesture);
    document.removeEventListener('click', onGesture);
    document.removeEventListener('scroll', onGesture);
  };
  document.addEventListener('touchstart', onGesture, { once: true, passive: true });
  document.addEventListener('click', onGesture, { once: true });
  document.addEventListener('scroll', onGesture, { once: true, passive: true });
})();

// Scroll reveal — adds .in-view to any .reveal element when it scrolls in
(function scrollReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();
