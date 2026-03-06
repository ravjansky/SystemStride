/* ═══════════════════════════════════════════
   SYSTEMSTRIDE — Main JavaScript
   GSAP + CustomEase + ScrollTrigger + Lenis
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════
     0. PLUGIN REGISTRATION + EASING TOKENS
     ══════════════════════════════════════════ */

  gsap.registerPlugin(ScrollTrigger, CustomEase);

  // Faithful cubic-bezier representations of the three brand motion tokens
  CustomEase.create('sig', 'M0,0 C0.22,1 0.36,1 1,1');   // --ease-signature
  CustomEase.create('smo', 'M0,0 C0.4,0 0.2,1 1,1');     // --ease-smooth
  CustomEase.create('flt', 'M0,0 C0.25,0.8 0.25,1 1,1'); // --ease-float

  /* ══════════════════════════════════════════
     1. LENIS SMOOTH SCROLL
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
  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

  // Hide on touch devices
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    document.documentElement.style.cursor = 'auto';
  } else {
    const cursorLerp = 0.18;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * cursorLerp;
      cursorY += (mouseY - cursorY) * cursorLerp;
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
  }

  /* ══════════════════════════════════════════
     3. INTRO ANIMATION — Integrated page birth
     Sequence: scanline draw → "systems." lands → 
     "Business runs on" slides in → context reveals →
     navbar drops → background emerges
     ══════════════════════════════════════════ */

  const navbar    = document.getElementById('navbar');
  const introLine = document.getElementById('introLine');

  // Hero references
  const heroLine1   = document.getElementById('heroLine1');
  const heroLine2   = document.getElementById('heroLine2');
  const heroSubhead = document.getElementById('heroSubhead');
  const heroCta     = document.getElementById('heroCta');
  const heroScrollHint = document.getElementById('heroScrollHint');
  const heroDotGrid = document.getElementById('heroDotGrid');
  const heroMarquee = document.getElementById('heroMarquee');
  const bgRipple    = document.getElementById('bgRipple');

  // CSS already sets hero elements to opacity:0 / translated
  // GSAP will animate them TO their resting state

  const intro = gsap.timeline({ defaults: { ease: 'sig' } });

  intro
    // Scanline draws across center of screen
    .set(introLine, { opacity: 1, width: 0 })
    .to(introLine, {
      width: '100%',
      duration: 0.55,
      ease: 'smo',
    })
    // Line fades out
    .to(introLine, {
      opacity: 0,
      duration: 0.25,
      ease: 'smo',
    }, '-=0.05')

    // "systems." materializes — the hero enters first, with weight
    .to(heroLine2, {
      y: 0,
      opacity: 1,
      duration: 1.1,
    }, '-=0.1')

    // "Business runs on" — context follows
    .to(heroLine1, {
      y: 0,
      opacity: 1,
      duration: 0.85,
    }, '-=0.75')

    // Subhead rises
    .to(heroSubhead, {
      y: 0,
      opacity: 1,
      duration: 0.7,
    }, '-=0.55')

    // CTA button
    .to(heroCta, {
      y: 0,
      opacity: 1,
      duration: 0.7,
    }, '-=0.5')

    // Navbar drops last — frame around the content
    .to(navbar, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'flt',
    }, '-=0.45')

    // Atmosphere reveals — dot grid, marquee, ripple
    .to(heroDotGrid, {
      opacity: 0.12,
      duration: 1.2,
      ease: 'smo',
    }, '-=0.5')

    .to(heroMarquee, {
      opacity: 0.04,
      duration: 1.4,
      ease: 'smo',
    }, '-=1.1')

    .to(bgRipple, {
      opacity: 1,
      duration: 1.5,
      ease: 'smo',
    }, '-=1.2')

    // Scroll hint fades in after everything settles
    .to(heroScrollHint, {
      opacity: 0.6,
      duration: 0.8,
      ease: 'flt',
    }, '-=0.4');


  /* ══════════════════════════════════════════
     4. NAVBAR — Scroll morph + indicator hide
     ══════════════════════════════════════════ */

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom 80px',
    onEnter:     () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
  });

  // Hide scroll hint as soon as user scrolls any amount
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top+=80 top',
    onEnter:     () => gsap.to(heroScrollHint, { opacity: 0, duration: 0.4, ease: 'smo' }),
    onLeaveBack: () => gsap.to(heroScrollHint, { opacity: 0.6, duration: 0.4, ease: 'smo' }),
  });


  /* ══════════════════════════════════════════
     5. HERO — Scroll parallax effects
     ══════════════════════════════════════════ */

  // Marquee horizontal drift on scroll
  gsap.to(heroMarquee, {
    x: () => -window.innerWidth * 1.5,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // Dot grid parallax — drifts up as hero leaves
  gsap.to(heroDotGrid, {
    y: () => -window.innerHeight * 0.3,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  // Ripple circles drift upward on scroll — ScrollTrigger adds momentum to the idle animation
  gsap.to(bgRipple, {
    y: () => -window.innerHeight * 0.4,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // Hero content subtle upward parallax
  gsap.to('#hero .hero__content', {
    y: () => -window.innerHeight * 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });


  /* ══════════════════════════════════════════
     6. SERVICES SECTION
     ══════════════════════════════════════════ */

  // Section label reveal
  gsap.to('#services .reveal-label', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'sig',
    scrollTrigger: {
      trigger: '#services .reveal-label',
      start: 'top 88%',
    }
  });

  // Title words clip reveal
  const serviceTitleSpans = document.querySelectorAll('#servicesTitle .clip-reveal span');
  gsap.to(serviceTitleSpans, {
    y: 0,
    duration: 0.85,
    stagger: 0.07,
    ease: 'sig',
    scrollTrigger: {
      trigger: '#servicesTitle',
      start: 'top 82%',
    }
  });

  // Service cards — lateral stagger with alternating directions
  document.querySelectorAll('.service-card').forEach((card, i) => {
    const fromX = i % 2 === 0 ? -70 : 70;
    gsap.fromTo(card,
      { x: fromX, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'sig',
        scrollTrigger: {
          trigger: card,
          start: 'top 87%',
        }
      }
    );
  });


  /* ══════════════════════════════════════════
     7. STATS BAR — Entrance + counter animation
     ══════════════════════════════════════════ */

  const statsBar = document.getElementById('statsBar');

  gsap.to(statsBar, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'sig',
    scrollTrigger: {
      trigger: statsBar,
      start: 'top 88%',
      onEnter: () => {
        // Countable numbers
        document.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          gsap.fromTo({ val: 0 }, { val: target }, {
            val: target,
            duration: 1.8,
            ease: 'sig',
            onUpdate: function() {
              el.textContent = Math.round(this.targets()[0].val);
            }
          });
        });
        // Text stats — reveal with brief delay
        document.querySelectorAll('[data-text]').forEach((el, i) => {
          setTimeout(() => { el.textContent = el.dataset.text; }, 600 + i * 150);
        });
      }
    }
  });

  // Individual stat items stagger in
  gsap.fromTo('.stat-item', {
    y: 30,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: 'sig',
    scrollTrigger: {
      trigger: statsBar,
      start: 'top 88%',
    }
  });


  /* ══════════════════════════════════════════
     8. IMAGE BREAK — Full parallax reveal
     ══════════════════════════════════════════ */

  const breakImg = document.querySelector('.image-break__img');
  if (breakImg) {
    // Inner image moves at different rate than the container — agency parallax
    gsap.fromTo(breakImg,
      { y: '-60px', scale: 1.1 },
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
  }

  // Quote reveal from below on enter
  gsap.to('.image-break__quote', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'sig',
    scrollTrigger: {
      trigger: '.image-break__overlay',
      start: 'top 70%',
    }
  });


  /* ══════════════════════════════════════════
     9. PHILOSOPHY SECTION — Mesh + text reveals
     ══════════════════════════════════════════ */

  // Animated mesh background — organic node drift
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

    gsap.to(circle, {
      attr: {
        cx: cx + (Math.random() - 0.5) * 80,
        cy: cy + (Math.random() - 0.5) * 60,
      },
      duration: 8 + Math.random() * 4,
      repeat: -1,
      yoyo: true,
      ease: 'flt',
    });
  }

  // Connect nearby nodes with lines
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

  // Philosophy text — scrub reveal from below
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

  // Power text — scrub with scale breathing
  gsap.from('#philPower', {
    scale: 0.94,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top 50%',
      end: 'center 40%',
      scrub: 1,
    }
  });

  gsap.from('#philPower > .accent', {
    y: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top 40%',
      end: '80% center',
      scrub: 1,
    }
  });

  // "flow" word — subtle pulse loop while in view
  gsap.to('#flowWord', {
    scale: 1.04,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: 'flt',
    scrollTrigger: {
      trigger: '#philosophy',
      start: 'top bottom',
      toggleActions: 'play pause resume pause',
    }
  });


  /* ══════════════════════════════════════════
     10. MANIFESTO — Pinned word-by-word scrub reveal
     The page pauses. Words light up one by one.
     ══════════════════════════════════════════ */

  const manifestoWords = gsap.utils.toArray('.m-word');

  if (manifestoWords.length) {
    const manifestoTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#manifesto',
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
      }
    });

    manifestoTl.to(manifestoWords, {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      ease: 'none',
    });
  }


  /* ══════════════════════════════════════════
     11. PROCESS PANELS — Pinned stacking + enhanced reveals
     ══════════════════════════════════════════ */

  const processPanels = document.querySelectorAll('.process-panel');

  processPanels.forEach((panel, i) => {
    // Pin all but last, let them stack
    if (i < processPanels.length - 1) {
      ScrollTrigger.create({
        trigger: panel,
        start: 'top top',
        pin: true,
        pinSpacing: false,
        endTrigger: processPanels[i + 1],
        end: 'top top',
      });

      // Scale down + blur as next panel pushes it back
      gsap.to(panel, {
        scale: 0.88,
        opacity: 0.3,
        filter: 'blur(8px)',
        ease: 'none',
        scrollTrigger: {
          trigger: processPanels[i + 1],
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        }
      });
    }

    // Each panel's label slides in
    gsap.from(panel.querySelector('.process-panel__label'), {
      x: -40,
      opacity: 0,
      duration: 0.7,
      ease: 'sig',
      scrollTrigger: {
        trigger: panel,
        start: 'top 65%',
      }
    });

    // Each panel's title reveals with scale
    gsap.from(panel.querySelector('.process-panel__title'), {
      y: 50,
      opacity: 0,
      scale: 0.96,
      duration: 0.9,
      ease: 'sig',
      scrollTrigger: {
        trigger: panel,
        start: 'top 65%',
      }
    });

    // Desc fades in
    gsap.from(panel.querySelector('.process-panel__desc'), {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.15,
      ease: 'smo',
      scrollTrigger: {
        trigger: panel,
        start: 'top 65%',
      }
    });

    // Visual element pops in from right
    const visual = panel.querySelector('.process-panel__visual');
    if (visual) {
      gsap.from(visual, {
        x: 60,
        opacity: 0,
        scale: 0.92,
        duration: 1,
        delay: 0.1,
        ease: 'sig',
        scrollTrigger: {
          trigger: panel,
          start: 'top 65%',
        }
      });
    }
  });

  // Background numbers — subtle parallax on each panel
  document.querySelectorAll('.process-panel__bg-number').forEach(num => {
    gsap.to(num, {
      y: () => -80,
      ease: 'none',
      scrollTrigger: {
        trigger: num.closest('.process-panel'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    });
  });

  // Architect SVG line draw (Panel 2)
  const archLines = document.querySelectorAll('.arch-line');
  archLines.forEach(line => {
    const len = line.getTotalLength ? line.getTotalLength() : 100;
    gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
  });

  ScrollTrigger.create({
    trigger: '#processPanel2',
    start: 'top 65%',
    onEnter: () => {
      archLines.forEach((line, i) => {
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 0.9,
          delay: i * 0.25,
          ease: 'sig',
        });
      });
    },
    once: true,
  });

  // Terminal typing animation (Panel 3)
  const termLines = document.querySelectorAll('.terminal-line');
  ScrollTrigger.create({
    trigger: '#processPanel3',
    start: 'top 65%',
    onEnter: () => {
      termLines.forEach((line, i) => {
        gsap.to(line, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          delay: i * 0.45,
          ease: 'sig',
        });
        gsap.set(line, { y: 8 });
      });
    },
    once: true,
  });

  // Growth path draw (Panel 4)
  const growthPath = document.getElementById('growthPath');
  if (growthPath) {
    const pathLength = growthPath.getTotalLength();
    gsap.set(growthPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
    gsap.set('#growthDot', { opacity: 0 });

    ScrollTrigger.create({
      trigger: '#processPanel4',
      start: 'top 65%',
      onEnter: () => {
        gsap.to(growthPath, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: 'sig',
        });
        gsap.to('#growthDot', {
          opacity: 0.8,
          scale: 1,
          duration: 0.5,
          delay: 2,
          ease: 'sig',
        });
      },
      once: true,
    });
  }


  /* ══════════════════════════════════════════
     12. HORIZONTAL SCROLL CATALOG
     ══════════════════════════════════════════ */

  const catalogTrack = document.getElementById('catalogTrack');
  const catalogPanels = document.querySelectorAll('.catalog__panel');
  const totalCatalogPanels = catalogPanels.length;

  if (catalogTrack && totalCatalogPanels > 0) {
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
          if (progress) {
            progress.style.width = (self.progress * 100) + '%';
            progress.setAttribute('aria-valuenow', Math.round(self.progress * 100));
          }
        }
      }
    });

    // Each panel's inner content reveals as it comes into view
    catalogPanels.forEach(panel => {
      const inner = panel.querySelector('.catalog__panel-inner');
      if (!inner) return;
      gsap.fromTo(inner,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'sig',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: ScrollTrigger.getById('catalog') || null,
            start: 'left 70%',
            once: true,
          }
        }
      );
    });
  }


  /* ══════════════════════════════════════════
     13. GALLERY — Entrance + image parallax
     Five images. Each with its own depth.
     ══════════════════════════════════════════ */

  // Gallery header elements
  gsap.to('#gallery .reveal-label', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'sig',
    scrollTrigger: {
      trigger: '#gallery .gallery-section__header',
      start: 'top 85%',
    }
  });

  const galleryTitleSpans = document.querySelectorAll('.gallery-section__title .clip-reveal span');
  gsap.to(galleryTitleSpans, {
    y: 0,
    duration: 0.85,
    stagger: 0.07,
    ease: 'sig',
    scrollTrigger: {
      trigger: '.gallery-section__title',
      start: 'top 82%',
    }
  });

  // Cell entrance — staggered scale + fade
  const galleryCells = document.querySelectorAll('.gallery-cell');
  galleryCells.forEach((cell, i) => {
    gsap.to(cell, {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      delay: i * 0.08,
      ease: 'sig',
      scrollTrigger: {
        trigger: cell,
        start: 'top 88%',
      }
    });
  });

  // Agency-style inner image parallax — each image moves at a different rate
  // This creates the depth / layers effect
  document.querySelectorAll('.gallery-cell__img-wrap').forEach((wrap, i) => {
    const img = wrap.querySelector('img');
    if (!img) return;

    // Alternating parallax speeds for visual variety
    const speed = 0.6 + (i % 3) * 0.15;
    const yFrom = -50 * speed;
    const yTo   =  50 * speed;

    gsap.fromTo(img,
      { y: yFrom },
      {
        y: yTo,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1 + i * 0.1, // slightly different scrub per image
        }
      }
    );
  });

  // Cell labels appear on hover — handled via CSS
  // But also fade them in slightly when cell enters viewport as a hint
  galleryCells.forEach(cell => {
    const label = cell.querySelector('.gallery-cell__label');
    if (!label) return;
    ScrollTrigger.create({
      trigger: cell,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(label, {
          opacity: 0.6,
          y: 0,
          duration: 0.6,
          ease: 'sig',
        });
      }
    });
  });


  /* ══════════════════════════════════════════
     14. CTA SECTION — Cinematic reveal
     ══════════════════════════════════════════ */

  // Set initial states
  gsap.set('#ctaLine1', { y: '120%' });
  gsap.set('#ctaLine2', { y: '120%', scale: 0.9 });

  const ctaTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 72%',
    }
  });

  ctaTl
    .to('#ctaLine1', {
      y: 0,
      duration: 1,
      ease: 'sig',
    })
    .to('#ctaLine2', {
      y: 0,
      scale: 1,
      duration: 1.1,
      ease: 'sig',
    }, '-=0.65')
    .to('#ctaSub', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'smo',
    }, '-=0.5')
    .to('#ctaButtons', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'sig',
    }, '-=0.55');

  // CTA glow breathes in on section enter
  gsap.to('.cta-section__glow', {
    scale: 1.2,
    duration: 4,
    repeat: -1,
    yoyo: true,
    ease: 'flt',
    scrollTrigger: {
      trigger: '#contact',
      start: 'top bottom',
      toggleActions: 'play pause resume pause',
    }
  });


  /* ══════════════════════════════════════════
     15. FOOTER — Staggered grid reveal
     ══════════════════════════════════════════ */

  gsap.to('#footer', {
    y: 0,
    opacity: 1,
    duration: 1,
    ease: 'sig',
    scrollTrigger: {
      trigger: '#footer',
      start: 'top 92%',
    }
  });

  // Grid columns stagger in
  gsap.fromTo('.footer__grid > *', {
    y: 40,
    opacity: 0,
  }, {
    y: 0,
    opacity: 1,
    duration: 0.7,
    stagger: 0.1,
    ease: 'sig',
    scrollTrigger: {
      trigger: '.footer__grid',
      start: 'top 88%',
    }
  });


  /* ══════════════════════════════════════════
     16. GLOBAL REVEAL — Any missed section labels
     ══════════════════════════════════════════ */

  gsap.utils.toArray('.reveal-label').forEach(el => {
    // Only animate ones not already targeted above
    if (!el.closest('#services') && !el.closest('#gallery')) {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'sig',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
        }
      });
    }
  });


  /* ══════════════════════════════════════════
     17. SMOOTH SCROLL — Anchor navigation
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
     18. PERFORMANCE — Reduced motion respect
     ══════════════════════════════════════════ */

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    // Kill all scroll-based animations, keep page functional
    ScrollTrigger.getAll().forEach(st => st.kill());
    gsap.globalTimeline.pause();

    // Immediately reveal everything that was hidden
    gsap.set([
      heroLine1, heroLine2, heroSubhead, heroCta,
      navbar, heroDotGrid, bgRipple,
      '.service-card', '.stats-bar', '.gallery-cell',
      '.footer', '.cta-section__buttons', '#ctaSub'
    ], { opacity: 1, y: 0, x: 0, scale: 1, filter: 'none' });

    gsap.set([heroMarquee], { opacity: 0.04 });
  }

});