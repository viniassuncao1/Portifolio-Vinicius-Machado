import { RenderMode, ServerRoute } from '@angular/ssr';

import { SECOES_COM_ENDERECO_ANTIGO } from './app.routes';

export const serverRoutes: ServerRoute[] = [
  // Endereços antigos de página (`/skills/2`): só redirecionam, então não são pré-renderizados (e não
  // entram no sitemap). Na Vercel, o 301 do `vercel.json` responde antes; este é o plano B no navegador.
  ...SECOES_COM_ENDERECO_ANTIGO.map((slug): ServerRoute => ({
    path: `${slug}/:pagina`,
    renderMode: RenderMode.Client,
  })),
  // Detalhes de um projeto (`/projetos/ana`): abrem no navegador; a página que vai ao ar é a vitrine.
  { path: 'projetos/:slug', renderMode: RenderMode.Client },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
