import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PROJETOS } from '../../core/projetos';
import type { Projeto } from '../../core/projetos';
import { DetalhesDoProjeto } from './detalhes-do-projeto';

const COM_LINK_DE_SITE = PROJETOS.find((p) => p.link?.rotulo === 'Ver site')!;
const COM_REPOSITORIO = PROJETOS.find((p) => p.link?.rotulo === 'Ver repositório')!;
const SEM_LINK = PROJETOS.find((p) => !p.link)!;
const COM_DUAS_IMAGENS: Projeto = {
  ...COM_LINK_DE_SITE,
  imagens: [
    ...COM_LINK_DE_SITE.imagens,
    { ...COM_LINK_DE_SITE.imagens[0], src: 'projetos/outra.webp', alt: 'Segunda tela do projeto.' },
  ],
};

function montar(projeto: Projeto | null) {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
  const fixture = TestBed.createComponent(DetalhesDoProjeto);
  fixture.componentRef.setInput('projeto', projeto);
  fixture.detectChanges();
  const raiz = fixture.nativeElement as HTMLElement;
  return { fixture, raiz, dialogo: raiz.querySelector('dialog') as HTMLDialogElement };
}

describe('DetalhesDoProjeto', () => {
  it('fica fechado sem projeto', () => {
    const { dialogo } = montar(null);

    expect(dialogo.open).toBe(false);
    expect(dialogo.querySelector('.painel')).toBeNull();
  });

  it('abre com o projeto e fecha quando ele some', () => {
    const { fixture, dialogo } = montar(PROJETOS[0]);
    expect(dialogo.open).toBe(true);

    fixture.componentRef.setInput('projeto', null);
    fixture.detectChanges();

    expect(dialogo.open).toBe(false);
  });

  it('é um diálogo nomeado pelo título do projeto, com o contador', () => {
    const { raiz, dialogo } = montar(PROJETOS[4]);

    const titulo = raiz.querySelector('h2');
    expect(dialogo.getAttribute('aria-labelledby')).toBe(titulo?.id);
    expect(titulo?.textContent).toBe(PROJETOS[4].titulo);
    expect(raiz.querySelector('.contador')?.textContent).toBe('05 / 06');
  });

  it('o botão de fechar é o foco inicial e emite o fechamento', () => {
    const { fixture, raiz } = montar(PROJETOS[0]);
    const fechados: unknown[] = [];
    fixture.componentInstance.fechado.subscribe(() => fechados.push(true));
    const botao = raiz.querySelector<HTMLButtonElement>('.fechar')!;

    botao.click();

    expect(botao.hasAttribute('autofocus')).toBe(true);
    expect(fechados).toHaveLength(1);
  });

  it('o Esc não fecha na hora: pede o fechamento à vitrine, que anima', () => {
    const { fixture, dialogo } = montar(PROJETOS[0]);
    const fechados: unknown[] = [];
    fixture.componentInstance.fechado.subscribe(() => fechados.push(true));

    const evento = new Event('cancel', { cancelable: true });
    dialogo.dispatchEvent(evento);

    expect(evento.defaultPrevented).toBe(true);
    expect(fechados).toHaveLength(1);
  });

  it('as setas do teclado navegam entre projetos', () => {
    const { fixture, raiz } = montar(PROJETOS[0]);
    const passos: number[] = [];
    fixture.componentInstance.navegar.subscribe((passo) => passos.push(passo));

    raiz.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    raiz.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));

    expect(passos).toEqual([1, -1]);
  });

  it('os botões anterior e próximo emitem a navegação', () => {
    const { fixture, raiz } = montar(PROJETOS[0]);
    const passos: number[] = [];
    fixture.componentInstance.navegar.subscribe((passo) => passos.push(passo));

    const [anterior, proximo] = Array.from(
      raiz.querySelectorAll<HTMLButtonElement>('.navegacao button'),
    );
    anterior.click();
    proximo.click();

    expect(passos).toEqual([-1, 1]);
  });

  it('o link de site se chama "Ver site" e abre em nova aba com rel seguro', () => {
    const { raiz } = montar(COM_LINK_DE_SITE);

    const link = raiz.querySelector<HTMLAnchorElement>('a.principal-acao')!;
    expect(link.textContent).toContain('Ver site');
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
  });

  it('o link de repositório se chama "Ver repositório"', () => {
    const { raiz } = montar(COM_REPOSITORIO);

    expect(raiz.querySelector('a.principal-acao')?.textContent).toContain('Ver repositório');
  });

  it('sem endereço público não mostra o botão do site', () => {
    const { raiz } = montar(SEM_LINK);

    expect(raiz.querySelector('a.principal-acao')).toBeNull();
  });

  it('"Ver em código" leva ao arquivo Java do projeto', () => {
    const { raiz } = montar(PROJETOS[2]);

    const links = Array.from(raiz.querySelectorAll<HTMLAnchorElement>('.acoes a'));
    expect(links.at(-1)?.getAttribute('href')).toBe('/projeto-3');
    expect(links.at(-1)?.textContent).toContain('Ver em código');
  });

  it('sem captura mostra a capa em código', () => {
    const { raiz } = montar(SEM_LINK);

    expect(raiz.querySelector('.principal app-capa-em-codigo')).not.toBeNull();
  });

  it('com várias imagens mostra miniaturas e troca a principal', () => {
    const { fixture, raiz } = montar(COM_DUAS_IMAGENS);
    const miniaturas = Array.from(raiz.querySelectorAll<HTMLButtonElement>('.miniaturas button'));
    expect(miniaturas).toHaveLength(2);
    expect(miniaturas[0].getAttribute('aria-pressed')).toBe('true');

    miniaturas[1].click();
    fixture.detectChanges();

    expect(miniaturas[1].getAttribute('aria-pressed')).toBe('true');
    expect(raiz.querySelector('.foto')?.getAttribute('alt')).toBe('Segunda tela do projeto.');
  });

  it('com uma só imagem não mostra miniaturas', () => {
    const { raiz } = montar(COM_LINK_DE_SITE);

    expect(raiz.querySelector('.miniaturas')).toBeNull();
  });

  describe('abas dos detalhes', () => {
    const abasDe = (raiz: HTMLElement) =>
      Array.from(raiz.querySelectorAll<HTMLButtonElement>('[role="tab"]'));

    it('tem Visão geral, Código e Stack, com a primeira aberta', () => {
      const { raiz } = montar(PROJETOS[2]);

      expect(abasDe(raiz).map((a) => a.textContent?.trim())).toEqual([
        'Visão geral',
        'Código',
        'Stack',
      ]);
      expect(abasDe(raiz)[0].getAttribute('aria-selected')).toBe('true');
      expect(abasDe(raiz)[1].getAttribute('tabindex')).toBe('-1');
      expect(raiz.querySelector('[role="tabpanel"] .descricao')?.textContent).toContain(
        'CleanYourTV',
      );
    });

    it('o painel é rotulado pela aba aberta', () => {
      const { raiz } = montar(PROJETOS[2]);

      const painel = raiz.querySelector('[role="tabpanel"]')!;
      expect(painel.getAttribute('aria-labelledby')).toBe('aba-visao');
      expect(abasDe(raiz)[0].getAttribute('aria-controls')).toBe(painel.id);
    });

    it('a aba Código mostra o trecho em Java e o caminho para o arquivo completo', () => {
      const { fixture, raiz } = montar(PROJETOS[2]);

      abasDe(raiz)[1].click();
      fixture.detectChanges();

      expect(raiz.querySelector('.trecho')?.textContent).toContain('LauncherDeTv');
      expect(raiz.querySelector('.painel-da-aba a')?.getAttribute('href')).toBe('/projeto-3');
    });

    it('a aba Stack mostra o papel, as tecnologias e os destaques como um build', () => {
      const { fixture, raiz } = montar(PROJETOS[2]);

      abasDe(raiz)[2].click();
      fixture.detectChanges();

      const build = raiz.querySelector('.build')?.textContent ?? '';
      expect(build).toContain(PROJETOS[2].papel);
      for (const etiqueta of PROJETOS[2].etiquetas) expect(build).toContain(etiqueta);
      expect(build).toContain('BUILD SUCCESSFUL');
    });

    it('as setas movem entre as abas e não trocam de projeto', () => {
      const { fixture, raiz } = montar(PROJETOS[2]);
      const navegacoes: number[] = [];
      fixture.componentInstance.navegar.subscribe((passo) => navegacoes.push(passo));

      abasDe(raiz)[0].dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
      );
      fixture.detectChanges();

      expect(abasDe(raiz)[1].getAttribute('aria-selected')).toBe('true');
      expect(navegacoes).toEqual([]);
    });

    it('volta à Visão geral ao trocar de projeto', () => {
      const { fixture, raiz } = montar(PROJETOS[2]);
      abasDe(raiz)[2].click();
      fixture.detectChanges();

      fixture.componentRef.setInput('projeto', PROJETOS[3]);
      fixture.detectChanges();

      expect(abasDe(raiz)[0].getAttribute('aria-selected')).toBe('true');
    });
  });
});
