/* Acarreos Makena — interacciones de las páginas de servicio */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Botones flotantes al bajar
  const flotante = $('.wa-flotante');
  const barraMovil = $('.barra-movil');
  const alBajar = () => {
    const y = scrollY;
    if (flotante) flotante.classList.toggle('visible', y > innerHeight * 0.6);
    if (barraMovil) barraMovil.classList.toggle('visible', y > innerHeight * 0.45);
  };
  addEventListener('scroll', alBajar, { passive: true });
  alBajar();

  // Menú móvil
  const boton = $('#hamburguesa');
  if (boton) {
    const cerrar = () => {
      document.body.classList.remove('menu-abierto');
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú');
    };
    boton.addEventListener('click', () => {
      const abierto = document.body.classList.toggle('menu-abierto');
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });
    $$('#menu a').forEach(a => a.addEventListener('click', cerrar));
  }

  // Aparición suave al hacer scroll
  const items = $$('[data-revelar]');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => obs.observe(el));
  } else {
    items.forEach(el => el.classList.add('visible'));
  }
})();
