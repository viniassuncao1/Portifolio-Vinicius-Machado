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

  it('exibe a interface, a implementação, o Javadoc e o método, na ordem', async () => {
    const raiz = await renderizar();

    expect(linhas(raiz).filter((texto) => texto !== '' && texto !== undefined)).toEqual([
      'public interface Developer {',
      'String aboutMe();',
      '}',
      'public final class ViniciusMachado implements Developer {',
      'private static final String ABOUT_ME = "Full Stack: Java, Spring Boot, Angular e SQL";',
      '/**',
      expect.stringContaining(INICIO_DO_PARAGRAFO),
      '*/',
      '@Override',
      'public String aboutMe() {',
      'return ABOUT_ME;',
      '}',
      '}',
    ]);
  });

  it('colore palavras-chave, anotação, literal e comentário', async () => {
    const raiz = await renderizar();

    expect(
      Array.from(raiz.querySelectorAll('.papel-palavra-chave')).map((t) => t.textContent),
    ).toEqual([
      'public interface',
      'String',
      'public final class',
      'implements',
      'private static final',
      'public',
      'return',
    ]);
    expect(raiz.querySelector('.papel-anotacao')?.textContent).toBe('@Override');
    expect(raiz.querySelector('.papel-literal')?.textContent).toContain('Full Stack');
    expect(raiz.querySelectorAll('.papel-comentario')).toHaveLength(2);
  });

  it('recua o corpo da classe um nível, o corpo do método dois e a interface zero', async () => {
    const raiz = await renderizar();
    const recuo = (texto: string) =>
      Array.from(raiz.querySelectorAll<HTMLElement>('code > span'))
        .find((l) => l.textContent?.trim() === texto)
        ?.style.getPropertyValue('--recuo');

    expect(recuo('public interface Developer {')).toBe('0');
    expect(recuo('String aboutMe();')).toBe('1');
    expect(recuo('@Override')).toBe('1');
    expect(recuo('return ABOUT_ME;')).toBe('2');
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

  it('mantém o texto do código sem números de linha', async () => {
    const codigo = (await renderizar()).querySelector('code')?.textContent ?? '';

    expect(codigo).not.toMatch(/\b\d{2,}\b.*\b\d{2,}\b.*\b\d{2,}\b/);
  });

  it('não usa o papel valor nem linhas compactas', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelector('.papel-valor')).toBeNull();
    expect(raiz.querySelector('.compacta')).toBeNull();
  });

  it('tem o conteúdo tipado com 16 linhas', () => {
    expect(CONTEUDO_SOBRE_MIM).toHaveLength(16);
  });
});
