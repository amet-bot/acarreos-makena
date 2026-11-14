/**
 * Acarreos Makena — CRM y reseñas en Google Sheets
 *
 * Cómo instalarlo (una sola vez):
 *  1. Crea una hoja de cálculo de Google nueva.
 *  2. Menú Extensiones → Apps Script. Borra lo que haya y pega este archivo completo.
 *  3. Arriba elige la función «configurar» y toca ▶ Ejecutar. Acepta los permisos.
 *     Esto crea las pestañas Cotizaciones, Reseñas y Resumen con sus menús y colores.
 *  4. Implementar → Nueva implementación → tipo «Aplicación web».
 *     Ejecutar como: «Yo». Quién tiene acceso: «Cualquier usuario».
 *  5. Copia la URL que termina en /exec y ponla en js/main.js (CRM_URL).
 *
 * Si después cambias este código: Implementar → Administrar implementaciones →
 * editar (lápiz) → Versión: «Nueva versión». La URL sigue siendo la misma.
 */

const HOJA_COTIZACIONES = 'Cotizaciones';
const HOJA_RESENAS = 'Reseñas';
const HOJA_RESUMEN = 'Resumen';

const COLUMNAS_COTIZACIONES = ['Fecha', 'Nombre', 'Teléfono', 'Servicio', 'Desde', 'Hasta', 'Lugar', 'Fecha del servicio', 'Detalles', 'Página', 'Estado', 'Precio cotizado (B/.)', 'Notas'];
const COLUMNAS_RESENAS = ['Fecha', 'Nombre', 'Estrellas', 'Comentario', 'Servicio', 'Aprobado'];
const ESTADOS = ['Nuevo', 'Contactado', 'Cotizado', 'Agendado', 'Ganado', 'Perdido'];
const SERVICIOS = ['Mudanza', 'Escombros / basura', 'Retiro de facturas', 'Mercancías', 'Maquinaria', 'Embalaje / frágiles', 'Montaje', 'Otro'];

/* ---------------- Página web → hoja ---------------- */

function doPost(e) {
  const p = (e && e.parameter) || {};
  // trampa para robots: el campo «web» está escondido en la página; una persona nunca lo llena
  if (p.web) return respuesta({ ok: true });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const libro = SpreadsheetApp.getActiveSpreadsheet();
    if (p.tipo === 'cotizacion') {
      if (!limpiar(p.nombre, 80)) return respuesta({ ok: false, error: 'falta nombre' });
      libro.getSheetByName(HOJA_COTIZACIONES).appendRow([
        new Date(), limpiar(p.nombre, 80), limpiar(p.telefono, 30), limpiar(p.servicio, 40),
        limpiar(p.desde, 200), limpiar(p.hasta, 200), limpiar(p.lugar, 120), limpiar(p.fecha, 20),
        limpiar(p.detalles, 1000), limpiar(p.pagina, 120), 'Nuevo', '', '',
      ]);
      return respuesta({ ok: true });
    }
    if (p.tipo === 'resena') {
      const estrellas = Math.round(Number(p.estrellas));
      if (!(estrellas >= 1 && estrellas <= 5)) return respuesta({ ok: false, error: 'estrellas' });
      if (!limpiar(p.nombre, 60)) return respuesta({ ok: false, error: 'falta nombre' });
      libro.getSheetByName(HOJA_RESENAS).appendRow([
        new Date(), limpiar(p.nombre, 60), estrellas, limpiar(p.comentario, 800), limpiar(p.servicio, 40), 'NO',
      ]);
      return respuesta({ ok: true });
    }
    return respuesta({ ok: false, error: 'tipo' });
  } finally {
    lock.releaseLock();
  }
}

/* ---------------- Hoja → página web (solo reseñas aprobadas) ---------------- */

function doGet() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_RESENAS);
  const filas = hoja.getLastRow() > 1 ? hoja.getRange(2, 1, hoja.getLastRow() - 1, COLUMNAS_RESENAS.length).getValues() : [];
  const aprobadas = filas
    .filter(f => String(f[5]).trim().toUpperCase().replace('SI', 'SÍ') === 'SÍ' && Number(f[2]) >= 1)
    .map(f => ({
      fecha: f[0] instanceof Date ? Utilities.formatDate(f[0], 'America/Panama', 'yyyy-MM-dd') : '',
      nombre: soloNombre(String(f[1])),
      estrellas: Number(f[2]),
      comentario: String(f[3]),
      servicio: String(f[4]),
    }))
    .reverse(); // las más nuevas primero
  const total = aprobadas.length;
  const promedio = total ? Math.round(aprobadas.reduce((s, r) => s + r.estrellas, 0) / total * 10) / 10 : 0;
  return respuesta({ ok: true, total, promedio, resenas: aprobadas.slice(0, 30) });
}

/* ---------------- Ayudantes ---------------- */

