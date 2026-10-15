import { TestBed } from '@angular/core/testing';

import { JanelaDeRun } from '../../core/janela-de-run';
import { JanelaDeRunComponente } from './janela-de-run';

async function montar() {
  const fixture = TestBed.createComponent(JanelaDeRunComponente);
  TestBed.inject(JanelaDeRun).executar(null);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return { fixture, raiz: fixture.nativeElement as HTMLElement };
}

describe('JanelaDeRunComponente', () => {
  it('não renderiza nada até abrir e marca data-aberto', () => {
    const fixture = TestBed.createComponent(JanelaDeRunComponente);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('section')).toBeNull();
    expect((fixture.nativeElement as HTMLElement).getAttribute('data-aberto')).toBe('false');
  });

  it('é uma região com nome acessível e o log é texto', async () => {
    const { raiz } = await montar();

    expect(raiz.querySelector('section')?.getAttribute('aria-labelledby')).toBe(
      'titulo-da-janela-de-run',
    );
    expect(raiz.querySelector('#titulo-da-janela-de-run')?.textContent).toBe('Run');
    const log = raiz.querySelector('.log')!;
    expect(log.getAttribute('role')).toBe('region');
    expect(log.getAttribute('aria-label')).toContain('Log de inicialização');
    expect(log.textContent).toContain('Started PortfolioApplication in 1.8 seconds');
    expect(raiz.querySelector('img, canvas')).toBeNull();
  });

  it('mostra o log completo, com um ponto de animação por linha (--indice)', async () => {
    const { fixture, raiz } = await montar();
    TestBed.inject(JanelaDeRun).concluir();
    fixture.detectChanges();
    const linhas = raiz.querySelectorAll<HTMLElement>('.linha');

    expect(linhas.length).toBeGreaterThan(10);
    expect(linhas[3].style.getPropertyValue('--indice')).toBe('3');
    expect(raiz.querySelector('section')?.getAttribute('data-terminado')).toBe('true');
  });

  it('só anuncia a linha final, em uma região aria-live polite', async () => {
    const { fixture, raiz } = await montar();
    TestBed.inject(JanelaDeRun).concluir();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const vivas = raiz.querySelectorAll('[aria-live]');

    expect(vivas).toHaveLength(1);
    expect(vivas[0].getAttribute('aria-live')).toBe('polite');
    expect(vivas[0].textContent).toContain('Started PortfolioApplication');
    expect(raiz.querySelector('.log')?.closest('[aria-live]')).toBeNull();
  });

  it('Esc e o botão de fechar fecham a janela', async () => {
    const { fixture, raiz } = await montar();
    const run = TestBed.inject(JanelaDeRun);

    raiz.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(run.aberto()).toBe(false);

    run.executar(null);
    fixture.detectChanges();
    raiz.querySelector<HTMLButtonElement>('.fechar')!.click();
    expect(run.aberto()).toBe(false);
  });

  it('sem o Executar a janela não abre e não rouba o foco', async () => {
    const botao = document.createElement('button');
    document.body.append(botao);
    botao.focus();
    const fixture = TestBed.createComponent(JanelaDeRunComponente);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(TestBed.inject(JanelaDeRun).aberto()).toBe(false);
    expect(document.activeElement).toBe(botao);
    botao.remove();
  });

  describe('revelação do log', () => {
    const ocultas = (raiz: HTMLElement) => raiz.querySelectorAll('.linha.oculta').length;

    afterEach(() => vi.useRealTimers());

    it('mostra o banner de uma vez e as demais linhas a cada ~200 ms, com todo o texto no DOM', async () => {
      vi.useFakeTimers();
      const { fixture, raiz } = await montar();
      const total = raiz.querySelectorAll('.linha').length;

      expect(ocultas(raiz)).toBe(total - 8);
      expect(raiz.querySelector('.log')?.textContent).toContain('Started PortfolioApplication');

      vi.advanceTimersByTime(400);
      fixture.detectChanges();
      expect(ocultas(raiz)).toBe(total - 10);
    });

    it('termina em até 2,5 s, com o log completo e sem linhas escondidas', async () => {
      vi.useFakeTimers();
      const { fixture, raiz } = await montar();

      vi.advanceTimersByTime(2500);
      fixture.detectChanges();

      expect(TestBed.inject(JanelaDeRun).terminado()).toBe(true);
      expect(ocultas(raiz)).toBe(0);
      expect(raiz.querySelector('.pular')).toBeNull();
    });

    it('"Pular" completa o log na hora', async () => {
      vi.useFakeTimers();
      const { fixture, raiz } = await montar();

      raiz.querySelector<HTMLButtonElement>('.pular')!.click();
      fixture.detectChanges();

      expect(ocultas(raiz)).toBe(0);
      expect(raiz.querySelector('section')?.getAttribute('data-terminado')).toBe('true');
    });

    it('com movimento reduzido nada fica escondido e não há Pular', async () => {
      const original = document.defaultView!.matchMedia;
      document.defaultView!.matchMedia = ((q: string) => ({
        matches: q.includes('reduce'),
      })) as typeof matchMedia;
      const { raiz } = await montar();
      document.defaultView!.matchMedia = original;

      expect(ocultas(raiz)).toBe(0);
      expect(raiz.querySelector('.pular')).toBeNull();
    });

    it('reexecutar recomeça a revelação', async () => {
      vi.useFakeTimers();
      const { fixture, raiz } = await montar();
      vi.advanceTimersByTime(2500);
      fixture.detectChanges();

      TestBed.inject(JanelaDeRun).executar(null);
      fixture.detectChanges();

      expect(ocultas(raiz)).toBeGreaterThan(0);
    });

    it('o CSS usa tokens, só opacity, e desliga a animação com prefers-reduced-motion', async () => {
      await montar();
      const css = Array.from(document.head.querySelectorAll('style'))
        .map((e) => e.textContent ?? '')
        .join('\n');

      expect(css).toMatch(/animation:\s*\S*linha-aparecer\s+var\(--duracao-rapida\)/);
      expect(css).toMatch(/prefers-reduced-motion:\s*reduce\)[^]*animation:\s*none/);
    });
  });
});
