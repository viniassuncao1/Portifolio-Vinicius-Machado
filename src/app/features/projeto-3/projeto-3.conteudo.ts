import {
  comentario,
  comum,
  declaracao,
  javadoc,
  linha,
  linhaExecutavel,
  link,
  literal,
  palavraChave,
  valor,
  vazia,
} from '../../shared/editor-de-codigo/conteudo';
import type { ConteudoDoEditor } from '../../shared/editor-de-codigo/conteudo';

export const ENDERECO_DO_FORK = 'https://github.com/viniassuncao1/cleanyourtv';
const ENDERECO_DO_ORIGINAL = 'https://github.com/Gathin23/cleanyourtv';

/** O launcher de TV para Android 4.4, no estilo de leitura (ADR-0011). Não existe no design. */
export const CONTEUDO_PROJETO_3: ConteudoDoEditor = [
  vazia(),
  linha(0, palavraChave('package'), comum(' dev.vinicius.portfolio.projetos;')),
  vazia(),
  linha(0, palavraChave('import'), comum(' java.util.List;')),
  vazia(),
  javadoc(
    0,
    'Fork do CleanYourTV, do Gathin: um launcher Android em Java que troca a tela inicial cheia de anúncios por uma tela limpa. O original só roda a partir do Android 8. Levei para o Android 4.4, isolando o que depende de versões novas em classes chamadas só depois de checar a versão do sistema. Resolvi cerca de 70 avisos de compatibilidade, com os 42 testes do projeto passando. Testei numa TV Philco com 456 MB de RAM, com backup antes de tudo e um comando para desfazer cada mudança: dez apps desativados, nenhum desinstalado.',
  ),
  linhaExecutavel(0, palavraChave('public class'), comum(' LauncherDeTv {')),
  vazia(),
  linha(1, comentario('// Ficha do projeto')),
  linha(1, declaracao('String'), comum(' linguagem = '), literal('"Java"'), comum(';')),
  linha(
    1,
    declaracao('String'),
    comum(' plataforma = '),
    literal('"Android 4.4 (API 19)"'),
    comum(';'),
  ),
  linha(
    1,
    declaracao('List<String>'),
    comum(' ferramentas = List.of('),
    literal('"Android SDK"'),
    comum(', '),
    literal('"ADB"'),
    comum(', '),
    literal('"Claude Code"'),
    comum(');'),
  ),
  vazia(),
  linha(1, comentario('// Do Android 8 para o Android 4.4, sem quebrar os testes')),
  linha(1, palavraChave('int'), comum(' minSdkOriginal = '), valor('26'), comum(';')),
  linha(1, palavraChave('int'), comum(' minSdkNovo = '), valor('19'), comum(';')),
  linha(
    1,
    palavraChave('int'),
    comum(' avisosResolvidos = '),
    valor('70'),
    comum(';'),
    comentario(' // cerca de'),
  ),
  linha(1, palavraChave('int'), comum(' testesPassando = '), valor('42'), comum(';')),
  vazia(),
  linha(1, comentario('// Projeto original, de Gathin, e o meu fork com o guia do Android 4.4')),
  linha(
    1,
    declaracao('String'),
    comum(' original = '),
    link(literal(`"${ENDERECO_DO_ORIGINAL}"`), ENDERECO_DO_ORIGINAL),
    comum(';'),
  ),
  linha(
    1,
    declaracao('String'),
    comum(' repositorio = '),
    link(literal(`"${ENDERECO_DO_FORK}"`), ENDERECO_DO_FORK),
    comum(';'),
  ),
  vazia(),
  linha(0, comum('}')),
];
