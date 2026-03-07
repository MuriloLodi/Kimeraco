// assets/js/planos-page.js - interactions (preloader, nav, drawer, faq, compare, wpp-pop)
(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  let controller = null;
  const pendingTimeouts = new Set();

  const setSafeTimeout = (fn, delay) => {
    const id = window.setTimeout(() => {
      pendingTimeouts.delete(id);
      fn();
    }, delay);
    pendingTimeouts.add(id);
    return id;
  };

  const clearTimers = () => {
    pendingTimeouts.forEach((id) => window.clearTimeout(id));
    pendingTimeouts.clear();
  };

  const prepareInit = () => {
    clearTimers();
    if (controller) controller.abort();
    controller = new AbortController();
    return controller.signal;
  };

  function initPreloader() {
    const preloader = $("#preloader");
    if (!preloader) return;

    const key = "kimera_preloader_seen";
    const navType = performance.getEntriesByType?.("navigation")?.[0]?.type;
    const alreadySeen = sessionStorage.getItem(key) === "1";

    const finish = () => {
      preloader.classList.add("done");
      setSafeTimeout(() => preloader.remove(), 520);
    };

    if (alreadySeen || navType === "back_forward") {
      preloader.style.display = "none";
      return;
    }

    const bar = $(".preloader-bar", preloader);
    const count = $(".preloader-count", preloader);
    const start = performance.now();
    const duration = 900;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const progress = Math.round(eased * 100);

      if (bar) bar.style.width = `${progress}%`;
      if (count) count.textContent = `${progress}%`;

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(key, "1");
        finish();
      }
    };

    requestAnimationFrame(tick);
  }

  function initNav(signal) {
    const nav = $("#nav");
    const burger = $(".nav-burger");
    const drawer = $("#nav-drawer");

    const setScrolled = () => {
      if (!nav) return;
      nav.classList.toggle("scrolled", window.scrollY > 8);
    };

    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true, signal });

    const setDrawer = (open) => {
      if (!burger || !drawer) return;
      burger.classList.toggle("open", open);
      drawer.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      drawer.setAttribute("aria-hidden", open ? "false" : "true");
      document.documentElement.style.overflow = open ? "hidden" : "";
    };

    if (!burger || !drawer) return;

    burger.addEventListener("click", (event) => {
      event.stopPropagation();
      setDrawer(!drawer.classList.contains("open"));
    }, { signal });

    $$(".nav-link", drawer).forEach((link) => {
      link.addEventListener("click", () => setDrawer(false), { signal });
    });

    document.addEventListener("click", (event) => {
      if (!burger.contains(event.target) && !drawer.contains(event.target)) {
        setDrawer(false);
      }
    }, { signal });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setDrawer(false);
    }, { signal });
  }

  function initSmoothAnchors(signal) {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const id = link.getAttribute("href");
        if (!id || id.length < 2) return;

        const target = document.getElementById(id.slice(1));
        if (!target) return;

        event.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, { signal });
    });
  }

  function initFaq(signal) {
    $$(".faq-item").forEach((item) => {
      const button = $(".faq-question", item);
      const answer = $(".faq-answer", item);
      if (!button || !answer) return;

      button.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        $$(".faq-item.open").forEach((opened) => {
          if (opened === item) return;
          opened.classList.remove("open");
          const b = $(".faq-question", opened);
          const a = $(".faq-answer", opened);
          if (b) b.setAttribute("aria-expanded", "false");
          if (a) {
            a.style.maxHeight = "0px";
            a.setAttribute("aria-hidden", "true");
          }
        });

        item.classList.toggle("open", !isOpen);
        button.setAttribute("aria-expanded", String(!isOpen));
        answer.setAttribute("aria-hidden", isOpen ? "true" : "false");

        if (!isOpen) {
          answer.style.maxHeight = `${answer.scrollHeight}px`;
          setSafeTimeout(() => {
            if (item.classList.contains("open")) {
              answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
          }, 120);
        } else {
          answer.style.maxHeight = "0px";
        }
      }, { signal });
    });
  }

  function initCompare(signal) {
    const compareWrap = $(".compare-wrap");
    const compareButtons = $$("[data-compare]");
    const popularButton = $("#btnHighlightPopular");
    const table = $(".compare-table");

    if (!table) return;

    const applyFilter = (key) => {
      $$("tbody tr", table).forEach((row) => {
        const group = row.getAttribute("data-group") || "";
        const alwaysVisible = ["delivery", "support", "hosting"].includes(group);
        const show = key === "all" || alwaysVisible || group === key;
        row.style.display = show ? "" : "none";
      });

      compareButtons.forEach((button) => {
        const isActive = button.getAttribute("data-compare") === key;
        button.classList.toggle("btn-primary", isActive);
        button.classList.toggle("btn-secondary", !isActive);
      });

      if (compareWrap) {
        compareWrap.scrollTo({ left: 0, top: 0, behavior: "smooth" });
      }
    };

    compareButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyFilter(button.getAttribute("data-compare") || "all");
      }, { signal });
    });
    applyFilter("all");

    if (!popularButton) return;

    let highlighted = false;
    popularButton.addEventListener("click", () => {
      highlighted = !highlighted;

      const headers = $$("thead th", table);
      const targetIndex = headers.findIndex((th) => th.getAttribute("data-col") === "conversao");
      if (targetIndex === -1) return;

      $$("tr", table).forEach((row) => {
        const cells = $$("th, td", row);
        if (cells[targetIndex]) {
          cells[targetIndex].classList.toggle("col-highlight", highlighted);
        }
      });

      popularButton.classList.toggle("btn-primary", highlighted);
      popularButton.classList.toggle("btn-ghost", !highlighted);
      popularButton.textContent = highlighted ? "Recomendado destacado" : "Destacar recomendado";
    }, { signal });
  }

  function initWppPop(signal) {
    const pop = $("#wpp-pop");
    if (!pop) return;

    const closeButton = $(".wpp-pop-close", pop);
    const key = "kimera_wpp_pop_seen";
    const seen = sessionStorage.getItem(key) === "1";

    const show = () => {
      pop.classList.add("show");
      pop.setAttribute("aria-hidden", "false");
    };

    const hide = () => {
      pop.classList.remove("show");
      pop.setAttribute("aria-hidden", "true");
    };

    if (!seen) {
      let shown = false;
      const tryShow = () => {
        if (shown) return;
        shown = true;
        sessionStorage.setItem(key, "1");
        show();
      };

      setSafeTimeout(() => {
        if (window.scrollY < 200) return;
        tryShow();
      }, 6500);

      window.addEventListener("scroll", () => {
        if (window.scrollY > 900) tryShow();
      }, { passive: true, signal });
    }

    closeButton?.addEventListener("click", hide, { signal });
  }

  function initPlanosPage() {
    const signal = prepareInit();
    initPreloader();
    initNav(signal);
    initSmoothAnchors(signal);
    initFaq(signal);
    initCompare(signal);
    initWppPop(signal);
  }

  window.kimeraPlanosInit = initPlanosPage;
  document.addEventListener("DOMContentLoaded", initPlanosPage);
  document.addEventListener("swup:page:view", initPlanosPage);
})();
