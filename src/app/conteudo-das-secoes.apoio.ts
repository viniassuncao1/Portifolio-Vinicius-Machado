import { CONTEUDOS_CERTIFICACOES } from './features/certificacoes/certificacoes.conteudo';
import { CONTEUDO_COMO_USO_IA } from './features/como-uso-ia/como-uso-ia.conteudo';
import { CONTEUDO_CONTATO } from './features/contato/contato.conteudo';
import { CONTEUDO_DIFERENCIAIS } from './features/diferenciais/diferenciais.conteudo';
import { CONTEUDO_EVENTOS } from './features/eventos/eventos.conteudo';
import { CONTEUDOS_EXPERIENCIAS } from './features/experiencias/experiencias.conteudo';
import { CONTEUDO_FORMACAO } from './features/formacao/formacao.conteudo';
import { CONTEUDO_IDIOMAS } from './features/idiomas/idiomas.conteudo';
import { CONTEUDO_INICIO } from './features/inicio/inicio.conteudo';
import { CONTEUDOS_SKILLS } from './features/skills/skills.conteudo';
import { CONTEUDO_SOBRE_MIM } from './features/sobre-mim/sobre-mim.conteudo';
import type { ConteudoDoEditor, Linha } from './shared/editor-de-codigo/conteudo';

/** Todas as páginas de todas as seções, com o nome que aparece nas falhas. */
export const DOCUMENTOS: readonly (readonly [string, ConteudoDoEditor])[] = [
  ['Início', CONTEUDO_INICIO],
  ['Sobre Mim', CONTEUDO_SOBRE_MIM],
  ['Diferenciais', CONTEUDO_DIFERENCIAIS],
  ['Como uso a IA', CONTEUDO_COMO_USO_IA],
  ...CONTEUDOS_SKILLS.map((c, i): [string, ConteudoDoEditor] => [
    `Skills ${i + 1}/${CONTEUDOS_SKILLS.length}`,
    c,
  ]),
  ...CONTEUDOS_EXPERIENCIAS.map((c, i): [string, ConteudoDoEditor] => [
    `Experiências ${i + 1}/${CONTEUDOS_EXPERIENCIAS.length}`,
    c,
  ]),
  ['Eventos', CONTEUDO_EVENTOS],
  ['Formação', CONTEUDO_FORMACAO],
  ['Idiomas', CONTEUDO_IDIOMAS],
  ['Contato', CONTEUDO_CONTATO],
  ...CONTEUDOS_CERTIFICACOES.map((c, i): [string, ConteudoDoEditor] => [
    `Certificações ${i + 1}/${CONTEUDOS_CERTIFICACOES.length}`,
    c,
  ]),
];

/** Texto de uma linha como o leitor vê: trechos de código ou o texto do Javadoc/parágrafo. */
export const textoDaLinha = (item: Linha): string => {
  switch (item.tipo) {
    case 'codigo':
      return item.trechos.map((t) => t.texto).join('');
    case 'javadoc':
    case 'paragrafo':
      return item.texto;
    default:
      return '';
  }
};

export const textoDe = (conteudo: ConteudoDoEditor): string =>
  conteudo.map(textoDaLinha).join('\n');

/** Só o código: sem textos entre aspas, comentários de linha e Javadoc (o que o compilador lê). */
export const codigoDe = (conteudo: ConteudoDoEditor): string =>
  conteudo
    .map((item) =>
      item.tipo === 'codigo'
        ? item.trechos
            .filter((t) => t.papel !== 'literal' && t.papel !== 'comentario')
            .map((t) => t.texto)
            .join('')
        : '',
    )
    .join('\n');

export const literaisDe = (conteudo: ConteudoDoEditor): readonly string[] =>
  conteudo.flatMap((item) =>
    item.tipo === 'codigo'
      ? item.trechos.filter((t) => t.papel === 'literal').map((t) => t.texto)
      : [],
  );

/** Os comentários `// ...` do código, sem o `//` inicial. */
export const comentariosDe = (conteudo: ConteudoDoEditor): readonly string[] =>
  conteudo.flatMap((item) =>
    item.tipo === 'codigo'
      ? item.trechos
          .filter((t) => t.papel === 'comentario')
          .map((t) => t.texto.replace(/^\s*\/\/\s*/, '').trim())
      : [],
  );

export const aspasRetas = (texto: string): string => texto.replace(/^"|"$/g, '');
