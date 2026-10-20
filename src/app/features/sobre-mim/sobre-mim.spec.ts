import { TestBed } from '@angular/core/testing';

import { CONTEUDO_SOBRE_MIM } from './sobre-mim.conteudo';
import { SobreMim } from './sobre-mim';

const INICIO_DO_PARAGRAFO = 'Sou desenvolvedor Full Stack com foco em Java 21 e Spring Boot';
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
      'package dev.vinicius.portfolio.sobre;',
      '// Todo desenvolvedor sabe se apresentar',
      'interface Desenvolvedor {',
      'String sobreMim();',
      '}',
      '// Eu: Vinicius Machado',
      'class ViniciusMachado implements Desenvolvedor {',
      '@Override',
      'public String sobreMim() {',
      'return "Full Stack: Java, Spring Boot, Angular e SQL";',
      '}',
      '}',
    ]);
  });

  it('colore palavras-chave, anotação, literal e comentário', async () => {
    const raiz = await renderizar();

    expect(
      Array.from(raiz.querySelectorAll('.papel-palavra-chave')).map((t) => t.textContent),
    ).toEqual(['package', 'interface', 'String', 'class', 'implements', 'public', 'return']);
    expect(raiz.querySelector('.papel-anotacao')?.textContent).toBe('@Override');
    expect(raiz.querySelector('.papel-literal')?.textContent).toContain('Full Stack');
    expect(raiz.querySelectorAll('.javadoc')).toHaveLength(1);
  });

  it('recua o corpo da classe um nível, o corpo do método dois e a interface zero', async () => {
    const raiz = await renderizar();
    const recuo = (texto: string) =>
      Array.from(raiz.querySelectorAll<HTMLElement>('code > span'))
        .find((l) => l.textContent?.trim() === texto)
        ?.style.getPropertyValue('--recuo');

    expect(recuo('interface Desenvolvedor {')).toBe('0');
    expect(recuo('String sobreMim();')).toBe('1');
    expect(recuo('@Override')).toBe('1');
    expect(recuo('return "Full Stack: Java, Spring Boot, Angular e SQL";')).toBe('2');
  });

  it('exibe o parágrafo como um bloco de comentário único', async () => {
    const raiz = await renderizar();

    expect(raiz.querySelectorAll('.javadoc')).toHaveLength(1);
  });

  it('começa e termina o parágrafo com os textos da spec', async () => {
    const texto = (await renderizar()).querySelector('.javadoc')?.textContent ?? '';

    expect(texto.startsWith(INICIO_DO_PARAGRAFO)).toBe(true);
    expect(texto.endsWith(FIM_DO_PARAGRAFO)).toBe(true);
  });

  it('cita as tecnologias, a Memora, a Watts Company e o UniCEUB', async () => {
    const texto = (await renderizar()).querySelector('.javadoc')?.textContent ?? '';

    for (const termo of [
      'Java 21 e Spring Boot',
      'Angular',
      'Spring Security',
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

  it('mostra a foto do Vinicius grande e sem prioridade, com alt', async () => {
    const foto = (await renderizar()).querySelector<HTMLImageElement>('.javadoc img.retrato');

    expect(foto?.getAttribute('src')).toContain('fotos/vinicius.webp');
    expect(foto?.getAttribute('alt')).toBe('Foto de Vinicius Machado');
    expect(foto?.classList.contains('pequeno')).toBe(false);
    expect(foto?.getAttribute('fetchpriority')).not.toBe('high');
    expect(foto?.getAttribute('loading')).toBe('lazy');
  });
});
