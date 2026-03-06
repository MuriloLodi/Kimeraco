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

// assets/js/planos.js — interactions (preloader, nav, drawer, faq, compare, wpp-pop)
(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];

  // ─────────────────────────────────────────────
  // PRELOADER (leve + sem depender de GSAP)
  // ─────────────────────────────────────────────
  const preloader = $('#preloader');
  if (preloader) {
    const KEY = 'kimera_preloader_seen';
    const navType = performance.getEntriesByType?.('navigation')?.[0]?.type;
    const alreadySeen = sessionStorage.getItem(KEY) === '1';

    const finish = () => {
      preloader.classList.add('done');
      setTimeout(() => preloader.remove(), 520);
    };

    if (alreadySeen || navType === 'back_forward') {
      preloader.style.display = 'none';
    } else {
      const bar = $('.preloader-bar', preloader);
      const count = $('.preloader-count', preloader);

      let p = 0;
      const start = performance.now();
      const duration = 900;

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        // curva suavinha
        const eased = 1 - Math.pow(1 - t, 3);
        p = Math.round(eased * 100);

        if (bar) bar.style.width = `${p}%`;
        if (count) count.textContent = `${p}%`;

        if (t < 1) requestAnimationFrame(tick);
        else {
          sessionStorage.setItem(KEY, '1');
          finish();
        }
      };

      requestAnimationFrame(tick);
    }
  }

  // ─────────────────────────────────────────────
  // NAV SCROLL + BURGER
  // ─────────────────────────────────────────────
  const nav = $('#nav');
  const burger = $('.nav-burger');
  const drawer = $('#nav-drawer');

  const setScrolled = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 8);
  };
  setScrolled();
  window.addEventListener('scroll', setScrolled, { passive: true });

  const setDrawer = (open) => {
    if (!burger || !drawer) return;
    burger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.documentElement.style.overflow = open ? 'hidden' : '';
  };

  if (burger && drawer) {
    burger.addEventListener('click', () => setDrawer(!drawer.classList.contains('open')));
    $$('.nav-link', drawer).forEach(a => a.addEventListener('click', () => setDrawer(false)));
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setDrawer(false);
    });
  }

  // Smooth scroll nos anchors internos
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = document.getElementById(id.slice(1));
      if (!target) return;

      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ─────────────────────────────────────────────
  // FAQ accordion (sem GSAP)
  // ─────────────────────────────────────────────
  $$('.faq-item').forEach(item => {
    const btn = $('.faq-question', item);
    const ans = $('.faq-answer', item);
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // fecha outros
      $$('.faq-item.open').forEach(o => {
        if (o === item) return;
        o.classList.remove('open');
        const b = $('.faq-question', o);
        const a = $('.faq-answer', o);
        if (b) b.setAttribute('aria-expanded', 'false');
        if (a) { a.style.maxHeight = '0px'; a.setAttribute('aria-hidden', 'true'); }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', (!isOpen).toString());
      ans.setAttribute('aria-hidden', isOpen ? 'true' : 'false');

      if (!isOpen) {
        ans.style.maxHeight = ans.scrollHeight + 'px';
        // recalcula caso fontes carreguem depois
        setTimeout(() => { if (item.classList.contains('open')) ans.style.maxHeight = ans.scrollHeight + 'px'; }, 120);
      } else {
        ans.style.maxHeight = '0px';
      }
    });
  });

  // ─────────────────────────────────────────────
  // COMPARE: filtros + destaque popular
  // ─────────────────────────────────────────────
  const compareWrap = $('.compare-wrap');
  const compareBtns = $$('[data-compare]');
  const popularBtn = $('#btnHighlightPopular');
  const table = $('.compare-table');

  const applyFilter = (key) => {
    if (!table) return;
    const rows = $$('tbody tr', table);
    rows.forEach(r => {
      const group = r.getAttribute('data-group') || '';
      // sempre mostra delivery/support/hosting por serem decisivos
      const always = ['delivery', 'support', 'hosting'].includes(group);
      const show = key === 'all' || always || group === key;
      r.style.display = show ? '' : 'none';
    });

    // estado ativo nos botões
    compareBtns.forEach(b => {
      b.classList.toggle('btn-primary', b.getAttribute('data-compare') === key);
      b.classList.toggle('btn-secondary', b.getAttribute('data-compare') !== key);
    });

    // volta topo da tabela
    if (compareWrap) compareWrap.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
  };

  if (compareBtns.length) {
    compareBtns.forEach(b => b.addEventListener('click', () => applyFilter(b.getAttribute('data-compare') || 'all')));
    applyFilter('all');
  }

  if (popularBtn && table) {
    let on = false;
    popularBtn.addEventListener('click', () => {
      on = !on;
      const col = $$('[data-col="conversao"]', table);
      // aplica highlight na coluna inteira (thead + body)
      const ths = $$('thead th', table);
      const idx = ths.findIndex(th => th.getAttribute('data-col') === 'conversao');
      if (idx === -1) return;

      $$('tr', table).forEach(tr => {
        const cells = $$('th, td', tr);
        if (cells[idx]) cells[idx].classList.toggle('col-highlight', on);
      });

      popularBtn.classList.toggle('btn-primary', on);
      popularBtn.classList.toggle('btn-ghost', !on);
      popularBtn.textContent = on ? 'Recomendado destacado ✓' : 'Destacar recomendado';
    });
  }

  // ─────────────────────────────────────────────
  // WPP pop
  // ─────────────────────────────────────────────
  const pop = $('#wpp-pop');
  if (pop) {
    const close = $('.wpp-pop-close', pop);
    const show = () => { pop.classList.add('show'); pop.setAttribute('aria-hidden', 'false'); };
    const hide = () => { pop.classList.remove('show'); pop.setAttribute('aria-hidden', 'true'); };

    const key = 'kimera_wpp_pop_seen';
    const seen = sessionStorage.getItem(key) === '1';

    if (!seen) {
      // mostra depois de scroll/tempo
      let shown = false;
      const tryShow = () => {
        if (shown) return;
        shown = true;
        sessionStorage.setItem(key, '1');
        show();
      };

      setTimeout(() => {
        if (window.scrollY < 200) return; // evita aparecer sem contexto
        tryShow();
      }, 6500);

      window.addEventListener('scroll', () => {
        if (window.scrollY > 900) tryShow();
      }, { passive: true });
    }

    close?.addEventListener('click', hide);
  }
})();

