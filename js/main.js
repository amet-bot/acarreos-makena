/* Acarreos Makena — interacciones */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WHATSAPP = '50764525086';

  /* ---------- Cabecera con fondo al bajar ---------- */
  const cabecera = $('#cabecera');
  const flotante = $('.wa-flotante');
  const alBajar = () => {
    const y = scrollY;
    cabecera.classList.toggle('con-fondo', y > 40);
    flotante.classList.toggle('visible', y > innerHeight * 0.6);
  };
  addEventListener('scroll', alBajar, { passive: true });
  alBajar();

  /* ---------- Menú móvil ---------- */
  const boton = $('#hamburguesa');
  const cerrarMenu = () => {
    document.body.classList.remove('menu-abierto');
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-label', 'Abrir menú');
  };
  boton.addEventListener('click', () => {
    const abierto = document.body.classList.toggle('menu-abierto');
    boton.setAttribute('aria-expanded', String(abierto));
    boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
  });
  $$('#menu a').forEach(a => a.addEventListener('click', cerrarMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape') cerrarMenu(); });

  /* ---------- Enlace activo según la sección ---------- */
  const enlaces = $$('#menu a:not(.boton)');
  const secciones = $$('main > section[id]');
  const obsSeccion = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      enlaces.forEach(a => a.classList.toggle('activo', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secciones.forEach(s => obsSeccion.observe(s));

  /* ---------- Revelar al hacer scroll ---------- */
  const obsRevelar = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obsRevelar.unobserve(en.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('[data-revelar]').forEach(el => obsRevelar.observe(el));

  /* ---------- Palabra que rota ---------- */
  const palabras = ['mudanzas', 'escombros', 'caliche', 'mercancías', 'cachivaches', 'oficinas', 'frágiles'];
  const rotador = $('#rotador');
  if (rotador && !sinMovimiento) {
    let i = 0;
    setInterval(() => {
      i = (i + 1) % palabras.length;
      rotador.classList.add('saliendo');
      setTimeout(() => {
        rotador.textContent = palabras[i];
        rotador.classList.remove('saliendo');
        rotador.classList.add('entrando');
        void rotador.offsetWidth; // reinicia la transición
        rotador.classList.remove('entrando');
      }, 380);
    }, 2200);
  }

  /* ---------- Siluetas de la ciudad (generadas) ---------- */
  const silueta = (semilla, ancho, alto, color, ventanas) => {
    let s = semilla;
    const azar = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    let x = 0, partes = '';
    while (x < ancho) {
      const w = 22 + azar() * 46;
      const h = alto * (0.25 + azar() * 0.75);
      const y = alto - h;
      partes += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${color}"/>`;
      if (azar() > 0.7) { // antena o techo inclinado
        partes += `<rect x="${(x + w / 2 - 1).toFixed(1)}" y="${(y - 12).toFixed(1)}" width="2" height="12" fill="${color}"/>`;
      }
      if (ventanas) {
        for (let vy = y + 8; vy < alto - 8; vy += 12) {
          for (let vx = x + 6; vx < x + w - 6; vx += 10) {
            if (azar() > 0.78) partes += `<rect x="${vx.toFixed(1)}" y="${vy.toFixed(1)}" width="4" height="5" fill="#ffc21a" opacity=".55"/>`;
          }
        }
      }
      x += w + 2 + azar() * 6;
    }
    const svg = `<svg viewBox="0 0 ${ancho} ${alto}" preserveAspectRatio="none" aria-hidden="true">${partes}</svg>`;
    return svg + svg; // dos copias para el bucle infinito
  };
  const lejos = $('#ciudad-lejos'), cerca = $('#ciudad-cerca');
  if (lejos) lejos.innerHTML = silueta(7, 1400, 120, '#2a4f9e', false);
  if (cerca) cerca.innerHTML = silueta(31, 1400, 84, '#0d2a63', true);

  /* ---------- Línea de progreso de los pasos ---------- */
  const pasos = $('#pasos');
  const itemsPaso = $$('.paso', pasos);
  const actualizarPasos = () => {
    const r = pasos.getBoundingClientRect();
    const inicio = innerHeight * 0.75;
    const p = Math.min(1, Math.max(0, (inicio - r.top) / (r.height + innerHeight * 0.15)));
    pasos.style.setProperty('--progreso', p.toFixed(3));
    itemsPaso.forEach((el, k) => el.classList.toggle('encendido', p >= k / (itemsPaso.length - 1) - 0.02 || p >= 0.98));
  };
  addEventListener('scroll', actualizarPasos, { passive: true });
  addEventListener('resize', actualizarPasos);
  actualizarPasos();

  /* ---------- Luz que sigue el cursor en las tarjetas ---------- */
  $$('[data-foco]').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--x', `${e.clientX - r.left}px`);
      card.style.setProperty('--y', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Videos: se reproducen solos solo cuando se ven ---------- */
  const videos = $$('video[data-auto]');
  if (!sinMovimiento) {
    const obsVideo = new IntersectionObserver(entradas => {
      entradas.forEach(en => {
        const v = en.target;
        if (en.isIntersecting) {
          v.preload = 'auto';
          v.play().then(() => v.parentElement.classList.add('sonando')).catch(() => {});
        } else {
          v.pause();
          v.parentElement.classList.remove('sonando');
        }
      });
    }, { threshold: 0.35 });
    videos.forEach(v => obsVideo.observe(v));
  } else {
    // con movimiento reducido: el video arranca solo si la persona lo toca
    videos.forEach(v => v.parentElement.addEventListener('click', () => (v.paused ? v.play() : v.pause())));
  }

  /* ---------- Inclinación 3D de las fotos ---------- */
  if (!sinMovimiento && matchMedia('(hover: hover)').matches) {
    $$('[data-inclinar]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 8}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Parallax suave en la portada ---------- */
  const visual = $('.portada__visual');
  if (visual && !sinMovimiento) {
    let pendiente = false;
    addEventListener('scroll', () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        const y = Math.min(scrollY, innerHeight);
        visual.style.translate = `0 ${y * 0.12}px`;
        pendiente = false;
      });
    }, { passive: true });
  }

  /* ---------- Botones "Cotizar X" eligen el servicio ---------- */
  $$('[data-servicio]').forEach(a => {
    a.addEventListener('click', () => {
      const valor = a.dataset.servicio;
      const radio = $$('#opciones input').find(r => r.value === valor);
      (radio || $$('#opciones input').find(r => r.value === 'Otro')).checked = true;
      if (!radio) {
        const det = $('#formulario [name="detalles"]');
        if (!det.value) det.value = `Servicio: ${valor}. `;
      }
    });
  });

  /* ---------- Formulario → WhatsApp ---------- */
  const form = $('#formulario');
  const error = $('#error');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const faltan = ['nombre', 'desde'].filter(k => !String(d[k] || '').trim());
    $$('input', form).forEach(i => i.classList.toggle('con-error', faltan.includes(i.name)));
    if (faltan.length) {
      error.textContent = 'Escribe tu nombre y desde dónde sale la carga.';
      $(`[name="${faltan[0]}"]`, form).focus();
      return;
    }
    error.textContent = '';
    let fecha = '';
    if (d.fecha) {
      const [a, m, dia] = d.fecha.split('-');
      fecha = `${dia}/${m}/${a}`;
    }
    const lineas = [
      `Hola Acarreos Makena, soy ${d.nombre.trim()}.`,
      `Quiero cotizar: *${d.servicio}*`,
      `📍 Desde: ${d.desde.trim()}`,
      d.hasta.trim() && `🏁 Hasta: ${d.hasta.trim()}`,
      fecha && `📅 Fecha: ${fecha}`,
      d.detalles.trim() && `📝 Detalles: ${d.detalles.trim()}`,
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
  });
  $$('input', form).forEach(i => i.addEventListener('input', () => i.classList.remove('con-error')));

  /* ---------- Año del pie ---------- */
  $('#anio').textContent = new Date().getFullYear();
})();
