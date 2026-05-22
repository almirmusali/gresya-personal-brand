// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Generate floating gold sparkles
const sparkleContainer = document.getElementById('sparkles');
const SPARKLE_COUNT = window.innerWidth < 640 ? 18 : 36;

function spawnSparkle() {
  const s = document.createElement('div');
  s.className = 'sparkle';
  const size = 2 + Math.random() * 4;
  s.style.width = size + 'px';
  s.style.height = size + 'px';
  s.style.left = Math.random() * 100 + 'vw';
  s.style.top = (100 + Math.random() * 10) + 'vh';
  s.style.animationDuration = (6 + Math.random() * 8) + 's';
  s.style.animationDelay = (Math.random() * 4) + 's';
  s.style.opacity = String(0.6 + Math.random() * 0.4);
  sparkleContainer.appendChild(s);

  // recycle
  setTimeout(() => {
    s.remove();
    spawnSparkle();
  }, 14000);
}

for (let i = 0; i < SPARKLE_COUNT; i++) {
  setTimeout(spawnSparkle, i * 250);
}

// Subtle parallax on hero glows when scrolling
const glows = document.querySelectorAll('.bg-glow');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  glows.forEach((g, i) => {
    const speed = (i + 1) * 0.04;
    g.style.transform = `translate(${y * speed * 0.2}px, ${y * speed}px)`;
  });
}, { passive: true });
