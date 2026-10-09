import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { EstrategiaDeTitulo } from '../../core/estrategia-de-titulo';
import { SECOES } from '../../core/secoes';
import { SecaoEmConstrucao } from '../../shared/secao-em-construcao/secao-em-construcao';
import { Casca } from './casca';

describe('Gaveta de seções (telas pequenas)', () => {
  let raiz: HTMLElement;
  let estilo: HTMLStyleElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: '',
            component: Casca,
            children: SECOES.map((secao) => ({
              path: secao.slug,
              title: secao.titulo,
              component: SecaoEmConstrucao,
            })),
          },
        ]),
        { provide: TitleStrategy, useExisting: EstrategiaDeTitulo },
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/${SECOES[0].slug}`);
    raiz = harness.routeNativeElement as HTMLElement;
    document.body.append(raiz);
    // O navegador de teste é largo: força o botão a aparecer, como abaixo de 768px.
    estilo = document.createElement('style');
    estilo.textContent = '.barra-gaveta { display: flex !important; }';
    document.head.append(estilo);
  });

  afterEach(() => {
    raiz.remove();
    estilo.remove();
  });

  const botao = () => raiz.querySelector<HTMLButtonElement>('.botao-secoes')!;
  const painel = () => raiz.querySelector<HTMLElement>('app-painel-lateral')!;

  async function estabilizar(): Promise<void> {
    TestBed.tick();
    await new Promise((resolver) => setTimeout(resolver));
  }

  it('começa fechada, com aria-expanded=false e aria-controls apontando o painel', () => {
    expect(botao().getAttribute('aria-expanded')).toBe('false');
    expect(botao().getAttribute('aria-controls')).toBe(painel().id);
    expect(painel().getAttribute('data-aberta')).toBe('false');
  });

  it('abre ao clicar no botão e leva o foco ao primeiro item', async () => {
    botao().click();
    await estabilizar();

    expect(botao().getAttribute('aria-expanded')).toBe('true');
    expect(painel().getAttribute('data-aberta')).toBe('true');
    expect(document.activeElement).toBe(painel().querySelector('a'));
  });

  it('fecha com Escape e devolve o foco ao botão', async () => {
    botao().click();
    await estabilizar();

    painel().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await estabilizar();

    expect(botao().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(botao());
  });

  it('fecha ao escolher uma seção e devolve o foco ao botão', async () => {
    botao().click();
    await estabilizar();

    painel().querySelectorAll('a')[1].click();
    await estabilizar();

    expect(painel().getAttribute('data-aberta')).toBe('false');
    expect(document.activeElement).toBe(botao());
  });

  it('fecha pelo botão "Fechar seções" e devolve o foco ao botão', async () => {
    botao().click();
    await estabilizar();

    painel().querySelector<HTMLButtonElement>('.fechar-gaveta')!.click();
    await estabilizar();

    expect(painel().getAttribute('data-aberta')).toBe('false');
    expect(document.activeElement).toBe(botao());
  });
});
