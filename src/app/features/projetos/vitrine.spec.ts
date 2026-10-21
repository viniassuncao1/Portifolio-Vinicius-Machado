import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { PROJETOS } from '../../core/projetos';
import { Vitrine } from './vitrine';

async function montar(url = '/projetos') {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: 'projetos', component: Vitrine, children: [{ path: ':slug', children: [] }] },
        { path: '**', children: [] },
      ]),
    ],
  });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(url, Vitrine);
  const raiz = harness.routeNativeElement as HTMLElement;
  const dialogo = () => raiz.querySelector('dialog') as HTMLDialogElement;
  const router = TestBed.inject(Router);
  const estabilizar = async () => {
    await harness.fixture.whenStable();
    harness.detectChanges();
  };
  return { harness, raiz, dialogo, router, estabilizar };
}

describe('Vitrine', () => {
  it('mostra os seis cartões em carrossel e os detalhes fechados', async () => {
    const { raiz, dialogo } = await montar();

    expect(raiz.querySelectorAll('a.cartao')).toHaveLength(6);
    expect(raiz.querySelector('.carrossel')?.getAttribute('data-modo')).toBe('carrossel');
    expect(dialogo().open).toBe(false);
  });

  it('abre direto nos detalhes quando o endereço traz o projeto', async () => {
    const { raiz, dialogo } = await montar('/projetos/ana');

    expect(dialogo().open).toBe(true);
    expect(raiz.querySelector('dialog h2')?.textContent).toBe('Ana, agente de IA');
  });

  it('ignora um projeto que não existe e deixa os detalhes fechados', async () => {
    const { dialogo } = await montar('/projetos/nao-existe');

    expect(dialogo().open).toBe(false);
  });

  it('o clique num cartão abre os detalhes e atualiza o endereço', async () => {
    const { raiz, dialogo, router, estabilizar } = await montar();

    raiz.querySelector<HTMLElement>('a.cartao[data-slug="launcher-de-tv"]')!.click();
    await estabilizar();

    expect(dialogo().open).toBe(true);
    expect(raiz.querySelector('dialog h2')?.textContent).toBe('Launcher de TV');
    expect(router.url).toBe('/projetos/launcher-de-tv');
  });

  it('fechar recolhe os detalhes e volta ao endereço da vitrine', async () => {
    const { raiz, dialogo, router, estabilizar } = await montar('/projetos/portfolio');

    raiz.querySelector<HTMLElement>('.fechar')!.click();
    await estabilizar();

    expect(dialogo().open).toBe(false);
    expect(router.url).toBe('/projetos');
  });

  it('Voltar do navegador fecha os detalhes', async () => {
    const { raiz, dialogo, router, estabilizar } = await montar();
    raiz.querySelector<HTMLElement>('a.cartao[data-slug="portfolio"]')!.click();
    await estabilizar();
    expect(dialogo().open).toBe(true);

    await router.navigateByUrl('/projetos');
    await estabilizar();

    expect(dialogo().open).toBe(false);
  });

  it('o próximo projeto dá a volta do último ao primeiro', async () => {
    const { raiz, router, estabilizar } = await montar('/projetos/watts-company');

    Array.from(raiz.querySelectorAll<HTMLButtonElement>('.navegacao button'))[1].click();
    await estabilizar();

    expect(raiz.querySelector('dialog h2')?.textContent).toBe(PROJETOS[0].titulo);
    expect(raiz.querySelector('.contador')?.textContent).toBe('01 / 06');
    expect(router.url).toBe(`/projetos/${PROJETOS[0].slug}`);
  });

  it('o projeto anterior dá a volta do primeiro ao último', async () => {
    const { raiz, estabilizar } = await montar('/projetos/memora');

    Array.from(raiz.querySelectorAll<HTMLButtonElement>('.navegacao button'))[0].click();
    await estabilizar();

    expect(raiz.querySelector('.contador')?.textContent).toBe('06 / 06');
  });

  it('alterna entre carrossel e grade, com aria-pressed', async () => {
    const { raiz, estabilizar } = await montar();
    const botao = raiz.querySelector<HTMLButtonElement>('.modo')!;
    expect(botao.getAttribute('aria-pressed')).toBe('false');
    expect(botao.textContent?.trim()).toBe('Ver em grade');

    botao.click();
    await estabilizar();

    expect(botao.getAttribute('aria-pressed')).toBe('true');
    expect(botao.textContent?.trim()).toBe('Ver em carrossel');
    expect(raiz.querySelector('.carrossel')?.getAttribute('data-modo')).toBe('grade');
  });
});
