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

  // Showroom de la flota: cada tarjeta muestra su camión
  const garaje = $('#garaje');
  if (garaje) {
    const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const medida = $('#garaje-medida');
    const botones = $$('.vehiculo[data-vehiculo]');
    const autos = $$('.garaje__vehiculo', garaje);
    const elegir = (cual, boton) => {
      if (garaje.dataset.activo === cual) return;
      garaje.dataset.activo = cual;
      botones.forEach(b => {
        const si = b.dataset.vehiculo === cual;
        b.classList.toggle('activo', si);
        b.setAttribute('aria-pressed', String(si));
      });
      autos.forEach(a => {
        if (a.dataset.vehiculo === cual) {
          a.classList.remove('saliendo');
          a.classList.add('activo');
        } else if (a.classList.contains('activo')) {
          a.classList.remove('activo');
          a.classList.add('saliendo');
          setTimeout(() => a.classList.remove('saliendo'), 900);
        }
      });
      medida.classList.add('cambiando');
      setTimeout(() => { medida.textContent = boton.dataset.medida; medida.classList.remove('cambiando'); }, 280);
      const r = garaje.getBoundingClientRect();
      if (r.top < 60 || r.bottom > innerHeight) {
        garaje.scrollIntoView({ behavior: sinMovimiento ? 'auto' : 'smooth', block: 'center' });
      }
    };
    botones.forEach(b => b.addEventListener('click', () => elegir(b.dataset.vehiculo, b)));
  }
})();
