# ADR-0006: Regras de código para a IA com o ECC

- **Status:** Aceito
- **Data:** 2026-10-08

## Contexto

Os agentes de IA precisam seguir os mesmos padrões de código que um desenvolvedor seguiria:
imutabilidade, tratamento de erros, testes, segurança e acessibilidade. Escrever essas regras do
zero seria trabalhoso e incompleto.

## Decisão

Usar o **ECC** (pacote de agentes, skills e regras para o Claude Code) como base de regras.

- Ficam **versionadas** só as regras que se aplicam a este projeto, em `.claude/rules/ecc/`:
  `common`, `typescript`, `angular` e `web`.
- O restante do pacote (dezenas de agentes, skills e comandos de outras linguagens) é instalado
  localmente e fica fora do Git (`.gitignore`), para não poluir o repositório com código que não
  é do projeto.
- As convenções específicas do portfólio ficam no `CLAUDE.md` e prevalecem sobre as regras
  genéricas.

## Alternativas consideradas

- **Só o `CLAUDE.md`:** funciona, mas eu teria que reescrever regras que o ECC já cobre bem.
- **Versionar o ECC inteiro:** o GitHub mostraria milhares de linhas que não são deste projeto.

## Consequências

- Quem clona o repositório tem as regras usadas pela IA, mas não as ferramentas locais. Para
  reproduzir o ambiente completo, é preciso instalar o ECC.
- Atualizar o ECC exige revisar as regras versionadas.
