import { TestBed } from '@angular/core/testing';

import { SecaoEmConstrucao } from './secao-em-construcao';

describe('SecaoEmConstrucao', () => {
  it('mostra no editor um comentário avisando que a seção está em construção', async () => {
    const fixture = TestBed.createComponent(SecaoEmConstrucao);
    await fixture.whenStable();
    const aviso = (fixture.nativeElement as HTMLElement).querySelector('.paragrafo');

    expect(aviso?.textContent).toContain('em construção');
  });

  it('exibe o aviso completo como texto do editor', async () => {
    const fixture = TestBed.createComponent(SecaoEmConstrucao);
    await fixture.whenStable();
    const aviso = (fixture.nativeElement as HTMLElement).querySelector('.paragrafo');

    expect(aviso?.textContent).toBe(
      'Esta seção está em construção. Volte em breve para ver o conteúdo completo.',
    );
  });

  it('usa o editor de código, no mesmo estilo das demais telas', async () => {
    const fixture = TestBed.createComponent(SecaoEmConstrucao);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('app-editor-de-codigo')).not.toBeNull();
    expect(elemento.querySelector('.papel-palavra-chave')?.textContent).toBe('public class');
  });
});
