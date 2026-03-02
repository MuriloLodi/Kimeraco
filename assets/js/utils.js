/* ============================================================
   KIMERA CO. — UTILITIES
   ============================================================ */

/**
 * Split text into words wrapped in spans (no paid plugin)
 * @param {HTMLElement} el
 * @param {string} mode - 'words' | 'lines' | 'chars'
 */
export function splitText(el, mode = 'words') {
  const original = el.innerHTML;
  el.dataset.splitOriginal = original;

  if (mode === 'chars') {
    const chars = el.textContent.trim().split('');
    el.innerHTML = chars.map(c =>
      c === ' ' ? '<span class="split-space"> </span>' :
      `<span class="split-char" style="display:inline-block;">${c}</span>`
    ).join('');
    return el.querySelectorAll('.split-char');
  }

  if (mode === 'words') {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w =>
      `<span class="split-word" style="display:inline-block;overflow:hidden;"><span class="split-word-inner" style="display:inline-block;">${w}</span></span>`
    ).join(' ');
    return el.querySelectorAll('.split-word-inner');
  }

  if (mode === 'lines') {
    // Wrap each line div already in .line into a .line-inner
    const lines = el.querySelectorAll('.line');
    lines.forEach(line => {
      const inner = document.createElement('span');
      inner.className = 'line-inner';
      inner.style.display = 'block';
      inner.innerHTML = line.innerHTML;
      line.innerHTML = '';
      line.appendChild(inner);
    });
    return el.querySelectorAll('.line-inner');
  }

  return [];
}

/**
 * Magnetic effect on elements
 * @param {HTMLElement} el
 * @param {number} strength - 0-1
 */
export function magneticEffect(el, strength = 0.35) {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    gsap.to(el, { x: dx, y: dy, duration: 0.4, ease: 'power2.out' });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  });
}

/**
 * 3D tilt effect on a card
 * @param {HTMLElement} el
 * @param {number} intensity - degrees max
 */
export function tiltEffect(el, intensity = 8) {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  el.style.transformStyle = 'preserve-3d';
  el.style.willChange = 'transform';

  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = -y * intensity;
    const rotY = x * intensity;
    gsap.to(el, {
      rotationX: rotX,
      rotationY: rotY,
      transformPerspective: 800,
      duration: 0.4,
      ease: 'power2.out'
    });
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)'
    });
  });
}

/**
 * Animated counter
 * @param {HTMLElement} el
 * @param {number} target
 * @param {number} duration
 * @param {string} suffix
 */
export function animateCounter(el, target, duration = 2, suffix = '') {
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate() {
      el.textContent = Math.round(obj.val) + suffix;
    }
  });
}

/**
 * Custom cursor manager
 */
export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'none' });
  });

  // Ring follows with lag
  function animRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    gsap.set(ring, { x: ringX, y: ringY });
    requestAnimationFrame(animRing);
  }
  animRing();

  // Hover states
  const hoverEls = document.querySelectorAll('a, button, .portfolio-card, .pricing-card, .value-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hover');
      ring.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hover');
      ring.classList.remove('is-hover');
    });
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.classList.add('is-hidden');
    ring.classList.add('is-hidden');
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.remove('is-hidden');
    ring.classList.remove('is-hidden');
  });
}

/**
 * Ripple effect on buttons
 */
export function initRipples() {
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        width:4px; height:4px;
        left:${x}px; top:${y}px;
        transform:translate(-50%,-50%) scale(0);
        background:rgba(255,255,255,0.3);
        pointer-events:none;
      `;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      gsap.to(ripple, {
        scale: 60,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      });
    });
  });
}

/**
 * FAQ accordion
 */
export function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');

    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const ans = openItem.querySelector('.faq-answer');
        gsap.to(ans, { maxHeight: 0, duration: 0.4, ease: 'power2.inOut' });
      });

      // Open clicked if was closed
      if (!isOpen) {
        item.classList.add('open');
        const answerH = a.scrollHeight;
        gsap.to(a, { maxHeight: answerH + 40, duration: 0.5, ease: 'expo.out' });
      }
    });
  });
}
