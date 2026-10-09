import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Skills } from './skills';

describe('Skills', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  async function renderizar(pagina?: number): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(Skills);
    if (pagina) fixture.componentRef.setInput('pagina', pagina);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const literais = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll('.papel-literal')).map((l) => l.textContent);

  it('página 1 mostra linguagens, frameworks e databases e o controle 1/2', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('code')?.textContent).toContain('String[] linguagens = {');
    expect(raiz.querySelector('code')?.textContent).toContain('String[] databases = {');
    expect(literais(raiz)).toHaveLength(11);
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('1/2');
  });

  it('página 2 mostra cloudAndInfra e ferramentas e o controle 2/2', async () => {
    const raiz = await renderizar(2);

    expect(raiz.querySelector('code')?.textContent).toContain('String[] cloudAndInfra = {');
    expect(literais(raiz)).toEqual([
      '“Docker”',
      '“Kubernetes”',
      '“Nginx”',
      '“AWS”',
      '“Azure”',
      '“Git”',
      '“GitLab CI/CD”',
      '“Grafana”',
      '“Scrum”',
    ]);
    expect(raiz.querySelector('[aria-current="page"]')?.textContent?.trim()).toBe('2/2');
  });
});
