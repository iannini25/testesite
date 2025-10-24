// Efeitos de scroll: Intersection Observer (reveal) + Parallax
(function () {
  // Reveal
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) e.target.classList.add('is-inview');
    }
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal-up, .reveal-fade, [data-observe]').forEach(el => io.observe(el));

  // Parallax (suave e sem jank)
  const parallaxEls = [...document.querySelectorAll('[data-parallax]')];
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const top = window.scrollY || window.pageYOffset;
        parallaxEls.forEach(el => {
          const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
          el.style.transform = `translate3d(0, ${top * -speed}px, 0)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Suavizar âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// Destacar link ativo no menu lateral conforme a seção visível
(function(){
  const sideLinks = document.querySelectorAll('.side-nav a[href^="#"]');
  if (!sideLinks.length) return;

  const targets = [...sideLinks].map(a => {
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    return el ? { a, el } : null;
  }).filter(Boolean);

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const it = targets.find(t => t.el === e.target);
      if (!it) return;
      if (e.isIntersecting){
        sideLinks.forEach(l => l.classList.remove('is-active'));
        it.a.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });

  targets.forEach(t => io.observe(t.el));
})();
