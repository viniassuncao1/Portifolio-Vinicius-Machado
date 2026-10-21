import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PROJETOS } from '../../core/projetos';
import { CarrosselDeProjetos } from './carrossel-de-projetos';

function montar(modo: 'carrossel' | 'grade' = 'carrossel') {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
  const fixture = TestBed.createComponent(CarrosselDeProjetos);
  fixture.componentRef.setInput('projetos', PROJETOS);
  fixture.componentRef.setInput('modo', modo);
  fixture.detectChanges();
  const raiz = fixture.nativeElement as HTMLElement;
  return { fixture, raiz };
}

describe('CarrosselDeProjetos', () => {
  it('mostra um cartão por projeto, sem cópias para o laço', () => {
    const { raiz } = montar();

    expect(raiz.querySelectorAll('a.cartao')).toHaveLength(PROJETOS.length);
    expect(raiz.querySelectorAll('[aria-hidden="true"] a.cartao')).toHaveLength(0);
  });

  it('a pista é um grupo rotulado, descrito como carrossel', () => {
    const { raiz } = montar();

    const pista = raiz.querySelector('.pista');
    expect(pista?.getAttribute('role')).toBe('group');
    expect(pista?.getAttribute('aria-roledescription')).toBe('carrossel');
    expect(pista?.getAttribute('aria-label')).toBe('Projetos');
  });

  it('tem um ponto por projeto, com o primeiro como atual', () => {
    const { raiz } = montar();

    const pontos = raiz.querySelectorAll('.ponto');
    expect(pontos).toHaveLength(PROJETOS.length);
    expect(pontos[0].getAttribute('aria-current')).toBe('true');
    expect(pontos[1].getAttribute('aria-current')).toBeNull();
    expect(pontos[2].getAttribute('aria-label')).toBe(PROJETOS[2].titulo);
  });

  it('o botão anterior começa desabilitado e o próximo habilitado', () => {
    const { raiz } = montar();

    const [anterior, proximo] = Array.from(raiz.querySelectorAll<HTMLButtonElement>('.seta'));
    expect(anterior.disabled).toBe(true);
    expect(proximo.disabled).toBe(false);
    expect(anterior.textContent).toContain('Projeto anterior');
    expect(proximo.textContent).toContain('Próximo projeto');
  });

  it('as setas do teclado movem o foco de cartão em cartão', () => {
    const { raiz } = montar();
    document.body.appendChild(raiz);
    const cartoes = Array.from(raiz.querySelectorAll<HTMLElement>('a.cartao'));
    cartoes[0].focus();

    cartoes[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

    expect(document.activeElement).toBe(cartoes[1]);
    raiz.remove();
  });

  it('no modo grade não há botões nem pontos, e os cartões seguem todos ativos', () => {
    const { raiz } = montar('grade');

    expect(raiz.querySelector('.controles')).toBeNull();
    expect(raiz.querySelector('.carrossel')?.getAttribute('data-modo')).toBe('grade');
    const inativos = raiz.querySelectorAll('a.cartao[data-ativo="false"]');
    expect(inativos).toHaveLength(0);
  });

  it('repassa a abertura de um cartão', () => {
    const { fixture, raiz } = montar();
    const abertos: unknown[] = [];
    fixture.componentInstance.abrir.subscribe((valor) => abertos.push(valor));

    raiz.querySelectorAll<HTMLElement>('a.cartao')[2].click();

    expect(abertos).toHaveLength(1);
    expect((abertos[0] as { projeto: unknown }).projeto).toBe(PROJETOS[2]);
  });
});
