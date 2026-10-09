import type { ConteudoDoEditor } from './shared/editor-de-codigo/conteudo';
import { DOCUMENTOS, codigoDe, comentariosDe, textoDe } from './conteudo-das-secoes.apoio';

/** Palavras em português que não podem aparecer em identificadores (tipos, campos, constantes). */
const PALAVRAS_EM_PORTUGUES = new Set([
  'nome',
  'cargo',
  'empresa',
  'periodo',
  'curso',
  'cursos',
  'horas',
  'concluido',
  'cidade',
  'origem',
  'idioma',
  'idiomas',
  'nivel',
  'niveis',
  'formacao',
  'contato',
  'telefone',
  'tecnologia',
  'tecnologias',
  'habilidade',
  'habilidades',
  'inicio',
  'sobre',
  'eventos',
  'vezes',
  'destaques',
  'descricao',
  'linguagens',
  'ferramentas',
  'graduacao',
  'instituicao',
  'conhecimento',
]);

/** Marcas de português: palavras comuns ou letras acentuadas. */
const PORTUGUES =
  /[áàâãéêíóôõúç]|\b(de|do|da|dos|das|que|cada|e|eu|em|os|as|um|uma|para|tem|uso|meu)\b/i;

/** As páginas de cada seção juntas: `Skills 1/3`, `2/3` e `3/3` viram a seção `Skills`. */
const SECOES_COM_COMENTARIOS: [string, ConteudoDoEditor[]][] = Object.entries(
  DOCUMENTOS.reduce<Record<string, ConteudoDoEditor[]>>((secoes, [nome, conteudo]) => {
    const secao = nome.replace(/ \d+\/\d+$/, '');
    return { ...secoes, [secao]: [...(secoes[secao] ?? []), conteudo] };
  }, {}),
);

const LIMITE_DA_LISTA_CURTA = 5;
const LIMITE_DE_CARACTERES_DO_ITEM_CURTO = 24;

/** Palavras de um identificador: `completedOn` → [completed, on]; `MY_SKILLS` → [my, skills]. */
const palavrasDe = (identificador: string): string[] =>
  identificador
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[\s_]+/)
    .map((palavra) => palavra.toLowerCase())
    .filter(Boolean);

/**
 * Cada `List.of(...)` do texto, do `(` ao `)` que o fecha, ignorando parênteses dentro de aspas
 * (como em "Correção de bug (Sankhya)").
 */
function listasDe(texto: string): string[] {
  const listas: string[] = [];
  for (const { index } of texto.matchAll(/List\.of\(/g)) {
    let profundidade = 0;
    let dentroDeAspas = false;
    for (let i = index + 'List.of'.length; i < texto.length; i++) {
      const caractere = texto[i];
      if (caractere === '"') dentroDeAspas = !dentroDeAspas;
      if (dentroDeAspas) continue;
      if (caractere === '(') profundidade++;
      if (caractere === ')' && --profundidade === 0) {
        listas.push(texto.slice(index, i + 1));
        break;
      }
    }
  }
  return listas;
}

const itensDa = (lista: string): string[] => Array.from(lista.matchAll(/"([^"]*)"/g), (m) => m[1]);

describe('legibilidade do código exibido', () => {
  describe('comentários em pt-BR', () => {
    it.each(SECOES_COM_COMENTARIOS)('%s: tem ao menos um comentário // em pt-BR', (_n, paginas) => {
      const comentarios = paginas.flatMap(comentariosDe);

      expect(comentarios.length).toBeGreaterThan(0);
      expect(comentarios.some((comentario) => PORTUGUES.test(comentario))).toBe(true);
    });

    it('o verificador reconhece português e rejeita inglês', () => {
      expect(PORTUGUES.test('Cada curso tem o nome')).toBe(true);
      expect(PORTUGUES.test('Graduação')).toBe(true);
      expect(PORTUGUES.test('Each course has a name')).toBe(false);
    });
  });

  describe('listas curtas numa linha', () => {
    it.each(DOCUMENTOS)('%s: listas de até 5 tecnologias cabem numa linha', (_nome, conteudo) => {
      const quebradas = listasDe(textoDe(conteudo)).filter((lista) => {
        const itens = itensDa(lista);
        const curtos = itens.every((item) => item.length <= LIMITE_DE_CARACTERES_DO_ITEM_CURTO);
        const soTextos = !lista.includes('new ');
        return (
          soTextos &&
          itens.length > 0 &&
          itens.length <= LIMITE_DA_LISTA_CURTA &&
          curtos &&
          lista.includes('\n')
        );
      });

      expect(quebradas).toEqual([]);
    });

    it('o verificador acusa lista curta quebrada e aceita a que está numa linha', () => {
      const quebrada = listasDe('List.of(\n"Java",\n"SQL"\n)');
      const numaLinha = listasDe('List.of("Java", "SQL"),');

      expect(quebrada[0]).toContain('\n');
      expect(numaLinha).toEqual(['List.of("Java", "SQL")']);
    });

    it('ignora parênteses dentro dos textos entre aspas', () => {
      expect(listasDe('List.of("Bug (Sankhya)", "SQL")')).toEqual([
        'List.of("Bug (Sankhya)", "SQL")',
      ]);
    });

    it('Skills: as listas de tecnologias de cada página estão numa linha', () => {
      const skills = DOCUMENTOS.filter(([nome]) => nome.startsWith('Skills')).flatMap(([, c]) =>
        listasDe(textoDe(c)).filter((lista) => itensDa(lista).length <= LIMITE_DA_LISTA_CURTA),
      );

      expect(skills.length).toBeGreaterThanOrEqual(7);
      skills.forEach((lista) => expect(lista).not.toContain('\n'));
    });
  });

  describe('sem construções que exigem Java avançado', () => {
    it.each(DOCUMENTOS)('%s: sem Optional nem URI.create', (_nome, conteudo) => {
      const texto = textoDe(conteudo);

      expect(texto).not.toContain('Optional');
      expect(texto).not.toContain('URI.create');
    });

    it.each(DOCUMENTOS)('%s: sem genérico aninhado (como List<List<...>>)', (_nome, conteudo) => {
      expect(codigoDe(conteudo)).not.toMatch(/<[^<>]*<[^<>]*>/);
    });
  });

  describe('identificadores em inglês', () => {
    it.each(DOCUMENTOS)('%s: o código só tem letras ASCII', (_nome, conteudo) => {
      expect(codigoDe(conteudo)).not.toMatch(/[^\p{ASCII}]/u);
    });

    it.each(DOCUMENTOS)('%s: nenhum identificador usa palavra em português', (_nome, conteudo) => {
      const identificadores = new Set(codigoDe(conteudo).match(/\b[A-Za-z_]\w*\b/g));
      const emPortugues = [...identificadores].filter((identificador) =>
        palavrasDe(identificador).some((palavra) => PALAVRAS_EM_PORTUGUES.has(palavra)),
      );

      expect(emPortugues).toEqual([]);
    });

    it('o verificador separa as palavras de um identificador', () => {
      expect(palavrasDe('completedOn')).toEqual(['completed', 'on']);
      expect(palavrasDe('MY_SKILLS')).toEqual(['my', 'skills']);
      expect(palavrasDe('cidadeAtual')).toEqual(['cidade', 'atual']);
    });
  });
});
