# par-king · sitio web

Sitio de presentación de par-king, en HTML estático generado **sin dependencias** (solo Node ≥ 20). Español e inglés, con el
idioma elegido según el dispositivo.

## Páginas (por idioma)

| Archivo | Contenido |
|---|---|
| `index.html` | Inicio: propuesta para conductores, beneficios, resumen en 4 pasos y llamado a dueños. |
| `how-it-works.html` | **Reserva en segundos**: paso a paso interactivo con teléfono simulado, tiempos, "si necesitas más tiempo" y preguntas frecuentes. |
| `owners.html` | Para dueños: beneficios, cómo publicar y preguntas. |
| `about.html` | Misión, visión y valores. |

`dist/index.html` es la entrada: lee el idioma del dispositivo (`navigator.languages`), o el que la persona eligió antes, y
redirige a `/es/` o `/en/`. Un idioma que no tenga sitio cae en español. El selector ES/EN de la cabecera recuerda la elección.

## Uso

```bash
npm run build      # genera ./dist
npm run dev        # build + servidor local en http://127.0.0.1:4173
npm test           # 11 pruebas
SITE_URL=https://tu-dominio npm run build   # añade canonical, hreflang, sitemap.xml y robots.txt
```

`dist/` es una carpeta estática: se puede subir a cualquier hosting (S3, Netlify, Cloudflare Pages, Nginx…). Los enlaces son
relativos, así que funciona también en un subdirectorio o abriéndolo como archivo.

## Agregar un idioma

1. Copia `src/content/es.json` a `src/content/<código>.json` y tradúcelo (mismas claves y listas del mismo largo).
2. Añade el código a `SUPPORTED` en `src/lang.mjs` y al arreglo por defecto de `pickLanguage`.

Las pruebas fallan si falta una clave, una lista cambia de largo o un texto quedó sin traducir.

## Decisiones

- **Sin terceros:** ni fuentes, ni analítica, ni scripts externos (una prueba lo verifica). Es más rápido y no necesita aviso de cookies.
  Si más adelante se agrega analítica, habrá que añadir el aviso y revisarlo con la política de privacidad.
- **Accesible:** enlace para saltar al contenido, un solo `h1` por página, foco visible, menú y pestañas con teclado, respeta
  "reducir movimiento" y funciona sin JavaScript (el paso a paso queda como lista).
- **Honesto:** la app aún no está publicada, así que App Store y Google Play aparecen como "Próximamente", sin enlaces.
  No hay cifras, reseñas ni testimonios inventados.
- Cada afirmación del sitio (cancelación 15 min antes, confirmar antes de 15 min, mínimo 2 h en otro día, ampliar con
  alternativas, pago opcional con Mercado Pago) corresponde a lo que hace la app hoy.

## Por revisar antes de publicar

- **Misión, visión y valores** son un borrador mío: ajústalos a cómo quieren decirlo (`src/content/*.json` → `about`).
- **Condiciones comerciales para dueños:** el sitio no promete comisiones ni precios. Si se definen, agrégalos en `owners`.
- **Páginas legales** (términos y privacidad): el sitio no las enlaza porque los textos tienen marcas `[PENDIENTE…]`
  y falta la revisión de un abogado. Apple pedirá además una URL pública de la política de privacidad: este sitio es un buen lugar.
- **Contacto:** no hay correo ni teléfono de soporte (no hay uno definido).
- **Enlaces de las tiendas:** cuando la app se publique, reemplaza los `badge-store` por enlaces (`storeBadges` en `src/render.mjs`).
- Falta una imagen para compartir en redes (Open Graph); hoy usa solo título y descripción.