// =========================
// assets/js/portfolio.js
// (render, filtros, modal, carrossel simples)
// =========================
(() => {
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];

  // ✅ EDITA AQUI: seus projetos
  // category: "sites" | "identidade" | "criativos"
  // images: array de imagens (para modal / carrossel)
  const PROJECTS = [
    {
      id: "site-01",
      category: "sites",
      title: "Site Institucional — Oficina/Serviços",
      desc: "Layout premium, SEO base, CTA de WhatsApp e performance. Estrutura feita para transmitir confiança.",
      cover: "assets/img/portfolio/site-01.jpg",
      images: ["assets/img/portfolio/site-01.jpg", "assets/img/portfolio/site-01-2.jpg"],
      tags: ["Site", "SEO", "Performance"],
      chips: ["até 5 páginas", "CTA", "responsivo"],
      meta: { Entrega: "15–21 dias", Stack: "HTML/CSS/JS", Objetivo: "Autoridade" },
      link: "https://seusite.com.br",
      highlight: true
    },
    {
      id: "site-02",
      category: "sites",
      title: "Landing Page — Conversão",
      desc: "Página focada em leads: seção de oferta, prova social, formulário e rastreamento (GTM/Pixel).",
      cover: "assets/img/portfolio/landing-01.jpg",
      images: ["assets/img/portfolio/landing-01.jpg", "assets/img/portfolio/landing-01-2.jpg"],
      tags: ["Landing", "Leads", "GTM/Pixel"],
      chips: ["alta conversão", "campanhas", "CTA forte"],
      meta: { Entrega: "10–14 dias", Stack: "HTML/CSS/JS", Objetivo: "Leads" },
      link: "",
      highlight: true
    },
    {
      id: "site-03",
      category: "sites",
      title: "Site — Empresa Local (Premium)",
      desc: "Design minimal premium, seções estratégicas, velocidade e consistência visual.",
      cover: "assets/img/portfolio/site-02.jpg",
      images: ["assets/img/portfolio/site-02.jpg"],
      tags: ["Site", "Design System"],
      chips: ["premium", "UI/UX", "SEO base"],
      meta: { Entrega: "21–30 dias", Stack: "HTML/CSS/JS", Objetivo: "Confiança" },
      link: ""
    },
    {
      id: "site-04",
      category: "sites",
      title: "Site — Portfólio/Serviço",
      desc: "Estrutura de serviços, diferenciais, depoimentos e CTA. Ideal para fechar pelo WhatsApp.",
      cover: "assets/img/portfolio/site-03.jpg",
      images: ["assets/img/portfolio/site-03.jpg", "assets/img/portfolio/site-03-2.jpg"],
      tags: ["Site", "WhatsApp"],
      chips: ["CTA", "prova social"],
      meta: { Entrega: "15–21 dias", Stack: "HTML/CSS/JS", Objetivo: "Fechamento" },
      link: ""
    },

    {
      id: "idv-01",
      category: "identidade",
      title: "Identidade Visual — Logo + Kit",
      desc: "Logo, paleta, tipografia e aplicações (cartão, avatar, capa). Tudo pronto pra usar.",
      cover: "assets/img/portfolio/idv-01.jpg",
      images: ["assets/img/portfolio/idv-01.jpg", "assets/img/portfolio/idv-01-2.jpg", "assets/img/portfolio/idv-01-3.jpg"],
      tags: ["Identidade", "Branding"],
      chips: ["logo", "paleta", "aplicações"],
      meta: { Entrega: "5–10 dias", Arquivos: "PNG/SVG/PDF", Objetivo: "Marca forte" },
      link: "",
      highlight: true
    },
    {
      id: "idv-02",
      category: "identidade",
      title: "Identidade Visual — Premium",
      desc: "Direção mais completa com variações, grade, mockups e mini manual de uso.",
      cover: "assets/img/portfolio/idv-02.jpg",
      images: ["assets/img/portfolio/idv-02.jpg", "assets/img/portfolio/idv-02-2.jpg"],
      tags: ["Identidade", "Premium"],
      chips: ["manual", "mockups"],
      meta: { Entrega: "10–14 dias", Arquivos: "PNG/SVG/PDF", Objetivo: "Autoridade" },
      link: ""
    },

    {
      id: "cri-01",
      category: "criativos",
      title: "Criativos — Social/Ads",
      desc: "Artes para Instagram e anúncios com consistência de marca e foco em oferta.",
      cover: "assets/img/portfolio/criativos-01.jpg",
      images: ["assets/img/portfolio/criativos-01.jpg", "assets/img/portfolio/criativos-01-2.jpg"],
      tags: ["Criativos", "Social"],
      chips: ["feed", "story", "ads"],
      meta: { Entrega: "2–5 dias", Formatos: "1080x1350 / 1080x1920", Objetivo: "Atenção" },
      link: ""
    },
    {
      id: "cri-02",
      category: "criativos",
      title: "Imagens — Mockups/Detalhes",
      desc: "Imagens premium (mockups e elementos) pra elevar o visual do site e redes.",
      cover: "assets/img/portfolio/criativos-02.jpg",
      images: ["assets/img/portfolio/criativos-02.jpg"],
      tags: ["Imagens", "Visual"],
      chips: ["mockups", "assets"],
      meta: { Entrega: "1–3 dias", Formatos: "PNG/WebP", Objetivo: "Percepção premium" },
      link: ""
    }
  ];

  const grid = $("#portfolio-grid");
  const filterBtns = $$(".portfolio-filter");
  const countEls = $$("[data-count]");

  // Modal
  const modal = $("#portfolioModal");
  const mImg = $("#pmodalImage");
  const mDots = $("#pmodalDots");
  const mTags = $("#pmodalTags");
  const mTitle = $("#pmodalTitle");
  const mDesc = $("#pmodalDesc");
  const mMeta = $("#pmodalMeta");
  const mActions = $("#pmodalActions");

  let currentProject = null;
  let currentIndex = 0;

  const labelByCategory = (cat) => {
    if (cat === "sites") return "Site";
    if (cat === "identidade") return "Identidade";
    if (cat === "criativos") return "Criativos";
    return "Projeto";
  };

  const updateCounts = () => {
    const total = PROJECTS.length;
    const by = (c) => PROJECTS.filter(p => p.category === c).length;

    const map = {
      all: total,
      sites: by("sites"),
      identidade: by("identidade"),
      criativos: by("criativos")
    };

    countEls.forEach(el => {
      const key = el.getAttribute("data-count");
      if (key && map[key] != null) el.textContent = map[key];
    });
  };

  const cardTemplate = (p) => {
    const badge = labelByCategory(p.category);
    const accent = p.highlight ? "accent" : "";
    const chips = (p.chips || []).slice(0, 3).map(x => `<span class="pchip">${x}</span>`).join("");
    const tags = (p.tags || []).slice(0, 2);

    return `
      <article class="pcard" data-category="${p.category}" data-id="${p.id}" tabindex="0" role="button" aria-label="Abrir ${p.title}">
        <div class="pcard-media">
          <div class="pcard-badges">
            <span class="pbadge ${accent}">${badge}</span>
            ${p.highlight ? `<span class="pbadge">Destaque</span>` : ``}
          </div>

          <img src="${p.cover}" alt="${p.title}" loading="lazy" decoding="async">
          <div class="pcard-gradient" aria-hidden="true"></div>
        </div>

        <div class="pcard-body">
          <div class="pcard-title">${p.title}</div>
          <div class="pcard-desc">${p.desc}</div>

          <div class="pcard-meta">
            <div class="pmeta-left">
              ${chips}
            </div>
            <div class="pmeta-cta">
              Ver <span class="arrow">→</span>
            </div>
          </div>
        </div>
      </article>
    `;
  };

  const renderGrid = (filter = "all") => {
    if (!grid) return;
    const list = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.category === filter);
    grid.innerHTML = list.map(cardTemplate).join("");
  };

  const setActiveFilter = (key) => {
    filterBtns.forEach(b => b.classList.toggle("is-active", b.dataset.filter === key));
  };

  const openModal = (projectId) => {
    currentProject = PROJECTS.find(p => p.id === projectId);
    if (!currentProject || !modal) return;

    currentIndex = 0;
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";

    // Conteúdo
    mTitle.textContent = currentProject.title;
    mDesc.textContent = currentProject.desc;

    // Tags
    mTags.innerHTML = (currentProject.tags || []).map((t, i) => {
      const cls = i === 0 ? "ptag accent" : "ptag";
      return `<span class="${cls}">${t}</span>`;
    }).join("");

    // Meta
    const meta = currentProject.meta || {};
    mMeta.innerHTML = Object.keys(meta).map(k => (
      `<div class="pmeta-row"><b>${k}</b><span>${meta[k]}</span></div>`
    )).join("");

    // Actions
    const wpp = `https://wa.me/5545999997579?text=${encodeURIComponent(`Oi Kimera! Quero um projeto no padrão desse: ${currentProject.title}. Meu nicho é ... e o objetivo é ...`)}`;
    const btnLive = currentProject.link
      ? `<a class="btn btn-secondary btn-arrow" href="${currentProject.link}" target="_blank" rel="noopener">Ver ao vivo <span class="arrow">→</span></a>`
      : ``;

    mActions.innerHTML = `
      ${btnLive}
      <a class="btn btn-primary btn-arrow" href="${wpp}" target="_blank" rel="noopener">
        Quero um igual <span class="arrow">→</span>
      </a>
    `;

    // Imagens
    renderModalImage();
    renderDots();
  };

  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    currentProject = null;
  };

  const renderModalImage = () => {
    if (!currentProject) return;
    const imgs = currentProject.images?.length ? currentProject.images : [currentProject.cover];
    const src = imgs[currentIndex] || imgs[0];

    if (mImg) {
      mImg.src = src;
      mImg.alt = `${currentProject.title} — imagem ${currentIndex + 1} de ${imgs.length}`;
    }

    // dots active
    $$(".pdot", mDots).forEach((d, i) => d.classList.toggle("is-active", i === currentIndex));
  };

  const renderDots = () => {
    if (!currentProject || !mDots) return;
    const imgs = currentProject.images?.length ? currentProject.images : [currentProject.cover];

    mDots.innerHTML = imgs.map((_, i) => (
      `<button class="pdot ${i === currentIndex ? "is-active" : ""}" type="button" aria-label="Ir para imagem ${i + 1}" data-dot="${i}"></button>`
    )).join("");

    $$(".pdot", mDots).forEach(btn => {
      btn.addEventListener("click", () => {
        currentIndex = Number(btn.dataset.dot || 0);
        renderModalImage();
      });
    });
  };

  const nextImg = () => {
    if (!currentProject) return;
    const imgs = currentProject.images?.length ? currentProject.images : [currentProject.cover];
    currentIndex = (currentIndex + 1) % imgs.length;
    renderModalImage();
  };

  const prevImg = () => {
    if (!currentProject) return;
    const imgs = currentProject.images?.length ? currentProject.images : [currentProject.cover];
    currentIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    renderModalImage();
  };

  // Init
  updateCounts();
  renderGrid("all");
  setActiveFilter("all");

  // Filter events
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.filter || "all";
      setActiveFilter(key);
      renderGrid(key);
    });
  });

  // Delegate click/enter on cards
  document.addEventListener("click", (e) => {
    const card = e.target.closest?.(".pcard");
    if (!card) return;
    openModal(card.dataset.id);
  });

  document.addEventListener("keydown", (e) => {
    // abrir com Enter quando focado no card
    const active = document.activeElement;
    if (e.key === "Enter" && active?.classList?.contains("pcard")) {
      openModal(active.dataset.id);
    }

    // ESC fecha modal
    if (e.key === "Escape" && modal?.getAttribute("aria-hidden") === "false") {
      closeModal();
    }

    // setas no modal
    if (modal?.getAttribute("aria-hidden") === "false") {
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
    }
  });

  // Modal close + nav
  if (modal) {
    modal.addEventListener("click", (e) => {
      const close = e.target.closest?.("[data-close='1']");
      if (close) closeModal();

      if (e.target.closest?.(".pmodal-nav.next")) nextImg();
      if (e.target.closest?.(".pmodal-nav.prev")) prevImg();
    });
  }
})();