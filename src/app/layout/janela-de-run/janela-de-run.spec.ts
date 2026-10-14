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
    const { raiz } = await montar();
    const linhas = raiz.querySelectorAll<HTMLElement>('.linha');

    expect(linhas.length).toBeGreaterThan(10);
    expect(linhas[3].style.getPropertyValue('--indice')).toBe('3');
    expect(raiz.querySelector('section')?.getAttribute('data-terminado')).toBe('true');
  });

  it('só anuncia a linha final, em uma região aria-live polite', async () => {
    const { fixture, raiz } = await montar();
    fixture.detectChanges();
    await fixture.whenStable();
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

  it('a abertura automática não rouba o foco', async () => {
    const botao = document.createElement('button');
    document.body.append(botao);
    botao.focus();
    const fixture = TestBed.createComponent(JanelaDeRunComponente);
    TestBed.inject(JanelaDeRun).abrirNaPrimeiraVisita();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.activeElement).toBe(botao);
    botao.remove();
  });
});
