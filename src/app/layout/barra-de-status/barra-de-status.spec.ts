import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { Abertura } from '../../core/abertura';
import { SHA_DO_BUILD } from '../../core/build.gerado';
import { EstadoDoEditor } from '../../core/estado-do-editor';
import { BarraDeStatus } from './barra-de-status';

@Component({ template: '' })
class Vazia {}

describe('BarraDeStatus', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          { path: 'skills', component: Vazia },
          { path: 'contato', component: Vazia },
        ]),
      ],
    });
  });

  async function abrir(...urls: string[]) {
    const harness = await RouterTestingHarness.create();
    const fixture = TestBed.createComponent(BarraDeStatus);
    for (const url of urls) await harness.navigateByUrl(url);
    fixture.detectChanges();
    await fixture.whenStable();
    return { harness, fixture, raiz: fixture.nativeElement as HTMLElement };
  }

  it('mostra o arquivo da aba ativa, LF, UTF-8, 4 spaces e master', async () => {
    const { raiz } = await abrir('/skills');
    const texto = raiz.textContent ?? '';

    ['Skills.java', 'LF', 'UTF-8', '4 spaces', 'master', '1:1'].forEach((t) =>
      expect(texto).toContain(t),
    );
    expect(texto).not.toContain('Java 21');
  });

  it('mostra os breadcrumbs do projeto até o arquivo, com o meio truncável', async () => {
    const { raiz } = await abrir('/skills');

    expect(raiz.querySelector('.projeto')?.textContent).toBe('portfolio-vinicius');
    expect(raiz.querySelector('.meio')?.textContent).toBe(
      'src › main › java › dev › vinicius › portfolio › skills',
    );
    expect(raiz.querySelector('.prefixo')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('só mostra o item do commit quando o build trouxe o SHA', async () => {
    const { raiz } = await abrir('/skills');

    expect(raiz.querySelector('.commit') !== null).toBe(SHA_DO_BUILD !== null);
  });

  it('mostra PortfolioApplication.java no Início', async () => {
    const { raiz } = await abrir('/');

    expect(raiz.querySelector('.arquivo')?.textContent).toBe('PortfolioApplication.java');
  });

  it('troca o arquivo quando a seção muda', async () => {
    const { harness, fixture, raiz } = await abrir('/skills');

    await harness.navigateByUrl('/contato');
    fixture.detectChanges();

    expect(raiz.querySelector('.arquivo')?.textContent).toBe('Contato.java');
  });

  it('acompanha linha e coluna do EstadoDoEditor', async () => {
    const { fixture, raiz } = await abrir('/skills');

    TestBed.inject(EstadoDoEditor).posicionar(7, 1);
    fixture.detectChanges();

    expect(raiz.querySelector('.posicao')?.textContent).toBe('7:1');
  });

  it('é o landmark contentinfo e só o arquivo é status, sem a posição do cursor', async () => {
    const { raiz } = await abrir('/skills');

    expect(raiz.querySelector('footer')?.hasAttribute('role')).toBe(false);
    expect(raiz.querySelector('.arquivo')?.getAttribute('role')).toBe('status');
    expect(raiz.querySelector('.posicao')?.getAttribute('aria-hidden')).toBe('true');
    expect(raiz.querySelector('.arquivo')?.hasAttribute('aria-hidden')).toBe(false);
  });
});

describe('BarraDeStatus: aviso de inicialização', () => {
  afterEach(() => vi.useRealTimers());

  it('mostra o aviso por 6 s numa região aria-live polite e depois o esconde', async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(BarraDeStatus);
    fixture.detectChanges();
    const aviso = () => (fixture.nativeElement as HTMLElement).querySelector('.aviso')!;
    expect(aviso().getAttribute('role')).toBe('status');
    expect(aviso().getAttribute('aria-live')).toBe('polite');
    expect(aviso().textContent).toBe('');

    TestBed.inject(Abertura).avisar();
    fixture.detectChanges();
    expect(aviso().textContent).toBe('PortfolioApplication started in 1.8 s');

    vi.advanceTimersByTime(6000);
    fixture.detectChanges();
    expect(aviso().textContent).toBe('');
  });

  it('o aviso leva o nome da View Transition só durante a revelação', () => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(BarraDeStatus);
    const abertura = TestBed.inject(Abertura);
    fixture.detectChanges();
    const aviso = () =>
      (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('.aviso')!;
    expect(aviso().style.viewTransitionName).toBe('');

    abertura.fase.set('revelando');
    fixture.detectChanges();
    expect(aviso().style.viewTransitionName).toBe('console-de-run');

    abertura.fase.set('encerrada');
    fixture.detectChanges();
    expect(aviso().style.viewTransitionName).toBe('');
  });
});
