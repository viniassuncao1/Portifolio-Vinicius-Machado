# Equipe de agentes

O portfólio é desenvolvido por uma equipe de agentes de IA no
[Maestri](https://www.themaestri.app/pt-br), coordenada por mim. O motivo dessa organização está
no [ADR-0007](../adr/0007-equipe-de-agentes-no-maestri.md).

## Composição

| Papel        | Codinome  | Modelo            | Responsabilidade                                                |
| ------------ | --------- | ----------------- | --------------------------------------------------------------- |
| Maestro      | Regente   | Claude Opus 5.5   | Planeja (OpenSpec), delega, revisa, integra e abre PRs          |
| Design/UI    | Pincel    | Claude Sonnet 5.5 | Implementa componentes fiéis ao design, tokens e acessibilidade |
| Animações    | Compasso  | Claude Sonnet 5.5 | Transições, microinterações e `prefers-reduced-motion`          |
| Testes       | Sentinela | Claude Sonnet 5.5 | Testes unitários e E2E, cobertura e verificação das specs       |
| Documentação | Escriba   | Claude Sonnet 5.5 | README, `docs/`, ADRs e consistência dos artefatos do OpenSpec  |

Os prompts de cada papel estão em [`papeis/`](papeis/).

## Fluxo de uma mudança

```
Eu ──► Regente: "quero a seção X"
        │
        ├─ 1. cria a change no OpenSpec (proposal, specs, design, tasks)
        ├─ 2. espera a minha aprovação da change
        ├─ 3. cria a branch e delega as tarefas:
        │       Pincel    → componentes e estilos
        │       Compasso  → animações (depois do Pincel, nos mesmos componentes)
        │       Sentinela → testes (em paralelo, arquivos *.spec.ts e e2e/)
        │       Escriba   → documentação (em paralelo, docs/ e README)
        ├─ 4. revisa o resultado e roda: lint, test:ci, build, e2e
        └─ 5. abre o PR e, depois do merge, arquiva a change
```

## Regras da equipe

1. **Uma change do OpenSpec por vez.** Ninguém começa sem uma change aprovada por mim.
2. **Ninguém commita na `main`.** Todo trabalho acontece na branch da change.
3. **Arquivos diferentes, em paralelo; mesmos arquivos, em sequência.** O Regente garante isso ao
   delegar, para evitar conflitos na mesma cópia do repositório.
4. **Commits pequenos e em Conventional Commits**, um assunto por commit. Os hooks do Husky
   valem para todos.
5. **Cada especialista só mexe no próprio escopo.** Se precisar de algo fora dele, pede ao
   Regente.
6. **Pronto é verificado.** Uma tarefa só termina quando lint, testes e build passam.

## Notes e portals

A equipe compartilha contexto por **notes** e confere o resultado em **portals** (navegadores
embutidos no canvas do Maestri).

### Notes (fichário "Portfolio")

Todas as notes ficam conectadas aos quatro especialistas.

| Note          | Quem escreve                                             | Para que serve                                              |
| ------------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| Contexto      | Regente                                                  | Resumo do projeto: stack, regras principais, design e docs  |
| Change Atual  | Regente cria; cada especialista atualiza a própria linha | Change em andamento, branch, tarefas, responsáveis e status |
| Backlog       | Regente                                                  | Próximas demandas, em ordem                                 |
| Design Tokens | Pincel                                                   | Tokens do sistema visual, com o valor e a tela de origem    |

As notes são um quadro de trabalho, não a fonte da verdade: as decisões ficam nos artefatos do
OpenSpec, nos ADRs e no código.

### Portals

| Portal       | Tamanho   | Conectado a                  |
| ------------ | --------- | ---------------------------- |
| Site Desktop | 1920x1080 | Pincel, Compasso e Sentinela |
| Site Mobile  | 390x844   | Pincel, Compasso e Sentinela |

Os dois abrem `http://localhost:4200` (rode `npm start` antes). O tamanho desktop é o mesmo das
telas em `design/telas/`, para comparar lado a lado: o especialista captura o portal
(`maestri portal screenshot "Site Desktop"`) e confere com a tela correspondente. O Maestri ajusta
o tamanho ao zoom do canvas, então o viewport pode variar 1px.

## Como montar a equipe no Maestri

1. Abra a pasta do projeto no Maestri como workspace.
2. Não é preciso criar presets: a equipe usa o preset padrão `Claude Code` e escolhe o modelo
   pelo comando.
   - Regente: `claude --model opus`
   - Especialistas: `claude --model sonnet`
3. Abra um terminal com o preset `Claude Code` rodando `claude --model opus` e cole o conteúdo de
   [`papeis/regente.md`](papeis/regente.md), seguido de:
   > Monte a equipe descrita em `docs/equipe-de-agentes/README.md`: crie os papéis a partir dos
   > arquivos em `docs/equipe-de-agentes/papeis/` e recrute cada especialista com o preset
   > `Claude Code` e o comando `claude --model sonnet`.
4. O Regente cria um papel por arquivo, com o nome da coluna "Papel" da tabela
   (`maestri role create "Design/UI" "$(cat papeis/pincel.md)"`), e recruta cada especialista
   com o codinome dele:

   ```sh
   maestri recruit "Pincel" --preset "Claude Code" --command "claude --model sonnet" --role "Design/UI"
   ```

   Os especialistas já aparecem conectados a ele no canvas. A pasta `.maestri/`, onde o Maestri
   guarda os papéis, é local e fica fora do Git.

5. Crie os portals e as notes descritos em [Notes e portals](#notes-e-portals) e conecte-os aos
   especialistas:

   ```sh
   maestri portal create http://localhost:4200 "Site Desktop" --size 1920x1080
   maestri note create "..." --name "Contexto" --stack "Portfolio"
   maestri connect "Pincel" "Site Desktop"
   ```
