/* assets/js/port.js */
(function () {


  const PROJECTS = [
    {
      id: "miquim-freios",
      category: "sites",
      title: "Miquim Freios",
      desc: "Site focado em autoridade local, clareza de serviços e conversão em pedido de orçamento.",
      cover: "assets/img/miquimfreios.png",
      images: ["assets/img/miquimfreios.png"],
      tags: ["Site", "Oficina"],
      chips: ["site profissional", "SEO base", "CTA forte"],
      meta: { Entrega: "15-21 dias", Stack: "HTML/CSS/JS", Objetivo: "Orçamentos" },
      link: "",
      highlight: true
    },
    {
      id: "o-pereirao",
      category: "sites",
      title: "O Pereirão",
      desc: "Site com foco em oferta, prova visual e caminho direto para contato no WhatsApp.",
      cover: "assets/img/opereirao.png",
      images: ["assets/img/opereirao.png"],
      tags: ["Site", "Conversão"],
      chips: ["campanha", "oferta", "WhatsApp"],
      meta: { Entrega: "10-14 dias", Stack: "HTML/CSS/JS", Objetivo: "Leads" },
      link: "",
      highlight: true
    },
    {
      id: "new-tech-moveis",
      category: "sites",
      title: "New Tech Móveis",
      desc: "Site premium para apresentar serviços, transmitir confiança e facilitar negociação.",
      cover: "assets/img/new.png",
      images: ["assets/img/new.png"],
      tags: ["Site", "Institucional"],
      chips: ["layout premium", "responsivo", "performance"],
      meta: { Entrega: "15-21 dias", Stack: "HTML/CSS/JS", Objetivo: "Autoridade" },
      link: "",
      highlight: true
    },
    {
      id: "identidade-exemplo",
      category: "identidade",
      title: "Identidade Visual — Projeto Exemplo",
      desc: "Placeholder para você substituir com o case real de identidade visual.",
      cover: "assets/img/new.png",
      images: ["assets/img/new.png"],
      tags: ["Identidade", "Branding"],
      chips: ["logo", "paleta", "tipografia"],
      meta: { Entrega: "5-10 dias", Arquivos: "PNG/SVG/PDF", Objetivo: "Marca forte" },
      link: "",
      highlight: false
    },
    {
      id: "criativos-exemplo",
      category: "criativos",
      title: "Criativos — Projeto Exemplo",
      desc: "Placeholder para você substituir com o case real de criativos.",
      cover: "assets/img/opereirao.png",
      images: ["assets/img/opereirao.png"],
      tags: ["Criativos", "Social"],
      chips: ["feed", "story", "ads"],
      meta: { Entrega: "2-5 dias", Formatos: "1080x1350 / 1080x1920", Objetivo: "Atenção" },
      link: "",
      highlight: false
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

  function ensurePortfolioModal() {
    const existing = document.getElementById("portfolioModal");
    if (existing) return existing;

    const host = document.getElementById("swup") || document.body;
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div id="portfolioModal" class="pmodal" aria-hidden="true">
        <div class="pmodal-backdrop" data-close="1" aria-hidden="true"></div>
        <div class="pmodal-dialog" role="dialog" aria-modal="true" aria-label="Detalhes do projeto">
          <button class="pmodal-close" type="button" data-close="1" aria-label="Fechar">&times;</button>
          <div class="pmodal-body">
            <div class="pmodal-media">
              <img id="pmodalImage" src="" alt="" loading="eager" decoding="async" />
              <button class="pmodal-nav prev" type="button" aria-label="Imagem anterior">&#x2039;</button>
              <button class="pmodal-nav next" type="button" aria-label="Próxima imagem">&#x203A;</button>
              <div id="pmodalDots" class="pmodal-dots" aria-label="Navegação de imagens"></div>
            </div>
            <div class="pmodal-content">
              <div id="pmodalTags" class="pmodal-tags"></div>
              <div id="pmodalTitle" class="pmodal-title">Projeto</div>
              <div id="pmodalDesc" class="pmodal-desc"></div>
              <div id="pmodalMeta" class="pmodal-meta"></div>
              <div id="pmodalActions" class="pmodal-actions"></div>
              <div class="pmodal-note">
                * Imagens são exemplos de apresentação. O seu projeto é construído sob medida para seu nicho e objetivo.
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const modal = wrap.firstElementChild;
    if (modal) host.appendChild(modal);
    return document.getElementById("portfolioModal");
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
    ensurePortfolioModal();
    const els = getModalEls();
    if (!els.modal) return; // modal precisa existir no DOM

    STATE.currentProject = PROJECTS.find(p => p.id === projectId);
    if (!STATE.currentProject) return;

    STATE.currentIndex = 0;

    els.modal.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

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
    document.body.style.overflow = "";
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
      const card = e.target.closest?.(".pcard");
      if (card?.dataset?.id) {
        openModal(card.dataset.id);
        return;
      }

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

      const focusedCard = document.activeElement?.classList?.contains("pcard");
      if ((e.key === "Enter" || e.key === " " || e.code === "Space") && focusedCard) {
        e.preventDefault();
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

    const grid = document.getElementById("portfolio-grid");
    if (!grid) return;

    ensurePortfolioModal();
    bindGlobalOnce();

    updateCounts();
    renderGrid("all");
    setActiveFilter("all");

    $$(".portfolio-filter").forEach(btn => {
      if (btn.dataset.filterInit === "1") return;
      btn.dataset.filterInit = "1";
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
