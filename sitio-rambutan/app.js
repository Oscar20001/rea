// Rambután de Tuxtla Chico: guía de embarque, pestañas de la fruta, cupón a WhatsApp y entradas.

// Número de WhatsApp con lada de país, solo dígitos (ejemplo: 5219621234567).
// Mientras esté vacío, WhatsApp abre el mensaje listo y deja elegir a quién mandarlo.
const WHATSAPP = '';

// Distancias aproximadas por carretera desde Tuxtla Chico, Chiapas.
const CIUDADES = [
  ['Monterrey, N.L.', 'Monterrey', 1900],
  ['Saltillo, Coah.', 'Saltillo', 1980],
  ['Reynosa, Tamps.', 'Reynosa', 1850],
  ['Nuevo Laredo, Tamps.', 'Nuevo Laredo', 2120],
  ['Torreón, Coah.', 'Torreón', 2150],
  ['Chihuahua, Chih.', 'Chihuahua', 2600],
  ['Ciudad Juárez, Chih.', 'Ciudad Juárez', 2950],
  ['Hermosillo, Son.', 'Hermosillo', 3050],
  ['Culiacán, Sin.', 'Culiacán', 2400],
  ['Mexicali, B.C.', 'Mexicali', 3750],
  ['Tijuana, B.C.', 'Tijuana', 3900],
  ['San Luis Potosí, S.L.P.', 'San Luis Potosí', 1560],
  ['Guadalajara, Jal.', 'Guadalajara', 1650],
  ['León, Gto.', 'León', 1530],
  ['Querétaro, Qro.', 'Querétaro', 1350],
  ['Ciudad de México', 'la Ciudad de México', 1150],
  ['Puebla, Pue.', 'Puebla', 1030],
  ['Veracruz, Ver.', 'Veracruz', 850],
  ['Mérida, Yuc.', 'Mérida', 1250],
];

const KG_POR_CAJA = 10;
const KM_POR_HORA = 55; // promedio de un camión con paradas

const fmt = new Intl.NumberFormat('es-MX');
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function waLink(text) {
  const base = WHATSAPP ? `https://wa.me/${WHATSAPP}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(text)}`;
}

// Un enlace real abre WhatsApp en otra pestaña (o la app en el celular) sin que lo bloqueen.
function openWhatsApp(text) {
  const a = document.createElement('a');
  a.href = waLink(text);
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.append(a);
  a.click();
  a.remove();
}

// ---------- guía de embarque ----------
const guia = (() => {
  const select = $('#ciudad');
  const input = $('#toneladas');
  const slip = $('.slip');
  if (!select || !input || !slip) return null;

  CIUDADES.forEach(([nombre], i) => select.add(new Option(nombre, String(i))));
  select.value = '0';

  const out = (key, value) => $$(`[data-out="${key}"]`, slip).forEach((el) => { el.textContent = value; });

  function toneladas() {
    const n = Math.round(Number(input.value));
    return Number.isFinite(n) ? Math.min(60, Math.max(1, n)) : 1;
  }

  function vehiculo(t) {
    if (t <= 3) return ['camioneta refrigerada', 1];
    if (t <= 10) return ['torton refrigerado', 1];
    const n = Math.ceil(t / 22);
    return [n === 1 ? 'tráiler refrigerado de 53 pies' : 'tráileres refrigerados de 53 pies', n];
  }

  function datos() {
    const [nombre, corta, km] = CIUDADES[Number(select.value)] || CIUDADES[0];
    const t = toneladas();
    const horas = Math.round(km / KM_POR_HORA);
    // corte, empaque y pre-enfriado ocupan el primer día; luego el camino
    const dias = Math.ceil((horas + 12) / 24);
    const [veh, unidades] = vehiculo(t);
    return { nombre, corta, km, t, horas, dias, veh, unidades, cajas: (t * 1000) / KG_POR_CAJA };
  }

  function pintar() {
    const d = datos();
    out('ciudad', d.nombre);
    out('ciudad-corta', d.corta === 'la Ciudad de México' ? 'CDMX' : d.corta);
    out('cajas', `${fmt.format(d.cajas)} cajas`);
    out('vehiculo', d.veh);
    out('unidades', d.unidades === 1 ? '1 unidad' : `${d.unidades} unidades`);
    out('km', `${fmt.format(d.km)} km`);
    out('horas', `${d.horas} h`);
    out('dias', `en ${d.dias} a ${d.dias + 1} días`);
  }

  function mensaje() {
    const d = datos();
    return `Hola, quiero cotizar rambután con entrega en ${d.nombre}: ${d.t} ${d.t === 1 ? 'tonelada' : 'toneladas'} (${fmt.format(d.cajas)} cajas de ${KG_POR_CAJA} kg). ¿Qué precio por kilo tienen esta semana y cuándo podrían cortar?`;
  }

  let timer;
  function cambio() {
    slip.classList.add('is-updating');
    clearTimeout(timer);
    timer = setTimeout(() => { pintar(); slip.classList.remove('is-updating'); }, 120);
  }

  select.addEventListener('change', cambio);
  input.addEventListener('input', () => { if (input.value !== '') cambio(); });
  input.addEventListener('blur', () => { input.value = String(toneladas()); cambio(); });
  $$('.calc__step').forEach((btn) => btn.addEventListener('click', () => {
    input.value = String(Math.min(60, Math.max(1, toneladas() + Number(btn.dataset.step))));
    cambio();
  }));

  pintar();
  return { mensaje };
})();

