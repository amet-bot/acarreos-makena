/* Acarreos Makena — interacciones */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WHATSAPP = '50764525086';

  /* ---------- Cabecera con fondo al bajar ---------- */
  const cabecera = $('#cabecera');
  const flotante = $('.wa-flotante');
  const barraMovil = $('.barra-movil');
  const alBajar = () => {
    const y = scrollY;
    cabecera.classList.toggle('con-fondo', y > 40);
    flotante.classList.toggle('visible', y > innerHeight * 0.6);
    barraMovil.classList.toggle('visible', y > innerHeight * 0.45);
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
  const palabras = ['mudanzas', 'corotos', 'facturas', 'escombros', 'caliche', 'maquinaria', 'mercancías', 'tarimas', 'oficinas', 'frágiles'];
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

  /* ---------- Paisaje de Panamá (generado): cerro Ancón, torres con luces, palmeras y faroles ---------- */
  const TRAMO = 1600; // ancho de cada dibujo; se repite para el bucle infinito
  const azarCon = semilla => { let s = semilla; return () => (s = (s * 9301 + 49297) % 233280) / 233280; };
  const f = n => n.toFixed(1);
  const envolver = (alto, defs, cuerpo) => {
    const svg = `<svg width="${TRAMO}" height="${alto}" viewBox="0 0 ${TRAMO} ${alto}" aria-hidden="true">${defs ? `<defs>${defs}</defs>` : ''}${cuerpo}</svg>`;
    return svg + svg + svg; // tres copias: cubre pantallas de hasta 3200 px mientras avanza
  };

  // Capa lejana: el cerro Ancón con su bandera y torres difusas
  const capaLejos = () => {
    const H = 150, az = azarCon(11);
    let torres = '';
    for (let x = 6; x < TRAMO - 50;) {
      const w = 18 + az() * 30, h = 40 + az() * 72;
      torres += `<rect x="${f(x)}" y="${f(H - h)}" width="${f(w)}" height="${f(h)}"/>`;
      x += w + 6 + az() * 34;
    }
    const cerro = `<path d="M0 ${H}V${H - 28}C180 ${H - 36} 320 ${H - 96} 470 ${H - 100}C600 ${H - 104} 690 ${H - 58} 820 ${H - 46}C1000 ${H - 32} 1200 ${H - 54} 1350 ${H - 40}C1450 ${H - 32} 1550 ${H - 28} 1600 ${H - 28}V${H}Z"/>`;
    const bandera = `<path d="M470 ${H - 100}V${H - 130}" stroke="#2c4d93" stroke-width="2"/>`
      + `<g transform="translate(471 ${H - 130})" opacity=".85"><rect width="15" height="10" fill="#e9eef8"/><rect x="7.5" width="7.5" height="5" fill="#d21034"/><rect y="5" width="7.5" height="5" fill="#005293"/></g>`;
    return envolver(H, '', `<g fill="#1b3c84" opacity=".5">${torres}</g><g fill="#132f6b">${cerro}</g>${bandera}`);
  };

  // Capa media: torres de la ciudad (con el Tornillo y una torre vela) y ventanas encendidas
  const capaMedio = () => {
    const H = 132, az = azarCon(29), color = '#0e275d', canto = '#173a80';
    let edif = '', luces = '';
    const ventanas = (x, y, w) => {
      for (let vy = y + 8; vy < H - 6; vy += 9) {
        for (let vx = x + 5; vx < x + w - 6; vx += 7) {
          if (az() > .72) {
            const tono = az() > .82 ? '#9fd5ff' : '#ffd166';
            luces += `<rect x="${f(vx)}" y="${f(vy)}" width="3" height="4" fill="${tono}" opacity="${f(.4 + az() * .5)}"${az() > .94 ? ' class="titila"' : ''}/>`;
          }
        }
      }
    };
    const puestos = {};
    for (let x = 4; x < TRAMO - 60;) {
      let tipo = ['caja', 'escalones', 'punta', 'antena', 'redondo'][Math.floor(az() * 5)];
      if (!puestos.tornillo && x > 360) tipo = puestos.tornillo = 'tornillo';
      else if (!puestos.vela && x > 1040) tipo = puestos.vela = 'vela';
      let w = 30 + az() * 34, h = 50 + az() * 62;
      if (tipo === 'tornillo') { w = 34; h = 124; }
      if (tipo === 'vela') { w = 46; h = 114; }
      const y = H - h;
      if (tipo === 'tornillo') {
        // torre retorcida: los pisos se van desplazando de un lado a otro
        for (let i = 0, py = H; py > y; i++, py -= 6) {
          const d = Math.sin(i * .42) * 5;
          edif += `<rect x="${f(x + d)}" y="${f(py - 6)}" width="${w}" height="5.3" fill="${i % 2 ? color : canto}"/>`;
          if (az() > .55) luces += `<rect x="${f(x + d + 4 + az() * (w - 12))}" y="${f(py - 4.6)}" width="5" height="2.4" fill="#ffd166" opacity=".75"/>`;
        }
        edif += `<rect x="${f(x + w / 2 - 1)}" y="${f(y - 16)}" width="2" height="16" fill="${color}"/>`;
        luces += `<circle cx="${f(x + w / 2)}" cy="${f(y - 17)}" r="2" fill="#ff5a5a" class="titila"/>`;
      } else if (tipo === 'vela') {
        // torre con forma de vela
        edif += `<path d="M${f(x)} ${H}V${f(y + 10)}Q${f(x + w * 1.15)} ${f(y - 8)} ${f(x + w)} ${H}Z" fill="${color}"/>`;
        edif += `<path d="M${f(x + 3)} ${f(y + 14)}Q${f(x + w * 1.06)} ${f(y)} ${f(x + w - 2)} ${H}" fill="none" stroke="${canto}" stroke-width="2.4"/>`;
        ventanas(x + 4, y + 20, w - 16);
      } else {
        edif += `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${color}"/>`;
        edif += `<rect x="${f(x)}" y="${f(y)}" width="3" height="${f(h)}" fill="${canto}"/>`; // canto iluminado
        if (tipo === 'escalones') edif += `<rect x="${f(x + w * .15)}" y="${f(y - h * .1)}" width="${f(w * .7)}" height="${f(h * .1)}" fill="${color}"/><rect x="${f(x + w * .32)}" y="${f(y - h * .18)}" width="${f(w * .36)}" height="${f(h * .08)}" fill="${color}"/>`;
        if (tipo === 'punta') edif += `<path d="M${f(x)} ${f(y)}L${f(x + w / 2)} ${f(y - h * .16)}L${f(x + w)} ${f(y)}Z" fill="${color}"/>`;
        if (tipo === 'redondo') edif += `<path d="M${f(x)} ${f(y)}A${f(w / 2)} ${f(w * .35)} 0 0 1 ${f(x + w)} ${f(y)}Z" fill="${color}"/>`;
        if (tipo === 'antena') {
          edif += `<rect x="${f(x + w / 2 - 1)}" y="${f(y - 16)}" width="2" height="16" fill="${color}"/>`;
          luces += `<circle cx="${f(x + w / 2)}" cy="${f(y - 17)}" r="1.8" fill="#ff5a5a" class="titila"/>`;
        }
        ventanas(x, y, w);
      }
      x += w + 3 + az() * 16;
    }
    return envolver(H, '', `<g>${edif}</g><g>${luces}</g>`);
  };

  // Capa cercana: palmeras y faroles encendidos sobre la acera
  const capaCerca = () => {
    const H = 120, az = azarCon(5), c = '#050f29';
    const defs = '<radialGradient id="g-farol"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>';
    const palma = (x, h) => {
      const top = H - h, tx = x + 12;
      let s = `<path d="M${x} ${H}Q${f(x + 16)} ${f(H - h * .5)} ${tx} ${f(top)}" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      const hojas = [[-48, -4], [-36, 14], [-16, 24], [20, 22], [40, 12], [50, -4], [2, -22], [-26, -18], [28, -18]];
      for (const [dx, dy] of hojas) {
        s += `<path d="M${tx} ${f(top)}Q${f(tx + dx * .5)} ${f(top + dy - 14)} ${f(tx + dx)} ${f(top + dy)}Q${f(tx + dx * .55)} ${f(top + dy - 5)} ${tx} ${f(top)}Z" fill="${c}"/>`;
      }
      return s + `<circle cx="${tx}" cy="${f(top + 3)}" r="4.5" fill="#0b1a3d"/>`;
    };
    const farol = x => `<circle cx="${x + 18}" cy="${H - 90}" r="34" fill="url(#g-farol)"/>`
      + `<rect x="${x - 1.5}" y="${H - 96}" width="3" height="96" fill="${c}"/>`
      + `<path d="M${x} ${H - 94}q2-6 18-4" stroke="${c}" stroke-width="3" fill="none"/>`
      + `<rect x="${x + 12}" y="${H - 93}" width="13" height="4" rx="2" fill="#ffe9a8"/>`;
    let cuerpo = '';
    for (let x = 60; x < TRAMO - 60; x += 200) {
      if (az() > .3) cuerpo += palma(x, 78 + az() * 30);
      cuerpo += farol(x + 104);
    }
    return envolver(H, defs, cuerpo);
  };

  const capas = { 'capa-lejos': capaLejos, 'capa-medio': capaMedio, 'capa-cerca': capaCerca };
  for (const [id, dibujar] of Object.entries(capas)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = dibujar();
  }

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

  /* ---------- Tarjeta "Tu acarreo" de la portada ---------- */
  const seg = $('#seguimiento');
  const segEstado = $('#seguimiento-estado');
  if (seg && segEstado) {
    const estados = ['Cargando tus corotos', 'En camino a tu destino', '¡Entregado a tiempo!'];
    let paso = 0;
    const mostrar = (p, reinicio) => {
      segEstado.classList.add('cambiando');
      setTimeout(() => {
        seg.classList.toggle('reinicio', !!reinicio);
        seg.dataset.paso = p;
        segEstado.textContent = estados[p];
        segEstado.classList.remove('cambiando');
        if (reinicio) requestAnimationFrame(() => requestAnimationFrame(() => seg.classList.remove('reinicio')));
      }, 300);
    };
    if (sinMovimiento) {
      seg.dataset.paso = 1;
      segEstado.textContent = estados[1];
    } else {
      // arranca cuando la puerta ya subió; entregado se queda un poco más
      const ciclo = () => {
        paso = (paso + 1) % estados.length;
        mostrar(paso, paso === 0);
        setTimeout(ciclo, paso === 2 ? 3600 : 2600);
      };
      setTimeout(ciclo, 3200);
    }
  }

  /* ---------- Showroom de la flota: cada tarjeta muestra su camión ---------- */
  const garaje = $('#garaje');
  if (garaje) {
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
      // en celular el showroom queda arriba de las tarjetas: si no se ve, se lleva a la vista
      const r = garaje.getBoundingClientRect();
      if (r.top < 60 || r.bottom > innerHeight) {
        garaje.scrollIntoView({ behavior: sinMovimiento ? 'auto' : 'smooth', block: 'center' });
      }
    };
    botones.forEach(b => b.addEventListener('click', () => elegir(b.dataset.vehiculo, b)));
  }

  /* ---------- Carrusel de servicios en celular: puntitos ---------- */
  const carrusel = $('.servicios');
  const puntos = $('#puntos-servicios');
  if (carrusel && puntos) {
    const tarjetas = $$('.servicio', carrusel);
    tarjetas.forEach((t, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Servicio ${i + 1} de ${tarjetas.length}`);
      b.addEventListener('click', () => carrusel.scrollTo({ left: t.offsetLeft - carrusel.offsetLeft - 16, behavior: sinMovimiento ? 'auto' : 'smooth' }));
      puntos.appendChild(b);
    });
    const marcar = () => {
      const centro = carrusel.scrollLeft + carrusel.clientWidth * 0.35;
      let activo = 0;
      tarjetas.forEach((t, i) => { if (t.offsetLeft - carrusel.offsetLeft <= centro) activo = i; });
      if (carrusel.scrollLeft + carrusel.clientWidth >= carrusel.scrollWidth - 4) activo = tarjetas.length - 1;
      [...puntos.children].forEach((b, i) => b.classList.toggle('activo', i === activo));
    };
    carrusel.addEventListener('scroll', marcar, { passive: true });
    marcar();
  }

  /* ---------- Diccionario: las tarjetas se voltean al tocarlas ---------- */
  $$('.palabra').forEach(p => p.addEventListener('click', () => p.classList.toggle('volteada')));

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
  // los datos del edificio (piso, ascensor o escaleras) solo se piden si eligen "Edificio"
  const bloqueEdificio = $('#edificio');
  const verEdificio = () => { bloqueEdificio.hidden = form.elements.lugar.value !== 'Edificio'; };
  $$('input[name="lugar"]', form).forEach(r => r.addEventListener('change', verEdificio));
  verEdificio();
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
    let lugar = `🏠 Lugar: ${d.lugar}`;
    if (d.lugar === 'Edificio') {
      const piso = String(d.piso || '').trim();
      lugar += `${piso ? `, piso ${piso}` : ''} · ${d.acceso}`;
    }
    const lineas = [
      `Hola Acarreos Makena, soy ${d.nombre.trim()}.`,
      `Quiero cotizar: *${d.servicio}*`,
      `📍 Desde: ${d.desde.trim()}`,
      d.hasta.trim() && `🏁 Hasta: ${d.hasta.trim()}`,
      lugar,
      fecha && `📅 Fecha: ${fecha}`,
      d.detalles.trim() && `📝 Detalles: ${d.detalles.trim()}`,
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lineas.join('\n'))}`, '_blank', 'noopener');
  });
  $$('input', form).forEach(i => i.addEventListener('input', () => i.classList.remove('con-error')));

  /* ---------- Año del pie ---------- */
  $('#anio').textContent = new Date().getFullYear();
})();
