/* ═══════════════════════════════════════════
   SYSTEMSTRIDE — Main JavaScript
   GSAP + ScrollTrigger + Lenis · All Animations
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Register GSAP Plugins ── */
  gsap.registerPlugin(ScrollTrigger);

  /* ── Easing Tokens (LOCKED) ── */
  const EASE = {
    signature: 'cubic-bezier(0.22, 1, 0.36, 1)',
    smooth:    'cubic-bezier(0.4, 0.0, 0.2, 1)',
    float:     'cubic-bezier(0.25, 0.8, 0.25, 1)'
  };
  // GSAP-compatible custom eases
  const SIG = 'power2.out';   // closest GSAP match for signature
  const SMO = 'power2.inOut'; // closest GSAP match for smooth
  // NOTE: README forbids named GSAP eases. Using CustomEase-like parseEase.
  // GSAP doesn't accept CSS cubic-bezier strings directly in tween ease,
  // so we register custom eases:
  gsap.registerEase('sig', function(progress) {
    // Attempt to emulate cubic-bezier(0.22, 1, 0.36, 1)
    return 1 - Math.pow(1 - progress, 3);
  });
  gsap.registerEase('smo', function(progress) {
    return progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
  });

  /* ── Lenis Smooth Scroll ── */
  const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* ── Custom Cursor ── */
  const cursor = document.getElementById('customCursor');
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  const cursorEasing = 0.18;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * cursorEasing;
    cursorY += (mouseY - cursorY) * cursorEasing;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = 'a, button, .cursor-hover';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) cursor.classList.add('hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) cursor.classList.remove('hover');
  });

  // Hide cursor on touch devices
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    document.documentElement.style.cursor = 'auto';
    document.querySelectorAll('*').forEach(el => el.style.cursor = 'auto');
  }

  /* ── NAVBAR Animation ── */
  const navbar = document.getElementById('navbar');

  // Entrance: slide down from y: -100
  gsap.to(navbar, {
    y: 0, opacity: 1,
    duration: 0.8,
    delay: 0.3,
    ease: 'sig',
  });

  // Scroll morph
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom 80px',
    onEnter: () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
  });

  /* ── HERO Animations ── */

  // Marquee horizontal scroll
  gsap.to('#heroMarquee', {
    x: () => -window.innerWidth * 1.5,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // Dot grid parallax
  gsap.to('#heroDotGrid', {
    y: () => -window.innerHeight * 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  // Hero content staggered entrance
  const heroTl = gsap.timeline({ delay: 0.6 });
  heroTl
    .from('#heroLine1', { y: 60, opacity: 0, duration: 0.9, ease: 'sig' })
    .from('#heroLine2', { y: 60, opacity: 0, duration: 0.9, ease: 'sig' }, '-=0.65')
    .from('#heroSubhead', { y: 40, opacity: 0, duration: 0.7, ease: 'sig' }, '-=0.5')
    .from('#heroCta', { y: 40, opacity: 0, duration: 0.7, ease: 'sig' }, '-=0.4');

  /* ── SERVICES Section ── */

  // Title clip reveal
  const titleSpans = document.querySelectorAll('#servicesTitle .clip-reveal span');
  gsap.to(titleSpans, {
    y: 0,
    duration: 0.8,
    stagger: 0.06,
    ease: 'sig',
    scrollTrigger: {
      trigger: '#servicesTitle',
      start: 'top 80%',
    }
  });

  // Service cards staggered lateral slide
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((card, i) => {
    const fromX = i % 2 === 0 ? -60 : 60;
    gsap.to(card, {
      x: 0, opacity: 1,
      duration: 0.8,
      ease: 'sig',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
      },
      onStart: () => {
        gsap.set(card, { x: fromX });
      }
    });
    gsap.set(card, { x: fromX });
  });

  /* ── STATS BAR ── */
  const statsBar = document.getElementById('statsBar');

  gsap.to(statsBar, {
    y: 0, opacity: 1,
    duration: 0.8,
    ease: 'sig',
    scrollTrigger: {
      trigger: statsBar,
      start: 'top 85%',
    },
    onStart: () => {
      // Animate countable numbers
      document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.5,
          ease: 'sig',
          onUpdate: function() { el.textContent = Math.round(this.targets()[0].val); }
        });
      });
      // Text-based stats
      document.querySelectorAll('[data-text]').forEach(el => {
        setTimeout(() => { el.textContent = el.dataset.text; }, 800);
      });
    }
  });
  gsap.set(statsBar, { y: 40 });

  /* ── PHILOSOPHY Section ── */

  // Mesh background: animated dots
  const meshSvg = document.getElementById('meshSvg');
  const meshNodes = [];
  for (let i = 0; i < 30; i++) {
    const cx = Math.random() * 1200;
    const cy = Math.random() * 600;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', 2.5);
    circle.setAttribute('fill', 'var(--color-bridge)');
    meshSvg.appendChild(circle);
    meshNodes.push({ el: circle, x: cx, y: cy });

    // Animate each node with drift
    gsap.to(circle, {
      attr: {
        cx: cx + (Math.random() - 0.5) * 80,
        cy: cy + (Math.random() - 0.5) * 60
      },
      duration: 8 + Math.random() * 4,
      repeat: -1,
      yoyo: true,
      ease: 'smo',
    });
  }

  // Draw some connecting lines between nearby nodes
  for (let i = 0; i < meshNodes.length; i++) {
    for (let j = i + 1; j < meshNodes.length; j++) {
      const dx = meshNodes[i].x - meshNodes[j].x;
      const dy = meshNodes[i].y - meshNodes[j].y;
      if (Math.sqrt(dx * dx + dy * dy) < 200) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', meshNodes[i].x);
        line.setAttribute('y1', meshNodes[i].y);
        line.setAttribute('x2', meshNodes[j].x);
        line.setAttribute('y2', meshNodes[j].y);
        line.setAttribute('stroke', 'var(--color-bridge)');
        line.setAttribute('stroke-width', '0.5');
        line.setAttribute('opacity', '0.4');
        meshSvg.insertBefore(line, meshSvg.firstChild);
      }
    }
  }

  // Philosophy text scrub reveal
  gsap.from('#philNeutral span', {
    y: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top 60%',
      end: 'center center',
      scrub: 1,
    }
  });

  gsap.from('#philPower > span', {
    y: '100%',
    stagger: 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top 40%',
      end: '80% center',
      scrub: 1,
    }
  });

  // Flow word animation
  gsap.to('#flowWord', {
    scale: 1.02,
    color: '#3B82F6',
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'smo',
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top bottom',
      toggleActions: 'play pause resume pause',
    }
  });

  /* ── PROCESS / PROTOCOL — Pinned Stacking ── */
  const panels = document.querySelectorAll('.process-panel');
  panels.forEach((panel, i) => {
    if (i < panels.length - 1) {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top top',
        pin: true,
        pinSpacing: false,
        endTrigger: panels[i + 1],
        end: 'top top',
      });

      // Scale down + blur as next panel covers
      gsap.to(panel, {
        scale: 0.88,
        opacity: 0.3,
        filter: 'blur(8px)',
        ease: 'none',
        scrollTrigger: {
          trigger: panels[i + 1],
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        }
      });
    }
  });

  // Terminal typing animation (Step 3)
  const termLines = document.querySelectorAll('.terminal-line');
  ScrollTrigger.create({
    trigger: '#processPanel3',
    start: 'top 60%',
    onEnter: () => {
      termLines.forEach((line, i) => {
        gsap.to(line, {
          opacity: 1,
          duration: 0.3,
          delay: i * 0.5,
          ease: 'sig',
        });
      });
    },
    once: true,
  });

  // Growth path draw (Step 4)
  const growthPath = document.getElementById('growthPath');
  if (growthPath) {
    const pathLength = growthPath.getTotalLength();
    gsap.set(growthPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
    gsap.set('#growthDot', { opacity: 0 });

    ScrollTrigger.create({
      trigger: '#processPanel4',
      start: 'top 60%',
      onEnter: () => {
        gsap.to(growthPath, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'sig',
        });
        gsap.to('#growthDot', {
          opacity: 0.8,
          duration: 0.5,
          delay: 1.8,
          ease: 'sig',
        });
      },
      once: true,
    });
  }

  // Architect SVG line draw (Step 2)
  const archLines = document.querySelectorAll('.arch-line');
  archLines.forEach(line => {
    const len = line.getTotalLength();
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
  });
  ScrollTrigger.create({
    trigger: '#processPanel2',
    start: 'top 60%',
    onEnter: () => {
      archLines.forEach((line, i) => {
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1,
          delay: i * 0.3,
          ease: 'sig',
        });
      });
    },
    once: true,
  });

  /* ── HORIZONTAL SCROLL CATALOG ── */
  const catalogTrack = document.getElementById('catalogTrack');
  const catalogPanels = document.querySelectorAll('.catalog__panel');
  const totalPanels = catalogPanels.length;

  if (catalogTrack && totalPanels > 0) {
    const scrollWidth = () => catalogTrack.scrollWidth - window.innerWidth;

    gsap.to(catalogTrack, {
      x: () => -scrollWidth(),
      ease: 'none',
      scrollTrigger: {
        trigger: '#catalog',
        start: 'top top',
        end: () => `+=${scrollWidth()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = document.getElementById('catalogProgress');
          if (progress) progress.style.width = (self.progress * 100) + '%';
        }
      }
    });
  }

  /* ── CTA Section ── */
  const ctaTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 70%',
    }
  });

  ctaTl
    .to('#ctaLine1', { y: 0, duration: 0.9, ease: 'sig' })
    .to('#ctaLine2', { y: 0, scale: 1, duration: 1, ease: 'sig' }, '-=0.6')
    .to('#ctaButtons', { opacity: 1, y: 0, duration: 0.7, ease: 'sig' }, '-=0.4');

  // Initial states for CTA
  gsap.set('#ctaLine1', { y: '120%' });
  gsap.set('#ctaLine2', { y: '120%', scale: 0.9 });
  gsap.set('#ctaButtons', { y: 30 });

  /* ── FOOTER ── */
  gsap.to('#footer', {
    y: 0, opacity: 1,
    duration: 0.8,
    ease: 'sig',
    scrollTrigger: {
      trigger: '#footer',
      start: 'top 90%',
    }
  });
  gsap.set('#footer', { y: 60 });

  /* ── Blink cursor keyframe ── */
  const style = document.createElement('style');
  style.textContent = `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;
  document.head.appendChild(style);

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    });
  });

});