// ---------- botones de WhatsApp ----------
const MENSAJES = {
  hero: 'Hola, me interesa comprar rambután por tonelada. ¿Me pueden mandar el precio de esta semana?',
  carta: 'Hola, vi su sitio y me interesa comprar rambután de Tuxtla Chico. ¿Me pueden dar informes?',
  fruta: () => `Hola, me interesa el ${$('#t-fruta')?.textContent.toLowerCase() || 'rambután'}. ¿Qué disponibilidad y precio tienen?`,
  precio: 'Hola, ¿me pueden pasar el precio por kilo de esta semana para un pedido mayorista de rambután?',
  faq: 'Hola, tengo una pregunta sobre su rambután:',
  guia: () => (guia ? guia.mensaje() : MENSAJES.hero),
};

$$('[data-wa]').forEach((a) => {
  a.addEventListener('click', () => {
    const m = MENSAJES[a.dataset.wa];
    const text = typeof m === 'function' ? m() : m;
    if (!text) return; // sin mensaje, el enlace baja al cupón
    // el enlace se vuelve el de WhatsApp justo al tocarlo, con el mensaje del momento
    a.href = waLink(text);
    a.target = '_blank';
    a.rel = 'noopener';
  });
});

// ---------- pestañas de la fruta ----------
(() => {
  const plate = $('.plate');
  const tabs = $$('.tabs [role="tab"]');
  if (!plate || !tabs.length) return;
  const copy = {
    rojo: ['Rambután rojo', 'El que más pide el mercado: cáscara roja intensa y pulpa blanca, jugosa y dulce.'],
    amarillo: ['Rambután amarillo', 'Cáscara dorada, igual de dulce y más escaso. Destaca en el anaquel de cualquier frutería.'],
    calibre: ['Por calibre', 'Cada caja va pareja: grande para exhibir, mediano para venta por kilo y chico para pulpa.'],
  };
  const panel = $('#panel-fruta');
  const title = $('#t-fruta');
  const text = $('[data-copy]', panel);

  function select(tab, focus) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    const key = tab.dataset.tab;
    plate.dataset.variant = key;
    panel.setAttribute('aria-labelledby', tab.id);
    [title.textContent, text.textContent] = copy[key];
    if (focus) tab.focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
})();

// ---------- cupón ----------
(() => {
  const form = $('#coupon');
  if (!form) return;
  const error = $('#coupon-error');
  const required = [$('#f-nombre'), $('#f-ciudad')];

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const missing = required.filter((f) => !f.value.trim());
    required.forEach((f) => f.setAttribute('aria-invalid', String(missing.includes(f))));
    if (missing.length) {
      error.hidden = false;
      missing[0].focus();
      return;
    }
    error.hidden = true;
    const v = (id) => $(id).value.trim();
    const lineas = [
      'Hola, quiero una cotización de rambután.',
      `Nombre y empresa: ${v('#f-nombre')}`,
      `Ciudad de entrega: ${v('#f-ciudad')}`,
      v('#f-ton') && `Toneladas por semana: ${v('#f-ton')}`,
      v('#f-tel') && `Teléfono: ${v('#f-tel')}`,
    ].filter(Boolean);
    openWhatsApp(lineas.join('\n'));
  });

  required.forEach((f) => f.addEventListener('input', () => {
    if (f.value.trim()) f.setAttribute('aria-invalid', 'false');
    if (required.every((r) => r.value.trim())) error.hidden = true;
  }));
})();

// ---------- muescas del boleto y del cupón en celular ----------
(() => {
  // la muesca va donde se juntan las dos partes, sea cual sea el orden en pantalla
  const pairs = [['.ticket', '--stub-y'], ['.coupon', '--cut-y']];
  function place() {
    pairs.forEach(([box, prop]) => {
      const b = $(box);
      if (!b) return;
      const parts = [...b.children].filter((c) => c.tagName === 'DIV');
      const y = Math.max(...parts.map((c) => c.offsetTop));
      b.style.setProperty(prop, `${y}px`);
    });
  }
  place();
  window.addEventListener('resize', place, { passive: true });
  document.fonts?.ready.then(place);
})();

// ---------- entradas al hacer scroll (nunca dejan contenido oculto) ----------
(() => {
  const targets = $$('[data-reveal]');
  if (!targets.length) return;
  const show = (el) => el.classList.add('is-in');
  if (!('IntersectionObserver' in window)) { targets.forEach(show); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      show(entry.target);
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
  targets.forEach((el) => io.observe(el));
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) show(el); });
  }, 2000));
})();

$$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
