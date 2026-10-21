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
import { EVENTOS } from '../../core/perfil';
import type { ConteudoDoEditor, Linha } from '../../shared/editor-de-codigo/conteudo';

const evento = (nome: string, vezes: number, ultimo: boolean): Linha =>
  linha(
    2,
    palavraChave('new'),
    comum(' Evento('),
    literal(`"${nome}"`),
    comum(', '),
    valor(String(vezes)),
    comum(ultimo ? ')' : '),'),
    ...(vezes > 1 ? [comum('  '), comentario(`// ${vezes}x`)] : []),
  );

/** Conteúdo da tela 22 (design/telas/tela-22.png), no estilo de leitura (ADR-0011): domínio em português, sem `static final`. */
export const CONTEUDO_EVENTOS: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.formacao;')),
  vazia(),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  linha(0, palavraChave('public class'), comum(' Eventos {')),
  vazia(),
  linha(1, comentario('// Cada evento tem o nome e quantas vezes eu participei')),
  linha(
    1,
    palavraChave('record'),
    comum(' Evento('),
    declaracao('String nome'),
    comum(', '),
    declaracao('int vezes'),
    comum(') {}'),
  ),
  vazia(),
  linha(1, comentario('// Eventos de tecnologia dos quais participei')),
  linha(1, declaracao('List<Evento>'), comum(' participei = List.of(')),
  ...EVENTOS.map((e, i) => evento(e.nome, e.vezes, i === EVENTOS.length - 1)),
  linha(1, comum(');')),
  vazia(),
  linha(0, comum('}')),
];