function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// recorta, quita saltos raros y evita que un texto que empiece con = + - @ se ejecute como fórmula
function limpiar(valor, max) {
  let t = String(valor || '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
  if (/^[=+\-@]/.test(t)) t = "'" + t;
  return t;
}

// en la página se muestra «Juan P.» en vez del nombre completo
function soloNombre(nombre) {
  const partes = nombre.replace(/^'/, '').trim().split(/\s+/);
  return partes.length > 1 ? `${partes[0]} ${partes[1].charAt(0).toUpperCase()}.` : partes[0];
}

/* ---------------- Configuración inicial (ejecutar una vez) ---------------- */

function configurar() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  libro.setSpreadsheetTimeZone('America/Panama');

  // Cotizaciones
  const cot = libro.getSheetByName(HOJA_COTIZACIONES) || libro.insertSheet(HOJA_COTIZACIONES, 0);
  encabezado(cot, COLUMNAS_COTIZACIONES, '#0a2a6e');
  cot.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
  cot.getRange('L:L').setNumberFormat('"B/." #,##0.00');
  cot.getRange('K2:K').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).setAllowInvalid(false).build());
  const colores = { Nuevo: '#fff4c2', Contactado: '#dbe8ff', Cotizado: '#e7dcff', Agendado: '#d2f1ff', Ganado: '#c9f2d0', Perdido: '#f5d0d0' };
  const rangoEstado = cot.getRange('K2:K');
  cot.setConditionalFormatRules(Object.keys(colores).map(est =>
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(est).setBackground(colores[est]).setRanges([rangoEstado]).build()));
  [150, 160, 110, 150, 220, 220, 170, 120, 320, 140, 110, 140, 260].forEach((w, i) => cot.setColumnWidth(i + 1, w));

  // Reseñas
  const res = libro.getSheetByName(HOJA_RESENAS) || libro.insertSheet(HOJA_RESENAS, 1);
  encabezado(res, COLUMNAS_RESENAS, '#f0a800');
  res.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
  res.getRange('F2:F').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['SÍ', 'NO'], true).setAllowInvalid(false).build());
  const rangoAprob = res.getRange('F2:F');
  res.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('SÍ').setBackground('#c9f2d0').setRanges([rangoAprob]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('NO').setBackground('#eeeeee').setRanges([rangoAprob]).build(),
  ]);
  [150, 160, 90, 420, 150, 100].forEach((w, i) => res.setColumnWidth(i + 1, w));

  // Resumen
  const sum = libro.getSheetByName(HOJA_RESUMEN) || libro.insertSheet(HOJA_RESUMEN, 2);
  sum.clear();
  const C = `'${HOJA_COTIZACIONES}'`, R = `'${HOJA_RESENAS}'`;
  const filas = [
    ['Clientes por estado', ''],
    ...ESTADOS.map(est => [est, `=COUNTIF(${C}!K:K;"${est}")`]),
    ['Total de solicitudes', `=COUNTA(${C}!B2:B)`],
    ['Solicitudes este mes', `=COUNTIFS(${C}!A2:A;">="&EOMONTH(TODAY();-1)+1)`],
    ['Ganado (B/.)', `=SUMIF(${C}!K:K;"Ganado";${C}!L:L)`],
    ['Cierre (ganados / total)', `=IFERROR(COUNTIF(${C}!K:K;"Ganado")/COUNTA(${C}!B2:B);0)`],
    ['', ''],
    ['Solicitudes por servicio', ''],
    ...SERVICIOS.map(s => [s, `=COUNTIF(${C}!D:D;"${s}")`]),
    ['', ''],
    ['Reseñas', ''],
    ['Promedio de estrellas (aprobadas)', `=IFERROR(AVERAGEIF(${R}!F:F;"SÍ";${R}!C:C);0)`],
    ['Reseñas aprobadas', `=COUNTIF(${R}!F:F;"SÍ")`],
    ['Reseñas por revisar', `=COUNTIF(${R}!F:F;"NO")`],
  ];
  // las fórmulas en Sheets en español usan «;»; setFormula acepta la sintaxis en inglés con «,»
  filas.forEach((f, i) => {
    sum.getRange(i + 1, 1).setValue(f[0]);
    if (String(f[1]).startsWith('=')) sum.getRange(i + 1, 2).setFormula(f[1].replace(/;/g, ','));
  });
  [1, 2 + ESTADOS.length + 5, 2 + ESTADOS.length + 7 + SERVICIOS.length].forEach(r =>
    sum.getRange(r, 1, 1, 2).setFontWeight('bold').setBackground('#0a2a6e').setFontColor('#ffffff'));
  sum.getRange(2 + ESTADOS.length + 2, 2).setNumberFormat('"B/." #,##0.00');
  sum.getRange(2 + ESTADOS.length + 3, 2).setNumberFormat('0%');
  sum.getRange(filas.length - 2, 2).setNumberFormat('0.0');
  sum.setColumnWidth(1, 260);
  sum.setColumnWidth(2, 140);

  const sobra = libro.getSheetByName('Hoja 1') || libro.getSheetByName('Sheet1');
  if (sobra && libro.getSheets().length > 3) libro.deleteSheet(sobra);
}

function encabezado(hoja, columnas, color) {
  hoja.getRange(1, 1, 1, columnas.length).setValues([columnas])
    .setFontWeight('bold').setBackground(color).setFontColor('#ffffff');
  hoja.setFrozenRows(1);
}
