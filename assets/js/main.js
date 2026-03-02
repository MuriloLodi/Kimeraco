/* ============================================================
   KIMERA CO. — MAIN ENTRY POINT
   ============================================================ */
import {
  initPreloader,
  initHeroAnim,
  initNavScroll,
  initRevealAnims,
  initValueAnim,
  initMetodoAnim,
  initPricingAnim,
  initPortfolioAnim,
  initTestimonialsAnim,
  initFaqAnim,
  initCtaAnim,
  initMarqueeAnim,
  initThemeScrub,
  initFooterAnim
} from './animations.js';

import { initCursor, initRipples, initFAQ } from '../../utils.js';

/* ── Register GSAP plugins ────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── Lenis smooth scroll ──────────────────────────────────── */
function initLenis() {
  const lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true,
    syncTouch: false
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/* ── Mobile nav ───────────────────────────────────────────── */
function initMobileNav() {
  const burger = document.querySelector('.nav-burger');
  const drawer = document.querySelector('.nav-drawer');
  if (!burger || !drawer) return;

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    drawer.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      drawer.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !drawer.contains(e.target)) {
      burger.classList.remove('open');
      drawer.classList.remove('open');
    }
  });
}

/* ── INIT ─────────────────────────────────────────────────── */
async function init() {
  // Wait for preloader
  await initPreloader();

  // Init Lenis
  const lenis = initLenis();

  // UI
  initCursor();
  initRipples();
  initMobileNav();
  initFAQ();

  // Animations
  initNavScroll();
  initHeroAnim();
  initRevealAnims();
  initValueAnim();
  initMetodoAnim();
  initPricingAnim();
  initPortfolioAnim();
  initTestimonialsAnim();
  initFaqAnim();
  initCtaAnim();
  initMarqueeAnim();
  initThemeScrub();
  initFooterAnim();

  // Refresh ScrollTrigger after everything is set
  ScrollTrigger.refresh();
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
