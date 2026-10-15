# Diário de desenvolvimento

Aqui eu registro a construção do portfólio, **change a change**. Cada entrada conta o problema,
o que decidi, o que descartei e o que aprendi, e traz um rascunho de post para o LinkedIn.

O motivo está no [ADR-0008](../adr/0008-diario-de-desenvolvimento.md): o portfólio é uma vitrine
e eu quero mostrar o processo, não só o resultado.

## Regras

- Toda change do OpenSpec tem uma entrada, criada no mesmo Pull Request da change, antes do
  merge.
- O arquivo se chama `NNNN-nome-da-change.md`, com a numeração em sequência.
- O rascunho do post é revisado por mim antes de ser publicado.
- Só entram fatos do projeto. Nada de números ou resultados inventados.

## Entradas

| Entrada                                             | Data       | Resumo                                                                                                               |
| --------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------- |
| [0001](0001-fundacao-do-projeto.md)                 | 2026-10-08 | Angular 22 pré-renderizado, CI/CD na Vercel, ADRs, OpenSpec e equipe de IA.                                          |
| [0002](0002-fundacao-visual-e-casca-da-ide.md)      | 2026-10-09 | Tokens, casca da IDE como rota-pai, editor de código com dados tipados, gaveta no celular e axe.                     |
| [0003](0003-secoes-sobre-mim-e-diferenciais.md)     | 2026-10-09 | Primeiras seções só com dados, papel de sintaxe `valor`, parágrafo em 72 colunas e mapa de features.                 |
| [0004](0004-secoes-como-uso-ia-e-skills.md)         | 2026-10-09 | Seções de IA e Skills, páginas com endereço próprio, densidade das linhas e correção do nome da classe.              |
| [0005](0005-experiencia-de-ide-e-java-moderno.md)   | 2026-10-09 | Design como referência (ADR-0010), experiência de IDE, Java moderno e a equipe com seis especialistas.               |
| [0006](0006-certificacoes-niveis-e-legibilidade.md) | 2026-10-09 | Escala de 23px para ~17px só por tokens, Java legível, Certificações e níveis em Skills.                             |
| [0007](0007-projetos-e-janela-de-preview.md)        | 2026-10-13 | Janela de preview com captura primeiro e ao vivo sob demanda, botão Executar e os quatro projetos.                   |
| [0008](0008-secao-depoimentos.md)                   | 2026-10-13 | Última seção com a primeira recomendação real, Javadoc com parágrafos e as 15 seções completas.                      |
| [0009](0009-seo-e-compartilhamento.md)              | 2026-10-13 | Metadados Open Graph, descrição por seção, JSON-LD, sitemap no build e o cartão de compartilhamento.                 |
| [0010](0010-tokens-e-tipografia-intellij.md)        | 2026-10-13 | Identidade do IntelliJ New UI (ADR-0011) quase só por tokens: paleta Dark, Inter e JetBrains Mono, escala compacta.  |
| [0011](0011-design-original-com-icones-e-git.md)    | 2026-10-14 | Virada de rumo (ADR-0012): o design original volta, com pastas, Git, ▶ na calha e a tipografia compacta do IntelliJ. |
| [0012](0012-painel-do-git.md)                       | 2026-10-14 | Painel do Git com o histórico real do repositório, gerado no build, sem token e sem e-mails (ADR-0013).              |
| [0013](0013-tema-claro.md)                          | 2026-10-14 | Tema claro por tokens, aplicado antes da primeira pintura por um script inline, e contraste ajustado (ADR-0014).     |
| [0014](0014-janela-de-run-e-java-para-leitura.md)   | 2026-10-14 | Janela de Run com o log do Spring e Java para leitura: domínio em português e PortfolioApplication.java.             |
| [0015](0015-fotos-de-perfil.md)                     | 2026-10-14 | Retrato redondo no Javadoc do editor: fotos do Vinicius e da Luana, com @author linkando o LinkedIn.                 |
| [0016](0016-boas-vindas-repositorio-e-ux.md)        | 2026-10-14 | Auditoria de UX: tela de boas-vindas, repositório no estilo do GitHub e melhorias de leitura e navegação.            |
| [0017](0017-abertura-com-run.md)                    | 2026-10-15 | A abertura vira rodar o projeto: splash, Run, build das classes e log do Spring, sem pular (ADR-0017).               |

## Modelo de entrada

```markdown
# NNNN: <título da change>

- **Data:** AAAA-MM-DD
- **Change:** <link para a change em openspec/>
- **PR:** <link>
- **ADRs:** <links, se houver>

## Problema

O que precisava ser resolvido e por quê.

## Decisões

O que foi decidido e quais alternativas foram descartadas, com o motivo.

## Aprendizado

O que aprendi, inclusive o que deu errado.

## Links

Change, Pull Request e ADRs relacionados.

## Rascunho de post para o LinkedIn

Texto em pt-BR, na primeira pessoa, com gancho na primeira linha, de 150 a 250 palavras,
terminando com uma pergunta ao leitor e com no máximo 3 hashtags.
```
