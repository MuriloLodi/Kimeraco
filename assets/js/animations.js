/* ============================================================
   KIMERA CO. — ANIMATIONS
   GSAP + ScrollTrigger organized by section
   ============================================================ */
import { splitText, animateCounter, tiltEffect, magneticEffect } from './utils.js';

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ──────────────────────────────────────────────────────────────
   PRELOADER
────────────────────────────────────────────────────────────── */
export function initPreloader() {
  return new Promise(resolve => {
    if (prefersReduced) {
      document.getElementById('preloader').style.display = 'none';
      return resolve();
    }

    const bar = document.querySelector('.preloader-bar');
    const count = document.querySelector('.preloader-count');

    const tl = gsap.timeline({
      onComplete() {
        gsap.to('#preloader', {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete() {
            document.getElementById('preloader').style.display = 'none';
            resolve();
          }
        });
      }
    });

    tl.to(bar, {
      width: '100%',
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate() {
        const prog = Math.round(this.progress() * 100);
        if (count) count.textContent = prog + '%';
      }
    })
    .to('.preloader-logo', {
      y: -10,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.2');
  });
}

/* ──────────────────────────────────────────────────────────────
   HERO
────────────────────────────────────────────────────────────── */
export function initHeroAnim() {
  if (prefersReduced) {
    gsap.set(['.hero-tag', '.hero-sub', '.hero-actions', '.hero-scroll', '.hero-stat'], { opacity: 1 });
    gsap.set('.hero-title .line-inner', { y: 0 });
    return;
  }

  // Line reveal
  const lineInners = document.querySelectorAll('.hero-title .line-inner');

  const tl = gsap.timeline({ delay: 0.2 });

  tl.to('.hero-tag', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' })
    .to(lineInners, {
      y: 0,
      duration: 1,
      ease: 'expo.out',
      stagger: 0.1
    }, '-=0.3')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.5')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, '-=0.4')
    .to('.hero-scroll', { opacity: 1, duration: 0.5 }, '-=0.2');

  // Stats stagger
  gsap.from('.hero-stat', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.8,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.hero-stats',
      start: 'top 90%'
    }
  });

  // Subtle parallax on hero bg
  gsap.to('.hero-radial', {
    y: 80,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* ──────────────────────────────────────────────────────────────
   NAV (changes on scroll)
────────────────────────────────────────────────────────────── */
export function initNavScroll() {
  const nav = document.getElementById('nav');
  const links = document.querySelectorAll('.nav-link');

  // Scrolled state
  ScrollTrigger.create({
    start: 80,
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled')
  });

  // Active link by section
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => setActiveLink(sec.id),
      onEnterBack: () => setActiveLink(sec.id)
    });
  });

  function setActiveLink(id) {
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
    });
  }
}

/* ──────────────────────────────────────────────────────────────
   SECTION REVEALS (generic)
────────────────────────────────────────────────────────────── */
export function initRevealAnims() {
  if (prefersReduced) return;

  // Generic reveal-up elements
  gsap.utils.toArray('.reveal-up').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%'
      }
    });
  });

  // Section headers with label + title stagger
  document.querySelectorAll('.section-header').forEach(header => {
    const badge = header.querySelector('.label-badge');
    const title = header.querySelector('.t-h2, .t-h1, .t-h3');
    const sub = header.querySelector('.section-subtitle');
    const els = [badge, title, sub].filter(Boolean);

    gsap.from(els, {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 88%'
      }
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   VALUE CARDS
────────────────────────────────────────────────────────────── */
export function initValueAnim() {
  if (prefersReduced) return;

  gsap.from('.value-card', {
    opacity: 0,
    y: 50,
    scale: 0.97,
    stagger: { amount: 0.5 },
    duration: 0.9,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '#value .grid-3',
      start: 'top 85%'
    }
  });

  // Tilt on cards
  document.querySelectorAll('.value-card').forEach(c => tiltEffect(c, 5));
}

/* ──────────────────────────────────────────────────────────────
   MÉTODO KIMERA (pinned section with active steps)
────────────────────────────────────────────────────────────── */
export function initMetodoAnim() {
  if (prefersReduced) {
    document.querySelectorAll('.metodo-step')[0]?.classList.add('active');
    return;
  }

  const steps = document.querySelectorAll('.metodo-step');
  const visual = document.querySelector('.metodo-visual');

  // Animate from off-screen
  gsap.from('.metodo-steps', {
    opacity: 0,
    x: -40,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '#metodo',
      start: 'top 80%'
    }
  });

  if (visual) {
    gsap.from('.metodo-visual', {
      opacity: 0,
      x: 40,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: '#metodo',
        start: 'top 80%'
      }
    });
  }

  // Step activation via scroll
  const stepData = [
    { icon: '🔍', title: 'Diagnóstico', sub: 'Entendemos seu negócio, seu mercado e seus objetivos em profundidade.' },
    { icon: '✏️', title: 'Estratégia', sub: 'Definimos a melhor solução visual e digital para o seu perfil.' },
    { icon: '🎨', title: 'Design', sub: 'Criamos a identidade, o layout e todos os elementos visuais.' },
    { icon: '⚡', title: 'Desenvolvimento', sub: 'Construímos o site otimizado, rápido e pronto pra converter.' },
    { icon: '🚀', title: 'Entrega', sub: 'Publicamos, configuramos o e-mail e entregamos tudo no prazo.' },
  ];

  const iconEl = document.querySelector('.metodo-step-icon-lg');
  const titleEl = document.querySelector('.metodo-step-title-lg');
  const subEl = document.querySelector('.metodo-step-sub-lg');

  function activateStep(idx) {
    steps.forEach((s, i) => s.classList.toggle('active', i === idx));
    if (iconEl && stepData[idx]) {
      gsap.to([iconEl, titleEl, subEl], {
        opacity: 0, y: -10, duration: 0.2, ease: 'power2.in',
        onComplete() {
          iconEl.textContent = stepData[idx].icon;
          titleEl.textContent = stepData[idx].title;
          subEl.textContent = stepData[idx].sub;
          gsap.to([iconEl, titleEl, subEl], { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' });
        }
      });
    }
  }

  // Activate first step
  activateStep(0);

  // Click to activate
  steps.forEach((step, idx) => {
    step.addEventListener('click', () => activateStep(idx));
    step.addEventListener('mouseenter', () => activateStep(idx));
  });

  // ScrollTrigger-driven step activation
  if (!window.matchMedia('(pointer: coarse)').matches) return; // Desktop uses hover, mobile scroll
  steps.forEach((step, idx) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      onEnter: () => activateStep(idx),
      onEnterBack: () => activateStep(idx)
    });
  });
}

