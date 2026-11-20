// Menu mobile das páginas de serviço e região (sem dependências).
(function () {
  var burger = document.querySelector('.nav-burger');
  var drawer = document.getElementById('nav-drawer');
  if (!burger || !drawer) return;
  function set(open) {
    burger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    drawer.setAttribute('aria-hidden', String(!open));
    if (open) drawer.removeAttribute('inert'); else drawer.setAttribute('inert', '');
  }
  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    set(!burger.classList.contains('open'));
  });
  document.addEventListener('click', function (e) {
    if (!drawer.contains(e.target) && !burger.contains(e.target)) set(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') set(false);
  });
})();
