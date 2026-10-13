import { TestBed } from '@angular/core/testing';

import { Projeto1 } from './projeto-1';

describe('Projeto1', () => {
  async function renderizar(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Projeto1);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('apresenta a Ana com plataforma, automação e integrações', async () => {
    const codigo = (await renderizar()).querySelector('code')?.textContent ?? '';

    expect(codigo).toContain('public class Ana extends AIAgent {');
    expect(codigo).toContain('String platform = "WhatsApp";');
    expect(codigo).toContain('String automation = "n8n";');
    expect(codigo).toContain('"Google OAuth 2.0"');
    expect(codigo).toContain('"API do WhatsApp"');
  });

  it('lista o que a Ana faz e cita o painel em React', async () => {
    const raiz = await renderizar();
    const codigo = raiz.querySelector('code')?.textContent ?? '';

    for (const tarefa of [
      'Marca sessões',
      'Desmarca sessões',
      'Cancela sessões',
      'Bloqueia spam',
    ]) {
      expect(codigo).toContain(tarefa);
    }
    expect(raiz.querySelector('.javadoc')?.textContent).toContain('Claude Code');
    expect(raiz.querySelector('.javadoc')?.textContent).toContain('SDD');
  });

  it('abre cada bloco com um comentário e não tem h1 próprio', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('.papel-comentario').length).toBeGreaterThanOrEqual(4);
    expect(raiz.querySelector('h1')).toBeNull();
  });
});
