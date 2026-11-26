#!/usr/bin/env node
// Genera el sitio estático en ./dist sin dependencias: una carpeta por idioma + una página de entrada que
// redirige según el idioma del dispositivo.
//   SITE_URL=https://par-king.example npm run build   → añade canonical, hreflang y sitemap.xml
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FALLBACK, pickLanguage } from './src/lang.mjs';
import { PAGES, renderPage, renderRoot } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));

export function build({ outDir = join(root, 'dist'), siteUrl = (process.env.SITE_URL ?? '').replace(/\/+$/, ''), year } = {}) {
  const contentDir = join(root, 'src', 'content');
  const content = Object.fromEntries(
    readdirSync(contentDir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => [f.replace(/\.json$/, ''), JSON.parse(readFileSync(join(contentDir, f), 'utf8'))]),
  );
  // Español primero (idioma por defecto), después el resto por código.
  const codes = Object.keys(content).sort((a, b) => (a === FALLBACK ? -1 : b === FALLBACK ? 1 : a.localeCompare(b)));
  const languages = codes.map((code) => content[code].lang);

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(join(outDir, 'assets'), { recursive: true });
  cpSync(join(root, 'src', 'assets'), join(outDir, 'assets'), { recursive: true });

  const written = [];
  for (const lang of codes) {
    mkdirSync(join(outDir, lang), { recursive: true });
    for (const { key, file } of PAGES) {
      writeFileSync(join(outDir, lang, file), renderPage({ content, lang, pageKey: key, languages, siteUrl, year }));
      written.push(`${lang}/${file}`);
    }
  }
  writeFileSync(
    join(outDir, 'index.html'),
    renderRoot({ languages, pickLanguageSource: pickLanguage.toString(), fallback: FALLBACK, siteUrl }),
  );
  written.push('index.html');

  if (siteUrl) {
    const urls = written.filter((f) => f !== 'index.html').map((f) => `  <url><loc>${siteUrl}/${f}</loc></url>`);
    writeFileSync(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
    writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`);
  }
  return { outDir, languages: codes, files: written };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const result = build();
  console.log(`✔ ${result.files.length} páginas en ${result.languages.join(', ')} → ${result.outDir}`);
}
