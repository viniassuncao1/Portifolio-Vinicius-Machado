import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { SECOES } from '../../core/secoes';
import { ArvoreDeSecoes } from './arvore-de-secoes';

@Component({ template: '' })
class Vazia {}

describe('ArvoreDeSecoes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: Vazia },
          ...SECOES.map((secao) => ({ path: secao.slug, component: Vazia })),
        ]),
      ],
    });
  });

  const abrir = async (url: string) => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    const fixture = TestBed.createComponent(ArvoreDeSecoes);
    await fixture.whenStable();
    return fixture;
  };

  it('lista as 15 seções como links', async () => {
    const fixture = await abrir('/');
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a');

    expect(links).toHaveLength(15);
    expect(links[4].getAttribute('href')).toBe('/experiencias');
  });

  it('não marca nenhum item como página atual no Início', async () => {
    const fixture = await abrir('/');

    expect((fixture.nativeElement as HTMLElement).querySelector('[aria-current]')).toBeNull();
  });

  it('destaca a seção aberta e a anuncia como página atual', async () => {
    const fixture = await abrir('/experiencias');
    const atual = (fixture.nativeElement as HTMLElement).querySelectorAll('[aria-current="page"]');

    expect(atual).toHaveLength(1);
    expect(atual[0].textContent).toContain('Experiências');
    expect(atual[0].classList).toContain('atual');
  });

  it('foca o primeiro item e avisa quando uma seção é escolhida', async () => {
    const fixture = await abrir('/');
    const escolhidas: unknown[] = [];
    fixture.componentInstance.secaoEscolhida.subscribe(() => escolhidas.push(true));
    const elemento = fixture.nativeElement as HTMLElement;
    document.body.append(elemento);

    fixture.componentInstance.focarPrimeiroItem();
    elemento.querySelectorAll('a')[2].click();

    expect(document.activeElement).toBe(elemento.querySelector('a'));
    expect(escolhidas).toHaveLength(1);
    elemento.remove();
  });

  it('mostra os títulos das 15 seções na ordem definida', async () => {
    const fixture = await abrir('/');
    const titulos = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('a .titulo'),
    ).map((titulo) => titulo.textContent);

    expect(titulos).toEqual(SECOES.map((secao) => secao.titulo));
  });

  it('liga cada item à rota da sua seção', async () => {
    const fixture = await abrir('/');
    const hrefs = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('a')).map(
      (link) => link.getAttribute('href'),
    );

    expect(hrefs).toEqual(SECOES.map((secao) => `/${secao.slug}`));
  });

  it('mostra o ícone da seção em cada item', async () => {
    const fixture = await abrir('/');
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a');

    SECOES.forEach((secao, i) => {
      expect(links[i].querySelector('app-icone img')?.getAttribute('src')).toContain(
        `icones/${secao.icone}.svg`,
      );
    });
  });

  it('esconde a seta decorativa de cada item da leitura', async () => {
    const fixture = await abrir('/');
    const setas = (fixture.nativeElement as HTMLElement).querySelectorAll('a .seta');

    expect(setas).toHaveLength(15);
    setas.forEach((seta) => {
      expect(seta.getAttribute('aria-hidden')).toBe('true');
      expect(seta.getAttribute('focusable')).toBe('false');
    });
  });

  it('identifica a navegação para tecnologias assistivas', async () => {
    const fixture = await abrir('/');

    expect(
      (fixture.nativeElement as HTMLElement).querySelector('nav')?.getAttribute('aria-label'),
    ).toBe('Seções do portfólio');
  });

  it('move o destaque quando a rota muda', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/sobre-mim');
    const fixture = TestBed.createComponent(ArvoreDeSecoes);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    await harness.navigateByUrl('/contato');
    fixture.detectChanges();
    await fixture.whenStable();

    const atual = elemento.querySelectorAll('[aria-current="page"]');
    expect(atual).toHaveLength(1);
    expect(atual[0].textContent).toContain('Contato');
  });

  it('gira a seta do item atual para baixo pelo estilo', async () => {
    await abrir('/sobre-mim');
    const estilos = Array.from(document.head.querySelectorAll('style'))
      .map((e) => e.textContent ?? '')
      .join('\n');

    expect(estilos).toMatch(/\.atual[^{]*\.seta[^{]*\{[^}]*rotate:\s*90deg/);
  });

  it('mantém todos os itens alcançáveis pelo teclado, sem tabindex negativo', async () => {
    const fixture = await abrir('/');
    const links = (fixture.nativeElement as HTMLElement).querySelectorAll('a');

    links.forEach((link) => expect(link.getAttribute('tabindex')).not.toBe('-1'));
  });

  describe('no Início', () => {
    const abrirNoInicio = async () => {
      const fixture = await abrir('/');
      fixture.componentRef.setInput('noInicio', true);
      await fixture.whenStable();
      return fixture.nativeElement as HTMLElement;
    };

    it('destaca só "Sobre Mim", sem aria-current', async () => {
      const elemento = await abrirNoInicio();

      const destacados = elemento.querySelectorAll('.destacado');
      expect(destacados).toHaveLength(1);
      expect(destacados[0].textContent).toContain('Sobre Mim');
      expect(elemento.querySelector('[aria-current]')).toBeNull();
    });

    it('não destaca nada quando o estado está desligado', async () => {
      const fixture = await abrir('/');

      expect((fixture.nativeElement as HTMLElement).querySelector('.destacado')).toBeNull();
    });
  });
});
