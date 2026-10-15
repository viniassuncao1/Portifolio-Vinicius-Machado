import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { JanelaDePreview } from '../../core/janela-de-preview';
import { PREVIEWS } from '../../core/previews';
import { VisaoDeCodigo } from './visao-de-codigo';

@Component({ template: '<app-visao-de-codigo />', imports: [VisaoDeCodigo] })
class Pagina {}

const abrirRota = async (rota: string): Promise<HTMLElement> => {
  TestBed.configureTestingModule({
    providers: [provideRouter([{ path: '**', component: Pagina }])],
  });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(rota);
  harness.detectChanges();
  return harness.routeNativeElement as HTMLElement;
};

describe('VisaoDeCodigo', () => {
  it('mostra "▶ Executar · Ver o site ao vivo" nos projetos com site', async () => {
    const pagina = await abrirRota('/projeto-2');
    const botao = pagina.querySelector<HTMLButtonElement>('button.visao');
    expect(botao?.textContent?.replace(/\s+/g, ' ').trim()).toBe('▶ Executar · Ver o site ao vivo');
  });

  it('não aparece nas seções sem site', async () => {
    const pagina = await abrirRota('/projeto-1');
    expect(pagina.querySelector('button.visao')).toBeNull();
  });

  it('abre a janela de preview do projeto ao ativar', async () => {
    const pagina = await abrirRota('/projeto-2');
    pagina.querySelector<HTMLButtonElement>('button.visao')?.click();
    expect(TestBed.inject(JanelaDePreview).preview()).toBe(PREVIEWS['projeto-2']);
  });

  describe('com link externo (Projeto 5)', () => {
    const link = (pagina: HTMLElement) => pagina.querySelector<HTMLAnchorElement>('a.visao');

    it('mostra "▶ Executar · Ver no GitHub" como link para o repositório em nova aba', async () => {
      const pagina = await abrirRota('/projeto-5');
      const a = link(pagina);

      expect(a?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
        '▶ Executar · Ver no GitHub (abre em nova aba)',
      );
      expect(a?.getAttribute('href')).toBe(
        'https://github.com/viniassuncao1/Portifolio-Vinicius-Machado',
      );
      expect(a?.getAttribute('target')).toBe('_blank');
      expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
      expect(pagina.querySelector('button.visao')).toBeNull();
    });

    it('vale nas outras páginas do Projeto 5, mas não nas demais seções', async () => {
      expect(link(await abrirRota('/projeto-5/3'))).not.toBeNull();
      TestBed.resetTestingModule();
      expect(link(await abrirRota('/projeto-4'))).toBeNull();
    });

    it('não abre a janela de preview', async () => {
      const pagina = await abrirRota('/projeto-5');
      link(pagina)?.addEventListener('click', (e) => e.preventDefault());
      link(pagina)?.click();

      expect(TestBed.inject(JanelaDePreview).preview()).toBeNull();
    });
  });
});
