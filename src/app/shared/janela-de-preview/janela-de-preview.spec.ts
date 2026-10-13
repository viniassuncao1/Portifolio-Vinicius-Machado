import { TestBed } from '@angular/core/testing';

import { JanelaDePreview } from '../../core/janela-de-preview';
import { PREVIEWS } from '../../core/previews';
import { provideRouter } from '@angular/router';
import { JanelaDePreviewComponente } from './janela-de-preview';

describe('JanelaDePreviewComponente', () => {
  beforeEach(() => {
    // Nem todo ambiente de teste implementa o <dialog> modal: o stub só marca `open`.
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close = function close() {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  async function abrir() {
    const fixture = TestBed.createComponent(JanelaDePreviewComponente);
    const origem = document.createElement('button');
    document.body.append(origem);
    TestBed.inject(JanelaDePreview).abrir(PREVIEWS['projeto-2'], origem);
    await fixture.whenStable();
    return { fixture, elemento: fixture.nativeElement as HTMLElement, origem };
  }

  it('fica vazia com a janela fechada', async () => {
    const fixture = TestBed.createComponent(JanelaDePreviewComponente);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('dialog')?.hasAttribute('open')).toBe(false);
    expect(elemento.querySelector('img')).toBeNull();
  });

  it('abre como diálogo nomeado pelo projeto, com a captura e sem iframe', async () => {
    const { elemento } = await abrir();
    const dialogo = elemento.querySelector('dialog')!;

    expect(dialogo.hasAttribute('open')).toBe(true);
    expect(dialogo.getAttribute('data-estado')).toBe('aberto');
    expect(elemento.querySelector('#titulo-da-janela')?.textContent).toContain('Dra. Juliana');
    expect(elemento.querySelector('img')?.getAttribute('alt')).toBe(
      PREVIEWS['projeto-2'].captura.alt,
    );
    expect(elemento.querySelector('iframe')).toBeNull();
  });

  it('"Ver ao vivo" troca a captura pelo iframe com sandbox e vira "Ver captura"', async () => {
    const { fixture, elemento } = await abrir();
    const botao = elemento.querySelector<HTMLButtonElement>('.acao')!;
    expect(botao.textContent?.trim()).toBe('Ver ao vivo');

    botao.click();
    await fixture.whenStable();
    const iframe = elemento.querySelector('iframe')!;

    expect(iframe.getAttribute('sandbox')).toBe(
      'allow-scripts allow-same-origin allow-popups allow-forms',
    );
    expect(iframe.getAttribute('referrerpolicy')).toBe('no-referrer');
    expect(iframe.getAttribute('title')).toContain('Dra. Juliana');
    expect(elemento.querySelector('img')).toBeNull();
    expect(elemento.querySelector('.acao')?.textContent?.trim()).toBe('Ver captura');
  });

  it('"Abrir em nova aba" aponta para o site com rel seguro', async () => {
    const { elemento } = await abrir();
    const link = elemento.querySelector<HTMLAnchorElement>('a.acao')!;

    expect(link.getAttribute('href')).toBe(PREVIEWS['projeto-2'].url);
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('o × fecha a janela e devolve o foco a quem a abriu', async () => {
    const { fixture, elemento, origem } = await abrir();

    elemento.querySelector<HTMLButtonElement>('.fechar')!.click();
    await fixture.whenStable();

    expect(TestBed.inject(JanelaDePreview).preview()).toBeNull();
    expect(elemento.querySelector('dialog')?.hasAttribute('open')).toBe(false);
    expect(document.activeElement).toBe(origem);
  });
});
