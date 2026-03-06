/* ═══════════════════════════════════════════
   SYSTEMSTRIDE — Main JavaScript
   GSAP + CustomEase + ScrollTrigger + Lenis
   Lead Generation · Cinematic Motion
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════
     0. GSAP SETUP + EASING TOKENS
     ══════════════════════════════════════════ */

  gsap.registerPlugin(ScrollTrigger, CustomEase);

  // Exact SVG-path representations of the three brand cubic-beziers
  CustomEase.create('sig', 'M0,0 C0.22,1 0.36,1 1,1');   // --ease-signature
  CustomEase.create('smo', 'M0,0 C0.4,0 0.2,1 1,1');     // --ease-smooth
  CustomEase.create('flt', 'M0,0 C0.25,0.8 0.25,1 1,1'); // --ease-float

  /* ══════════════════════════════════════════
     1. LENIS
     ══════════════════════════════════════════ */

  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* ══════════════════════════════════════════
     2. CUSTOM CURSOR
     ══════════════════════════════════════════ */

  const cursor = document.getElementById('customCursor');

  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    document.documentElement.style.cursor = 'auto';
  } else {
    let mouseX = 0, mouseY = 0, cx = 0, cy = 0;
    const lerp = 0.18;

    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

    (function loop() {
      cx += (mouseX - cx) * lerp;
      cy += (mouseY - cy) * lerp;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .cursor-hover')) cursor.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .cursor-hover')) cursor.classList.remove('hover');
    });
  }

  /* ══════════════════════════════════════════
     3. NAVBAR — FIXED CENTERING APPROACH
     The CSS `transform: translateX(-50%)` must
     stay intact. We animate `margin-top` for the
     entrance instead of GSAP's `y` (which would
     override and break the centering).
     ══════════════════════════════════════════ */

  const navbar = document.getElementById('navbar');

  // Navbar starts at margin-top: -120px via CSS, opacity: 0
  // We animate margin-top → 0 and opacity → 1
  // This preserves the translateX(-50%) centering completely.

  /* ══════════════════════════════════════════
     4. INTRO SEQUENCE — Integrated page birth
     Scanline → headline weight → context → UI
     ══════════════════════════════════════════ */

  const introLine   = document.getElementById('introLine');
  const heroEyebrow = document.getElementById('heroEyebrow');
  const heroLine1   = document.getElementById('heroLine1');
  const heroLine2   = document.getElementById('heroLine2');
  const heroSubhead = document.getElementById('heroSubhead');
  const heroCta     = document.getElementById('heroCta');
  const heroChips   = document.getElementById('heroChips');
  const heroScrollHint = document.getElementById('heroScrollHint');
  const bgRipple    = document.getElementById('bgRipple');

  const intro = gsap.timeline({ defaults: { ease: 'sig' } });

  intro
    // Scanline draws
    .set(introLine, { opacity: 1, width: 0 })
    .to(introLine, { width: '100%', duration: 0.5, ease: 'smo' })
    .to(introLine, { opacity: 0, duration: 0.2, ease: 'smo' }, '-=0.08')

    // "Start receiving." — the promise lands first, with maximum weight
    .to(heroLine2, { y: 0, opacity: 1, duration: 1.15 }, '-=0.1')

    // "Stop hunting." — the problem, adds tension
    .to(heroLine1, { y: 0, opacity: 1, duration: 0.9 }, '-=0.78')

    // Eyebrow pill materializes
    .to(heroEyebrow, { y: 0, opacity: 1, duration: 0.65, ease: 'flt' }, '-=0.55')

    // Subhead
    .to(heroSubhead, { y: 0, opacity: 1, duration: 0.7 }, '-=0.45')

    // CTAs
    .to(heroCta, { y: 0, opacity: 1, duration: 0.65 }, '-=0.48')

    // Navbar — uses marginTop, not y, to preserve translateX(-50%)
    .to(navbar, {
      marginTop: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'flt',
    }, '-=0.5')

    // Proof chips slide in from right
    .to(heroChips, { x: 0, opacity: 1, duration: 0.7, ease: 'flt' }, '-=0.55')

    // Background atmosphere — ripple, bg image subtle brighten
    .to(bgRipple, { opacity: 1, duration: 1.4, ease: 'smo' }, '-=0.6')

    // Scroll hint appears last
    .to(heroScrollHint, { opacity: 0.5, duration: 0.8, ease: 'flt' }, '-=0.3');

  /* ══════════════════════════════════════════
     5. NAVBAR — Scroll behavior
     ══════════════════════════════════════════ */

  // Flip to light nav once user leaves dark hero
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom 80px',
    onEnter:     () => { navbar.classList.add('scrolled'); navbar.classList.remove('hero-dark'); },
    onLeaveBack: () => { navbar.classList.remove('scrolled'); navbar.classList.add('hero-dark'); },
  });

  // Hide scroll hint
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top+=100 top',
    onEnter:     () => gsap.to(heroScrollHint, { opacity: 0, duration: 0.4, ease: 'smo' }),
    onLeaveBack: () => gsap.to(heroScrollHint, { opacity: 0.5, duration: 0.4, ease: 'smo' }),
  });

  /* ══════════════════════════════════════════
     6. HERO SCROLL EFFECTS
     The signature effect: landscape image zooms IN
     as you scroll AWAY — like the world is pulling
     you deeper as you leave.
     ══════════════════════════════════════════ */

  // Image zooms in as you scroll down (scale 1.0 → 1.18)
  gsap.fromTo('.hero__bg-img',
    { scale: 1.0 },
    {
      scale: 1.18,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    }
  );

  // Hero content drifts upward + fades as you scroll away
  gsap.to('.hero__content', {
    y: -120,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  // Chips drift up faster than content — parallax depth
  gsap.to('.hero__chips', {
    y: -80,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });

  // Ripple circles drift as you scroll (adds to the idle animation)
  gsap.to(bgRipple, {
    scale: 1.2,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  /* ══════════════════════════════════════════
     7. SERVICES SECTION
     ══════════════════════════════════════════ */

  gsap.to('#services .reveal-label', {
    opacity: 1, y: 0, duration: 0.7, ease: 'sig',
    scrollTrigger: { trigger: '#services .reveal-label', start: 'top 88%' }
  });

  gsap.to('#servicesTitle .clip-reveal span', {
    y: 0, duration: 0.85, stagger: 0.07, ease: 'sig',
    scrollTrigger: { trigger: '#servicesTitle', start: 'top 82%' }
  });

  document.querySelectorAll('.service-card').forEach((card, i) => {
    const fromX = i % 2 === 0 ? -70 : 70;
    gsap.fromTo(card,
      { x: fromX, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.85, ease: 'sig',
        scrollTrigger: { trigger: card, start: 'top 87%' } }
    );
  });

  /* ══════════════════════════════════════════
     8. STATS BAR
     ══════════════════════════════════════════ */

  const statsBar = document.getElementById('statsBar');

  gsap.to(statsBar, {
    y: 0, opacity: 1, duration: 0.8, ease: 'sig',
    scrollTrigger: {
      trigger: statsBar,
      start: 'top 88%',
      onEnter: () => {
        document.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          gsap.fromTo({ val: 0 }, { val: target }, {
            val: target, duration: 1.8, ease: 'sig',
            onUpdate: function() { el.textContent = Math.round(this.targets()[0].val); }
          });
        });
        document.querySelectorAll('[data-text]').forEach((el, i) => {
          setTimeout(() => { el.textContent = el.dataset.text; }, 600 + i * 150);
        });
      }
    }
  });

  gsap.fromTo('.stat-item',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'sig',
      scrollTrigger: { trigger: statsBar, start: 'top 88%' } }
  );

  /* ══════════════════════════════════════════
     9. IMAGE BREAK — Inner parallax
     Container clips. Image moves slower than scroll.
     Classic agency depth technique.
     ══════════════════════════════════════════ */

  gsap.fromTo('.image-break__img',
    { y: '-60px', scale: 1.08 },
    {
      y: '60px',
      ease: 'none',
      scrollTrigger: {
        trigger: '.image-break__container',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    }
  );

  gsap.to('.image-break__quote', {
    opacity: 1, y: 0, duration: 1, ease: 'sig',
    scrollTrigger: { trigger: '.image-break__overlay', start: 'top 70%' }
  });

  /* ══════════════════════════════════════════
     10. PHILOSOPHY — Animated mesh + text scrub
     ══════════════════════════════════════════ */

  const meshSvg   = document.getElementById('meshSvg');
  const meshNodes = [];

  for (let i = 0; i < 30; i++) {
    const cx = Math.random() * 1200;
    const cy = Math.random() * 600;
    const c  = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', cx); c.setAttribute('cy', cy);
    c.setAttribute('r', 2.5); c.setAttribute('fill', 'var(--color-bridge)');
    meshSvg.appendChild(c);
    meshNodes.push({ el: c, x: cx, y: cy });
    gsap.to(c, {
      attr: { cx: cx + (Math.random() - 0.5) * 80, cy: cy + (Math.random() - 0.5) * 60 },
      duration: 8 + Math.random() * 4, repeat: -1, yoyo: true, ease: 'flt',
    });
  }

  for (let i = 0; i < meshNodes.length; i++) {
    for (let j = i + 1; j < meshNodes.length; j++) {
      const dx = meshNodes[i].x - meshNodes[j].x;
      const dy = meshNodes[i].y - meshNodes[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 200) {
        const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        ln.setAttribute('x1', meshNodes[i].x); ln.setAttribute('y1', meshNodes[i].y);
        ln.setAttribute('x2', meshNodes[j].x); ln.setAttribute('y2', meshNodes[j].y);
        ln.setAttribute('stroke', 'var(--color-bridge)');
        ln.setAttribute('stroke-width', '0.5'); ln.setAttribute('opacity', '0.4');
        meshSvg.insertBefore(ln, meshSvg.firstChild);
      }
    }
  }

  gsap.from('#philNeutral span', {
    y: '100%', ease: 'none',
    scrollTrigger: { trigger: '#philosophy', start: 'top 60%', end: 'center center', scrub: 1 }
  });

  gsap.from('#philPower', {
    scale: 0.94, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '#philosophy', start: 'top 50%', end: 'center 40%', scrub: 1 }
  });

  gsap.to('#flowWord', {
    scale: 1.04, duration: 2.2, repeat: -1, yoyo: true, ease: 'flt',
    scrollTrigger: { trigger: '#philosophy', start: 'top bottom', toggleActions: 'play pause resume pause' }
  });

  /* ══════════════════════════════════════════
     11. MANIFESTO — Pinned word scrub
     Page stops. Words light up one by one.
     ══════════════════════════════════════════ */

  const mWords = gsap.utils.toArray('.m-word');
  if (mWords.length) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '#manifesto',
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
      }
    }).to(mWords, { opacity: 1, stagger: 0.15, ease: 'none' });
  }

  /* ══════════════════════════════════════════
     12. PROCESS — Pinned stacking + per-element reveals
     ══════════════════════════════════════════ */

  const panels = document.querySelectorAll('.process-panel');

  panels.forEach((panel, i) => {
    if (i < panels.length - 1) {
      ScrollTrigger.create({
        trigger: panel, start: 'top top', pin: true, pinSpacing: false,
        endTrigger: panels[i + 1], end: 'top top',
      });
      gsap.to(panel, {
        scale: 0.88, opacity: 0.3, filter: 'blur(8px)', ease: 'none',
        scrollTrigger: {
          trigger: panels[i + 1], start: 'top bottom', end: 'top top', scrub: true,
        }
      });
    }

    // Per-panel element reveals
    const label  = panel.querySelector('.process-panel__label');
    const title  = panel.querySelector('.process-panel__title');
    const desc   = panel.querySelector('.process-panel__desc');
    const visual = panel.querySelector('.process-panel__visual');

    if (label)  gsap.from(label,  { x: -40, opacity: 0, duration: 0.7, ease: 'sig', scrollTrigger: { trigger: panel, start: 'top 65%' } });
    if (title)  gsap.from(title,  { y: 50, opacity: 0, scale: 0.96, duration: 0.9, ease: 'sig', scrollTrigger: { trigger: panel, start: 'top 65%' } });
    if (desc)   gsap.from(desc,   { y: 30, opacity: 0, duration: 0.8, delay: 0.15, ease: 'smo', scrollTrigger: { trigger: panel, start: 'top 65%' } });
    if (visual) gsap.from(visual, { x: 60, opacity: 0, scale: 0.92, duration: 1, delay: 0.1, ease: 'sig', scrollTrigger: { trigger: panel, start: 'top 65%' } });
  });

  // Background numbers parallax
  document.querySelectorAll('.process-panel__bg-number').forEach(num => {
    gsap.to(num, {
      y: -80, ease: 'none',
      scrollTrigger: {
        trigger: num.closest('.process-panel'),
        start: 'top bottom', end: 'bottom top', scrub: true,
      }
    });
  });

  // Architect SVG line draw
  const archLines = document.querySelectorAll('.arch-line');
  archLines.forEach(line => {
    const len = line.getTotalLength ? line.getTotalLength() : 100;
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
  });
  ScrollTrigger.create({
    trigger: '#processPanel2', start: 'top 65%',
    onEnter: () => {
      archLines.forEach((line, i) => {
        gsap.to(line, { strokeDashoffset: 0, duration: 0.9, delay: i * 0.25, ease: 'sig' });
      });
    },
    once: true,
  });

  // Terminal lines
  const termLines = document.querySelectorAll('.terminal-line');
  ScrollTrigger.create({
    trigger: '#processPanel3', start: 'top 65%',
    onEnter: () => {
      termLines.forEach((line, i) => {
        gsap.set(line, { y: 8 });
        gsap.to(line, { opacity: 1, y: 0, duration: 0.35, delay: i * 0.45, ease: 'sig' });
      });
    },
    once: true,
  });

  // Growth path draw
  const growthPath = document.getElementById('growthPath');
  if (growthPath) {
    const pLen = growthPath.getTotalLength();
    gsap.set(growthPath, { strokeDasharray: pLen, strokeDashoffset: pLen });
    gsap.set('#growthDot', { opacity: 0 });
    ScrollTrigger.create({
      trigger: '#processPanel4', start: 'top 65%',
      onEnter: () => {
        gsap.to(growthPath, { strokeDashoffset: 0, duration: 2.2, ease: 'sig' });
        gsap.to('#growthDot', { opacity: 0.8, duration: 0.5, delay: 2, ease: 'sig' });
      },
      once: true,
    });
  }

  /* ══════════════════════════════════════════
     13. HORIZONTAL SCROLL CATALOG
     ══════════════════════════════════════════ */

  const catalogTrack  = document.getElementById('catalogTrack');
  const catalogPanels = document.querySelectorAll('.catalog__panel');

  if (catalogTrack && catalogPanels.length) {
    const scrollW = () => catalogTrack.scrollWidth - window.innerWidth;

    gsap.to(catalogTrack, {
      x: () => -scrollW(),
      ease: 'none',
      scrollTrigger: {
        id: 'catalogST',
        trigger: '#catalog', start: 'top top',
        end: () => `+=${scrollW()}`,
        pin: true, scrub: 1, invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = document.getElementById('catalogProgress');
          if (p) { p.style.width = (self.progress * 100) + '%'; p.setAttribute('aria-valuenow', Math.round(self.progress * 100)); }
        }
      }
    });
  }

  /* ══════════════════════════════════════════
     14. GALLERY — Entrance + per-image parallax
     Each image has a slightly different speed —
     this is what creates genuine depth layering.
     ══════════════════════════════════════════ */

  gsap.to('#gallery .reveal-label', {
    opacity: 1, y: 0, duration: 0.7, ease: 'sig',
    scrollTrigger: { trigger: '#gallery .gallery-section__header', start: 'top 85%' }
  });

  gsap.to('.gallery-section__title .clip-reveal span', {
    y: 0, duration: 0.85, stagger: 0.07, ease: 'sig',
    scrollTrigger: { trigger: '.gallery-section__title', start: 'top 82%' }
  });

  document.querySelectorAll('.gallery-cell').forEach((cell, i) => {
    gsap.to(cell, {
      opacity: 1, scale: 1, duration: 0.9, delay: i * 0.08, ease: 'sig',
      scrollTrigger: { trigger: cell, start: 'top 88%' }
    });
  });

  // Per-image parallax at varying rates — the depth layering effect
  document.querySelectorAll('.gallery-cell__img-wrap').forEach((wrap, i) => {
    const img = wrap.querySelector('img');
    if (!img) return;
    const yFrom = -(45 + i * 10);
    const yTo   =  (45 + i * 10);
    gsap.fromTo(img,
      { y: yFrom },
      {
        y: yTo, ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom', end: 'bottom top',
          scrub: 1 + i * 0.08,
        }
      }
    );
  });

  // Labels hint visible on enter
  document.querySelectorAll('.gallery-cell').forEach(cell => {
    const label = cell.querySelector('.gallery-cell__label');
    if (!label) return;
    ScrollTrigger.create({
      trigger: cell, start: 'top 80%',
      onEnter: () => gsap.to(label, { opacity: 0.6, y: 0, duration: 0.6, ease: 'sig' })
    });
  });

  /* ══════════════════════════════════════════
     15. CTA SECTION
     ══════════════════════════════════════════ */

  gsap.set('#ctaLine1', { y: '120%' });
  gsap.set('#ctaLine2', { y: '120%', scale: 0.9 });

  const ctaTl = gsap.timeline({
    scrollTrigger: { trigger: '#contact', start: 'top 72%' }
  });
  ctaTl
    .to('#ctaLine1', { y: 0, duration: 1, ease: 'sig' })
    .to('#ctaLine2', { y: 0, scale: 1, duration: 1.1, ease: 'sig' }, '-=0.65')
    .to('#ctaSub',   { opacity: 1, y: 0, duration: 0.8, ease: 'smo' }, '-=0.5')
    .to('#ctaButtons', { opacity: 1, y: 0, duration: 0.8, ease: 'sig' }, '-=0.55');

  // Glow breathes
  gsap.to('.cta-section__glow', {
    scale: 1.25, duration: 4, repeat: -1, yoyo: true, ease: 'flt',
    scrollTrigger: { trigger: '#contact', start: 'top bottom', toggleActions: 'play pause resume pause' }
  });

  /* ══════════════════════════════════════════
     16. FOOTER
     ══════════════════════════════════════════ */

  gsap.to('#footer', {
    y: 0, opacity: 1, duration: 1, ease: 'sig',
    scrollTrigger: { trigger: '#footer', start: 'top 92%' }
  });

  gsap.fromTo('.footer__grid > *',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'sig',
      scrollTrigger: { trigger: '.footer__grid', start: 'top 88%' } }
  );

  /* ══════════════════════════════════════════
     17. ANCHOR SCROLL
     ══════════════════════════════════════════ */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    });
  });

  /* ══════════════════════════════════════════
     18. REDUCED MOTION RESPECT
     ══════════════════════════════════════════ */

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.globalTimeline.pause();
    gsap.set([
      heroLine1, heroLine2, heroSubhead, heroCta, heroEyebrow,
      navbar, bgRipple, '.hero__bg-img', '.hero__chips',
      '.service-card', statsBar, '.gallery-cell',
      '#footer', '#ctaButtons', '#ctaSub',
    ], { opacity: 1, y: 0, x: 0, scale: 1, filter: 'none', marginTop: 0 });
  }

});