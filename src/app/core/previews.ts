/** Captura de página inteira de um site, guardada em `public/projetos/`. */
export interface CapturaDePreview {
  /** Caminho relativo ao `base href`, como o dos ícones. */
  readonly src: string;
  readonly largura: number;
  readonly altura: number;
  /** Descreve o site para quem não vê a imagem. */
  readonly alt: string;
}

/** Site de um projeto que pode ser aberto na janela de preview. */
export interface PreviewDeProjeto {
  readonly titulo: string;
  readonly url: string;
  readonly captura: CapturaDePreview;
}

/**
 * Projetos com site no ar, por slug da seção. Só estes mostram o botão "Executar".
 * As capturas são geradas por `scripts/capturar-previews.mjs`.
 */
export const PREVIEWS: Readonly<Record<string, PreviewDeProjeto>> = {
  'projeto-2': {
    titulo: 'Dra. Juliana Maluhy',
    url: 'https://www.drajulianamaluhy.com/',
    captura: {
      src: 'projetos/dra-juliana.jpg',
      largura: 1440,
      altura: 8251,
      alt: 'Landing page da fisioterapeuta Dra. Juliana Maluhy, com fundo claro, as especialidades, os convênios, os depoimentos e o botão para o WhatsApp.',
    },
  },
  'projeto-3': {
    titulo: 'Watts Company',
    url: 'https://wattscompany.com.br/',
    captura: {
      src: 'projetos/watts-company.jpg',
      largura: 1440,
      altura: 8517,
      alt: 'Landing page da Watts Company, com fundo escuro e detalhes em verde, a proposta "Automatize. Escale. Domine." e o botão de diagnóstico gratuito.',
    },
  },
};
