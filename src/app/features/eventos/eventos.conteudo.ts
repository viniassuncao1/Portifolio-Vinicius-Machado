import {
  comentario,
  comum,
  declaracao,
  linha,
  literal,
  palavraChave,
  valor,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor, Linha } from '../../shared/editor-de-codigo/conteudo';

const evento = (nome: string, vezes: number, ultimo: boolean): Linha =>
  linha(
    2,
    palavraChave('new'),
    comum(' Event('),
    literal(`"${nome}"`),
    comum(', '),
    valor(String(vezes)),
    comum(ultimo ? ')' : '),'),
    ...(vezes > 1 ? [comum('  '), comentario(`// ${vezes}x`)] : []),
  );

/** Conteúdo da tela 22 (design/telas/tela-22.png), com a lista como `List.of` de records. */
export const CONTEUDO_EVENTOS: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  linha(0, palavraChave('public class'), comum('  Events {')),
  vazia(),
  linha(1, comentario('// Cada evento tem o nome e quantas vezes eu participei')),
  linha(
    1,
    palavraChave('record'),
    comum(' Event('),
    declaracao('String name'),
    comum(', '),
    declaracao('int times'),
    comum(') {}'),
  ),
  vazia(),
  linha(1, comentario('// Eventos de tecnologia dos quais participei')),
  linha(1, palavraChave('static final'), declaracao(' List<Event>'), comum(' ATTENDED = List.of(')),
  evento('Brasília IT', 1, false),
  evento('Campus Party Brasília', 2, false),
  evento('BB Digital Week', 1, true),
  linha(1, comum(');')),
  vazia(),
  linha(0, comum('}')),
];
