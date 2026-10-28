# Sitio: Rambután por tonelada desde Tuxtla Chico

Sitio estático (HTML, CSS y JavaScript sin dependencias) para conectar con compradores mayoristas de
rambután en todo México. Se abre directo con `index.html`.

## Antes de publicar

1. **Tu número de WhatsApp.** En `app.js`, línea `const WHATSAPP = '';`, escribe tu número con lada
   de país, solo dígitos. Ejemplo para un celular de Tapachula: `'5219621234567'`.
   Mientras esté vacío, los botones abren WhatsApp con el mensaje listo y dejan elegir el contacto.
2. **Contenido de muestra que debes confirmar** (está escrito para que el diseño se vea completo):
   - Temporada "julio a octubre, con pico en agosto y septiembre".
   - Pedido mínimo de 1 tonelada y caja de 10 kg (también en `KG_POR_CAJA` de `app.js`).
   - Rambután amarillo y la separación por calibres (pestañas de "La fruta").
   - Respuestas de preguntas frecuentes: muestra por paquetería, forma de pago, vida de anaquel.
   - Atención "lunes a sábado" y la firma "La familia productora".
   - Distancias por carretera en `CIUDADES` (`app.js`): son aproximadas, ajústalas con tu transportista.
3. **Fotos.** Las imágenes son ilustraciones hechas en código. Fotos reales de tu huerta, la cosecha,
   las cajas y el camión cargando harán el sitio mucho más creíble. Los lugares para cambiarlas:
   el fondo del inicio (`.hero__art`), el cuadro de "La fruta" (`.plate__pic`) y las dos imágenes de
   preguntas (`.faq__tall`, `.faq__square`).

## Publicarlo gratis

- **GitHub Pages:** copia estos archivos a la raíz de un repositorio propio (por ejemplo
  `rambutan-chiapas`) y en Settings → Pages elige la rama `main` y la carpeta `/ (root)`.
  GitHub Pages solo publica la raíz o una carpeta `/docs`, no `sitio-rambutan`.
- **Vercel o Netlify:** importa el repositorio y pon `sitio-rambutan` como carpeta raíz, sin comando
  de compilación.

## Archivos

- `index.html`: estructura y textos.
- `styles.css`: diseño (tres tintas: verde hoja, oro y rojo rambután).
- `app.js`: guía de embarque, pestañas, cupón que arma el mensaje de WhatsApp y animaciones de entrada.
