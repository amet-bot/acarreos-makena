# Acarreos Makena — página web

Sitio de presentación de **Acarreos Makena** (mudanzas, caliche y escombros, retiro de basura, distribución de mercancías, montaje de eventos y embalaje en todo Panamá).

Es una página estática: HTML, CSS y JavaScript sin dependencias ni paso de compilación.

**Publicada en:** https://amet-bot.github.io/acarreos-makena/ (GitHub Pages desde `main`; cada push a `main` la actualiza en uno o dos minutos).

## Verla en la computadora

```bash
python -m http.server 8790
```

y abrir http://localhost:8790.

## Estructura

- `index.html` — todo el contenido de la página.
- `css/estilos.css` — estilos y animaciones (colores en `:root`).
- `js/main.js` — menú, animaciones al hacer scroll, videos y el formulario que arma el mensaje de WhatsApp.
- `img/` — foto del camión (recortada del volante), volante original y favicon.
- `media/` — videos y fotos tomados del Instagram @acarreosmakenapty (comprimidos para la web, sin audio).

## Datos de contacto usados

- WhatsApp principal: 6452-5086 (el que aparece en las publicaciones recientes); segundo número: 6997-1253.
- Instagram: @acarreosmakenapty.

Para cambiar el número de WhatsApp del formulario, edita `WHATSAPP` en `js/main.js` y los enlaces `wa.me` de `index.html`.
