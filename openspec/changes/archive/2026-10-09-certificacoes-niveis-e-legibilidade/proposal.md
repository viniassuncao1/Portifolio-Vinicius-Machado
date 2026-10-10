# Proposal

## Why

Faltam as seções de Certificações e de Níveis de conhecimento. E, olhando o site no ar, o
Vinicius apontou dois problemas: o texto da IDE está grande demais (código em 23px) e o Java
moderno ficou técnico demais para quem não é desenvolvedor. O portfólio é lido por
recrutadores: o código deve seguir o padrão Java e ainda assim ser entendido por qualquer
pessoa.

## What Changes

- **Certificações** (telas 19 a 21): os nove cursos, com carga horária e data de conclusão, do
  mais recente para o mais antigo.
- **Níveis de conhecimento** (telas 23 a 27) como **página 3 de Skills**: os quatro níveis
  (domínio diário, projeto completo, uso pontual e conhecimento teórico), cada um explicado em
  pt-BR, com as tecnologias de cada nível. No design eles aparecem sob "Formação"; ficam em
  Skills porque falam da stack (ADR-0010).
- **Escala menor**: código em cerca de 17px (hoje 23px), árvore e abas em cerca de 16px, com
  alturas de linha, recuos e larguras proporcionais. Decisão do Vinicius.
- **Legível para qualquer pessoa**: o código continua Java válido e no padrão de mercado, mas
  com menos cerimônia: nomes autoexplicativos, listas curtas numa linha, comentários em pt-BR
  dizendo o que cada parte significa e sem construções que só um desenvolvedor lê
  (`URI.create`, `Optional.empty`, genéricos aninhados). As dez seções publicadas são
  revisadas nesse estilo.
- Entrada 0006 do diário.

## Capabilities

### New Capabilities

- `secao-certificacoes`: conteúdo da seção Certificações.

### Modified Capabilities

- `secao-skills`: passa a ter a página 3 com os níveis de conhecimento.
- `conteudo-em-java-moderno`: acrescenta a exigência de legibilidade para quem não é
  desenvolvedor.
- `sistema-visual`: acrescenta a escala da tipografia.

## Impact

- Código: `src/styles/_tokens.scss` (escala), `features/certificacoes/`, `features/skills/`
  (página 3, `paginas: 3`), os conteúdos das dez seções e o registro da rota.
- Testes: unitários e E2E das seções novas e das revisadas; axe nas rotas novas.
- Documentação: `docs/componentes.md` (regra de legibilidade), entrada 0006 do diário.
