import { DestroyRef, DOCUMENT, Service, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { EstrategiaDeTitulo } from './estrategia-de-titulo';
import { SECOES } from './secoes';

/** Domínio público: o único lugar a trocar quando o site ganhar um domínio próprio. */
export const URL_DO_SITE = 'https://portfolio-vinicius-machado.vercel.app';

export const DESCRICAO_DO_INICIO =
  'Vinicius Machado, desenvolvedor Full Stack em Java, Spring Boot, Angular e SQL. Veja projetos, experiências e certificações.';

export const IMAGEM_DE_COMPARTILHAMENTO = `${URL_DO_SITE}/compartilhamento/portfolio.png`;
const LARGURA_DA_IMAGEM = '1200';
const ALTURA_DA_IMAGEM = '630';
const TEXTO_ALTERNATIVO_DA_IMAGEM =
  'Portfólio de Vinicius Machado, desenvolvedor Full Stack, numa janela de IDE escura.';
const NOME_DO_SITE = 'Vinicius Machado';
const ID_DO_JSON_LD = 'dados-estruturados-pessoa';

export const DADOS_DA_PESSOA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vinicius Machado',
  jobTitle: 'Desenvolvedor Full Stack',
  url: URL_DO_SITE,
  sameAs: ['https://www.linkedin.com/in/viniassuncao', 'https://github.com/viniassuncao1'],
  knowsAbout: ['Java', 'Spring Boot', 'Angular', 'SQL'],
} as const;

/** Descrição da rota: a da seção (inclusive nas páginas internas) ou a do Início. */
export function descricaoDaRota(caminho: string): string {
  const slug = caminho.split('/').find(Boolean);
  const secao = SECOES.find((s) => s.slug === slug);
  return secao?.descricao ?? DESCRICAO_DO_INICIO;
}

/**
 * Metadados de busca e de compartilhamento: a cada navegação escreve descrição, endereço canônico,
 * Open Graph e Twitter/X (que o pré-render leva para o HTML) e o JSON-LD `Person` só no Início.
 */
@Service()
export class Seo {
  private readonly meta = inject(Meta);
  private readonly titulos = inject(EstrategiaDeTitulo);
  private readonly router = inject(Router);
  private readonly documento = inject(DOCUMENT);

  constructor() {
    this.router.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(({ urlAfterRedirects }) => this.atualizar(urlAfterRedirects));
  }

  private atualizar(url: string): void {
    const caminho = url.split(/[?#]/)[0];
    const endereco = `${URL_DO_SITE}${caminho}`;
    const titulo = this.titulos.tituloDaJanela(this.router.routerState.snapshot);
    const descricao = descricaoDaRota(caminho);

    const propriedades: Record<string, string> = {
      'og:title': titulo,
      'og:description': descricao,
      'og:url': endereco,
      'og:image': IMAGEM_DE_COMPARTILHAMENTO,
      'og:image:width': LARGURA_DA_IMAGEM,
      'og:image:height': ALTURA_DA_IMAGEM,
      'og:image:alt': TEXTO_ALTERNATIVO_DA_IMAGEM,
      'og:type': 'website',
      'og:locale': 'pt_BR',
      'og:site_name': NOME_DO_SITE,
    };
    const nomes: Record<string, string> = {
      description: descricao,
      'twitter:card': 'summary_large_image',
      'twitter:title': titulo,
      'twitter:description': descricao,
      'twitter:image': IMAGEM_DE_COMPARTILHAMENTO,
    };
    for (const [property, content] of Object.entries(propriedades)) {
      this.meta.updateTag({ property, content });
    }
    for (const [name, content] of Object.entries(nomes)) {
      this.meta.updateTag({ name, content });
    }
    this.escreverCanonico(endereco);
    this.escreverDadosEstruturados(caminho === '/');
  }

  private escreverCanonico(endereco: string): void {
    let link = this.documento.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.documento.createElement('link');
      link.rel = 'canonical';
      this.documento.head.appendChild(link);
    }
    link.href = endereco;
  }

  private escreverDadosEstruturados(noInicio: boolean): void {
    const existente = this.documento.getElementById(ID_DO_JSON_LD);
    if (!noInicio) {
      existente?.remove();
      return;
    }
    if (existente) return;
    const script = this.documento.createElement('script');
    script.id = ID_DO_JSON_LD;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(DADOS_DA_PESSOA);
    this.documento.head.appendChild(script);
  }
}
