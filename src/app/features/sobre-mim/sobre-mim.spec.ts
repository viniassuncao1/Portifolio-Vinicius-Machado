import { TestBed } from '@angular/core/testing';

import { CONTEUDO_SOBRE_MIM } from './sobre-mim.conteudo';
import { SobreMim } from './sobre-mim';

const INICIO_DO_PARAGRAFO = 'Sou desenvolvedor Full Stack com cerca de 2 anos de experiência';
const FIM_DO_PARAGRAFO = 'Sistemas Distribuídos e Arquitetura de Software.';

describe('SobreMim', () => {
  async function renderizar(): Promise<HTMLElement> {
    const fixture = TestBed.createComponent(SobreMim);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  const linhas = (raiz: HTMLElement) =>
    Array.from(raiz.querySelectorAll('code > span')).map((linha) =>
      linha.textContent?.replace(/\s+/g, ' ').trim(),
    );

  it('exibe o código da seção no editor, sem h1 próprio', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('app-editor-de-codigo')).toHaveLength(1);
    expect(raiz.querySelector('h1')).toBeNull();
  });

  it('exibe a interface, o método e a anotação da tela 02, na ordem', async () => {
    const raiz = await renderizar();

    expect(linhas(raiz).filter((texto) => texto !== '' && texto !== undefined)).toEqual([
      'public interface ViniciusMachado {',
      'void sobreMim();',
      '}',
      '@Override',
      'public void sobreMim() {',
      expect.stringContaining(INICIO_DO_PARAGRAFO),
      '}',
    ]);
  });

  it('colore as palavras-chave e a anotação', async () => {
    const raiz = await renderizar();

    expect(
      Array.from(raiz.querySelectorAll('.papel-palavra-chave')).map((t) => t.textContent),
    ).toEqual(['public interface', 'void', 'public void']);
    expect(raiz.querySelector('.papel-anotacao')?.textContent).toBe('@Override');
  });

  it('recua o campo, a anotação e o método um nível, e a interface, o parágrafo e as chaves zero', async () => {
    const raiz = await renderizar();
    const recuos = Array.from(raiz.querySelectorAll<HTMLElement>('code > span')).map((linha) =>
      linha.style.getPropertyValue('--recuo'),
    );

    // As linhas vazias não têm recuo.
    expect(recuos).toEqual(['', '0', '1', '0', '', '1', '1', '0', '', '0']);
  });

  it('exibe o parágrafo como um bloco de comentário único', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('.paragrafo')).toHaveLength(1);
  });

  it('começa e termina o parágrafo com os textos da spec', async () => {
    const texto = (await renderizar()).querySelector('.paragrafo')?.textContent ?? '';

    expect(texto.startsWith(INICIO_DO_PARAGRAFO)).toBe(true);
    expect(texto.endsWith(FIM_DO_PARAGRAFO)).toBe(true);
  });

  it('cita as tecnologias, a Memora, a Watts Company e o UniCEUB', async () => {
    const texto = (await renderizar()).querySelector('.paragrafo')?.textContent ?? '';

    for (const termo of [
      'Java, Spring Boot, Angular e SQL',
      'Memora Processos Inovadores',
      'Watts Company',
      'UniCEUB',
    ]) {
      expect(texto).toContain(termo);
    }
  });

  it('mantém o texto do código sem números de linha nem marcadores "*"', async () => {
    const codigo = (await renderizar()).querySelector('code')?.textContent ?? '';

    expect(codigo).not.toContain('*');
    expect(codigo).not.toMatch(/\b\d{2,}\b.*\b\d{2,}\b.*\b\d{2,}\b/);
  });

  it('não usa o papel valor nem linhas compactas', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('.papel-valor')).toBeNull();
    expect(raiz.querySelector('.compacta')).toBeNull();
  });

  it('tem o conteúdo tipado com 10 linhas', () => {
    expect(CONTEUDO_SOBRE_MIM).toHaveLength(10);
  });
});