/* ──────────────────────────────────────────────────────────────
   PRICING CARDS
────────────────────────────────────────────────────────────── */
export function initPricingAnim() {
  if (prefersReduced) return;

  gsap.from('.pricing-card', {
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 0.9,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.pricing-grid',
      start: 'top 85%'
    }
  });
}

/* ──────────────────────────────────────────────────────────────
   PORTFOLIO GRID
────────────────────────────────────────────────────────────── */
export function initPortfolioAnim() {
  if (prefersReduced) return;

  gsap.from('.portfolio-card', {
    opacity: 0,
    y: 40,
    scale: 0.97,
    stagger: { amount: 0.5 },
    duration: 0.9,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.portfolio-grid',
      start: 'top 85%'
    }
  });

  // Tilt on portfolio cards
  document.querySelectorAll('.portfolio-card').forEach(c => tiltEffect(c, 6));
}

/* ──────────────────────────────────────────────────────────────
   DEPOIMENTOS / COUNTERS
────────────────────────────────────────────────────────────── */
export function initTestimonialsAnim() {
  if (prefersReduced) return;

  // Counters
  const counters = [
    { selector: '#counter-1', target: 150, suffix: '+' },
    { selector: '#counter-2', target: 98, suffix: '%' },
    { selector: '#counter-3', target: 5, suffix: 'x' },
    { selector: '#counter-4', target: 24, suffix: 'h' },
  ];

  counters.forEach(({ selector, target, suffix }) => {
    const el = document.querySelector(selector);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => animateCounter(el, target, 2, suffix)
    });
  });

  // Testimonial cards
  gsap.from('.testimonial-card', {
    opacity: 0,
    y: 40,
    stagger: 0.1,
    duration: 0.9,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 85%'
    }
  });

  // Social number cards
  gsap.from('.social-num-card', {
    opacity: 0,
    y: 30,
    stagger: 0.08,
    duration: 0.8,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.social-numbers',
      start: 'top 85%'
    }
  });
}

/* ──────────────────────────────────────────────────────────────
   FAQ
────────────────────────────────────────────────────────────── */
export function initFaqAnim() {
  if (prefersReduced) return;

  gsap.from('.faq-item', {
    opacity: 0,
    x: -20,
    stagger: 0.06,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.faq-list',
      start: 'top 88%'
    }
  });
}

/* ──────────────────────────────────────────────────────────────
   CTA FINAL
────────────────────────────────────────────────────────────── */
export function initCtaAnim() {
  if (prefersReduced) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#cta-final',
      start: 'top 75%'
    }
  });

  const words = splitText(document.querySelector('.cta-title'), 'words');

  tl.from(words, {
    y: 60,
    opacity: 0,
    stagger: 0.04,
    duration: 0.9,
    ease: 'expo.out'
  })
  .from('.cta-sub', { opacity: 0, y: 20, duration: 0.7, ease: 'expo.out' }, '-=0.4')
  .from('.cta-actions > *', { opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: 'expo.out' }, '-=0.3');

  // Magnetic CTAs
  document.querySelectorAll('.cta-actions .btn, .cta-actions .cta-wpp').forEach(btn => {
    magneticEffect(btn, 0.3);
  });
}

/* ──────────────────────────────────────────────────────────────
   MARQUEE (handled by CSS, but ensure reveal on scroll)
────────────────────────────────────────────────────────────── */
export function initMarqueeAnim() {
  if (prefersReduced) {
    const track = document.querySelector('.marquee-track');
    if (track) track.style.animationPlayState = 'paused';
  }
}

/* ──────────────────────────────────────────────────────────────
   THEME SCRUB (light → dark → red as page scrolls)
  (subtle: we fade in accent overlay in cta-final)
────────────────────────────────────────────────────────────── */
export function initThemeScrub() {
  if (prefersReduced) return;

  // Subtle red glow intensifies as you scroll to CTA
  gsap.to('.cta-bg', {
    opacity: 1.5,
    ease: 'none',
    scrollTrigger: {
      trigger: '#cta-final',
      start: 'top bottom',
      end: 'center center',
      scrub: true
    }
  });
}

/* ──────────────────────────────────────────────────────────────
   FOOTER REVEAL
────────────────────────────────────────────────────────────── */
export function initFooterAnim() {
  if (prefersReduced) return;

  gsap.from('.footer-grid > *', {
    opacity: 0,
    y: 30,
    stagger: 0.1,
    duration: 0.8,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: 'footer',
      start: 'top 90%'
    }
  });
}
