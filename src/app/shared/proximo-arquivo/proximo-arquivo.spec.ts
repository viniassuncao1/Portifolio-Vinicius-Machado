import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { ProximoArquivo } from './proximo-arquivo';

describe('ProximoArquivo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: ProximoArquivo },
          { path: ':slug', component: ProximoArquivo },
          { path: ':slug/:pagina', component: ProximoArquivo },
        ]),
      ],
    });
  });

  let harness: RouterTestingHarness;

  beforeEach(async () => {
    harness = await RouterTestingHarness.create();
  });

  async function abrir(url: string): Promise<HTMLElement> {
    await harness.navigateByUrl(url);
    harness.detectChanges();
    return harness.routeNativeElement as HTMLElement;
  }

  it('mostra "Próximo: <arquivo> →" apontando para a seção seguinte', async () => {
    const link = (await abrir('/sobre-mim')).querySelector('a');

    expect(link?.textContent?.trim()).toBe('// Próximo: Diferenciais.java →');
    expect(link?.getAttribute('href')).toBe('/diferenciais');
  });

  it('não aparece no Início nem na última seção', async () => {
    expect((await abrir('/')).querySelector('a')).toBeNull();
    expect((await abrir('/contato')).querySelector('a')).toBeNull();
  });

  it('em seções que já foram paginadas, aponta sempre para a seção seguinte', async () => {
    expect((await abrir('/skills')).querySelector('a')?.getAttribute('href')).toBe('/experiencias');
    expect((await abrir('/experiencias')).querySelector('a')?.getAttribute('href')).toBe(
      '/projetos',
    );
  });
});
