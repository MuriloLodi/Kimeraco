/* assets/js/port.js */
(function () {


  const PROJECTS = [
    {
      id: "site-01",
      category: "sites",
      title: "Site Institucional — Serviços/Oficina",
      desc: "Layout premium, SEO base, CTA forte e performance. Estrutura feita para transmitir confiança.",
      cover: "assets/img/new.png",
      images: ["assets/img/new.png", "assets/img/opereirao.png"],
      tags: ["Site", "SEO", "Performance"],
      chips: ["até 5 páginas", "CTA", "responsivo"],
      meta: { Entrega: "15–21 dias", Stack: "HTML/CSS/JS", Objetivo: "Autoridade" },
      link: "",
      highlight: true
    },
    {
      id: "site-02",
      category: "sites",
      title: "Landing Page — Conversão",
      desc: "Página focada em leads: oferta, prova social, formulário e rastreamento (GTM/Pixel).",
      cover: "assets/img/opereirao.png",
      images: ["assets/img/opereirao.png", "assets/img/new.png"],
      tags: ["Landing", "Leads", "GTM/Pixel"],
      chips: ["alta conversão", "campanhas", "CTA forte"],
      meta: { Entrega: "10–14 dias", Stack: "HTML/CSS/JS", Objetivo: "Leads" },
      link: "",
      highlight: true
    },
    {
      id: "idv-01",
      category: "identidade",
      title: "Identidade Visual — Logo + Kit",
      desc: "Logo, paleta, tipografia e aplicações (cartão, avatar, capa). Tudo pronto pra usar.",
      cover: "assets/img/miquimfreios.png",
      images: ["assets/img/miquimfreios.png", "assets/img/new.png"],
      tags: ["Identidade", "Branding"],
      chips: ["logo", "paleta", "aplicações"],
      meta: { Entrega: "5–10 dias", Arquivos: "PNG/SVG/PDF", Objetivo: "Marca forte" },
      link: "",
      highlight: true
    },
    {
      id: "cri-01",
      category: "criativos",
      title: "Criativos — Social/Ads",
      desc: "Artes para Instagram e anúncios com consistência de marca e foco em oferta.",
      cover: "assets/img/new.png",
      images: ["assets/img/new.png"],
      tags: ["Criativos", "Social"],
      chips: ["feed", "story", "ads"],
      meta: { Entrega: "2–5 dias", Formatos: "1080x1350 / 1080x1920", Objetivo: "Atenção" },
      link: ""
    }
  ];

  const PORTFOLIO_FALLBACK_IMAGE = "assets/img/new.png";
  const STATE = { currentProject: null, currentIndex: 0 };

  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  function initYear() {
    const year = String(new Date().getFullYear());
    const yearEls = document.querySelectorAll("#year, [data-year]");
    yearEls.forEach((el) => {
      el.textContent = year;
    });
  }

  function labelByCategory(cat) {
    if (cat === "sites") return "Site";
    if (cat === "identidade") return "Identidade";
    if (cat === "criativos") return "Criativos";
    return "Projeto";
  }

  function updateCounts() {
    const total = PROJECTS.length;
    const by = (c) => PROJECTS.filter(p => p.category === c).length;
    const map = { all: total, sites: by("sites"), identidade: by("identidade"), criativos: by("criativos") };

    $$("[data-count]").forEach(el => {
      const key = el.getAttribute("data-count");
      if (key && map[key] != null) el.textContent = map[key];
    });
  }

  function cardTemplate(p) {
    const badge = labelByCategory(p.category);
    const accent = p.highlight ? "accent" : "";
    const chips = (p.chips || []).slice(0, 3).map(x => `<span class="pchip">${x}</span>`).join("");

    return `
      <article class="pcard" data-category="${p.category}" data-id="${p.id}" tabindex="0" role="button" aria-label="Abrir ${p.title}">
        <div class="pcard-media">
          <div class="pcard-badges">
            <span class="pbadge ${accent}">${badge}</span>
            ${p.highlight ? `<span class="pbadge">Destaque</span>` : ``}
          </div>
          <img src="${p.cover}" alt="${p.title}" loading="lazy" decoding="async" data-portfolio-img="1">
          <div class="pcard-gradient" aria-hidden="true"></div>
        </div>

        <div class="pcard-body">
          <div class="pcard-title">${p.title}</div>
          <div class="pcard-desc">${p.desc}</div>
          <div class="pcard-meta">
            <div class="pmeta-left">${chips}</div>
            <div class="pmeta-cta">Ver <span class="arrow">→</span></div>
          </div>
        </div>
      </article>
    `;
  }

  function renderGrid(filter = "all") {
    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    const list = filter === "all" ? PROJECTS : PROJECTS.filter(p => p.category === filter);
    grid.innerHTML = list.map(cardTemplate).join("");
    bindCardEvents(grid);
    bindImageFallbacks(grid);
  }

  function bindImageFallbacks(scope = document) {
    $$("img[data-portfolio-img]", scope).forEach(img => {
      if (img.dataset.fallbackInit === "1") return;
      img.dataset.fallbackInit = "1";
      img.addEventListener("error", () => {
        img.src = PORTFOLIO_FALLBACK_IMAGE;
      }, { once: true });
    });
  }

  function bindCardEvents(scope = document) {
    $$(".pcard", scope).forEach(card => {
      if (card.dataset.cardInit === "1") return;
      card.dataset.cardInit = "1";
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        if (id) openModal(id);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const id = card.dataset.id;
          if (id) openModal(id);
        }
      });
    });
  }

  function setActiveFilter(key) {
    $$(".portfolio-filter").forEach(b => b.classList.toggle("is-active", b.dataset.filter === key));
  }

  function getModalEls() {
    return {
      modal: document.getElementById("portfolioModal"),
      mImg: document.getElementById("pmodalImage"),
      mDots: document.getElementById("pmodalDots"),
      mTags: document.getElementById("pmodalTags"),
      mTitle: document.getElementById("pmodalTitle"),
      mDesc: document.getElementById("pmodalDesc"),
      mMeta: document.getElementById("pmodalMeta"),
      mActions: document.getElementById("pmodalActions"),
    };
  }

  function renderModalImage() {
    const { modal, mImg, mDots } = getModalEls();
    if (!modal || !mImg) return;
    if (!STATE.currentProject) return;

    const imgs = STATE.currentProject.images?.length ? STATE.currentProject.images : [STATE.currentProject.cover];
    const src = imgs[STATE.currentIndex] || imgs[0] || PORTFOLIO_FALLBACK_IMAGE;

    mImg.onerror = () => {
      mImg.onerror = null;
      mImg.src = PORTFOLIO_FALLBACK_IMAGE;
    };
    mImg.src = src;
    mImg.alt = `${STATE.currentProject.title} — imagem ${STATE.currentIndex + 1} de ${imgs.length}`;

    if (mDots) $$(".pdot", mDots).forEach((d, i) => d.classList.toggle("is-active", i === STATE.currentIndex));
  }

  function renderDots() {
    const { mDots } = getModalEls();
    if (!STATE.currentProject || !mDots) return;

    const imgs = STATE.currentProject.images?.length ? STATE.currentProject.images : [STATE.currentProject.cover];

    mDots.innerHTML = imgs.map((_, i) =>
      `<button class="pdot ${i === STATE.currentIndex ? "is-active" : ""}" type="button" aria-label="Ir para imagem ${i + 1}" data-dot="${i}"></button>`
    ).join("");
  }

  function openModal(projectId) {
    const els = getModalEls();
    if (!els.modal) return; // modal precisa existir no DOM

    STATE.currentProject = PROJECTS.find(p => p.id === projectId);
    if (!STATE.currentProject) return;

    STATE.currentIndex = 0;

    els.modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";

    if (els.mTitle) els.mTitle.textContent = STATE.currentProject.title;
    if (els.mDesc) els.mDesc.textContent = STATE.currentProject.desc;

    if (els.mTags) {
      els.mTags.innerHTML = (STATE.currentProject.tags || []).map((t, i) => {
        const cls = i === 0 ? "ptag accent" : "ptag";
        return `<span class="${cls}">${t}</span>`;
      }).join("");
    }

    if (els.mMeta) {
      const meta = STATE.currentProject.meta || {};
      els.mMeta.innerHTML = Object.keys(meta).map(k =>
        `<div class="pmeta-row"><b>${k}</b><span>${meta[k]}</span></div>`
      ).join("");
    }

    if (els.mActions) {
      const wpp = `https://wa.me/5545999997579?text=${encodeURIComponent(
        `Oi Kimera! Quero um projeto no padrão desse: ${STATE.currentProject.title}. Meu nicho é ... e o objetivo é ...`
      )}`;

      const btnLive = STATE.currentProject.link
        ? `<a class="btn btn-secondary btn-arrow" href="${STATE.currentProject.link}" target="_blank" rel="noopener">Ver ao vivo <span class="arrow">→</span></a>`
        : ``;

      els.mActions.innerHTML = `
        ${btnLive}
        <a class="btn btn-primary btn-arrow" href="${wpp}" target="_blank" rel="noopener">
          Quero um igual <span class="arrow">→</span>
        </a>
      `;
    }

    renderDots();
    renderModalImage();
  }

  function closeModal() {
    const { modal } = getModalEls();
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
    STATE.currentProject = null;
  }

  function nextImg() {
    if (!STATE.currentProject) return;
    const imgs = STATE.currentProject.images?.length ? STATE.currentProject.images : [STATE.currentProject.cover];
    STATE.currentIndex = (STATE.currentIndex + 1) % imgs.length;
    renderModalImage();
  }

  function prevImg() {
    if (!STATE.currentProject) return;
    const imgs = STATE.currentProject.images?.length ? STATE.currentProject.images : [STATE.currentProject.cover];
    STATE.currentIndex = (STATE.currentIndex - 1 + imgs.length) % imgs.length;
    renderModalImage();
  }

  function bindGlobalOnce() {
    if (window.__kimeraPortfolioBound) return;
    window.__kimeraPortfolioBound = true;

    // clicks (card + modal controls)
    document.addEventListener("click", (e) => {
      const dot = e.target.closest?.(".pdot");
      if (dot && dot.dataset?.dot != null) {
        STATE.currentIndex = Number(dot.dataset.dot || 0);
        renderModalImage();
        return;
      }

      if (e.target.closest?.("[data-close='1']")) closeModal();
      if (e.target.closest?.(".pmodal-nav.next")) nextImg();
      if (e.target.closest?.(".pmodal-nav.prev")) prevImg();
    });

    // teclado
    document.addEventListener("keydown", (e) => {
      const { modal } = getModalEls();
      const open = modal?.getAttribute("aria-hidden") === "false";

      if (e.key === "Enter" && document.activeElement?.classList?.contains("pcard")) {
        const id = document.activeElement.dataset.id;
        if (id) openModal(id);
      }

      if (!open) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImg();
      if (e.key === "ArrowLeft") prevImg();
    });
  }

  function initPortfolio() {
    initYear();
    bindGlobalOnce();

    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    // evita re-init duplicado no mesmo DOM
    if (grid.dataset.kimeraInit === "1") return;
    grid.dataset.kimeraInit = "1";

    updateCounts();
    renderGrid("all");
    setActiveFilter("all");

    $$(".portfolio-filter").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.filter || "all";
        setActiveFilter(key);
        renderGrid(key);
      });
    });
  }

  window.kimeraPortfolioInit = initPortfolio;
  document.addEventListener("DOMContentLoaded", initPortfolio);
  document.addEventListener("swup:page:view", initPortfolio);
})();
