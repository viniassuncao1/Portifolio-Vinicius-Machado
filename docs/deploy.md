# CI/CD e deploy

Este documento explica como o código sai do meu computador e chega ao ar. Tudo é automatizado
pelo GitHub Actions no arquivo [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## Visão geral

```
                ┌─────────────────────────── CI ───────────────────────────┐   ┌──── CD ────┐
 Pull Request ──┤ qualidade │ testes-unitarios │ build-e2e  (em paralelo)  ├──►│ preview    │──► URL temporária no PR
                └──────────────────────────────────────────────────────────┘   └────────────┘
 push na main ──┤               mesmos três jobs                           ├──►│ produção   │──► site oficial
                └──────────────────────────────────────────────────────────┘   └────────────┘
```

- **CI (Integração Contínua):** verifica se o código pode entrar na `main`. Não publica nada.
- **CD (Deploy Contínuo):** publica o site, e só roda se **todos** os jobs de CI passarem
  (`needs: [qualidade, testes-unitarios, build-e2e]`).

## Conceitos do GitHub Actions

| Conceito      | No nosso workflow                                                               |
| ------------- | ------------------------------------------------------------------------------- |
| `on`          | Gatilhos: `pull_request` e `push` na `main`                                     |
| `jobs`        | Rodam em paralelo, cada um numa máquina virtual nova (`runs-on: ubuntu-latest`) |
| `steps`       | Rodam em sequência dentro de um job                                             |
| `uses`        | Ação pronta do Marketplace (ex.: `actions/checkout` baixa o código)             |
| `run`         | Comando de terminal                                                             |
| `needs`       | Dependência entre jobs: o deploy espera os jobs de CI                           |
| `if`          | Condição: preview só em PR, produção só em push na `main`                       |
| `secrets`     | Valores sensíveis, guardados criptografados no GitHub                           |
| `environment` | Agrupa deploys (preview/production) e mostra a URL no PR                        |
| `concurrency` | Em PR, um push novo cancela a execução antiga; na `main`, nunca cancela         |
| `permissions` | O workflow só tem permissão de leitura no repositório                           |

## Deploy na Vercel

O deploy usa a CLI da Vercel em três passos:

```bash
vercel pull --yes --environment=preview   # baixa as configurações do projeto
vercel build                              # gera o build no runner, em .vercel/output
vercel deploy --prebuilt                  # envia o build pronto e imprime a URL
```

Em produção, os mesmos comandos levam `--environment=production` e `--prod`.

**Por que não usar a integração Git automática da Vercel?** Ela publicaria a cada push mesmo com
testes falhando, e o processo ficaria escondido no painel da Vercel. Aqui o deploy faz parte do
pipeline e só acontece com tudo verde.

### Configuração versionada (`vercel.json`)

| Campo             | Valor                       | Motivo                                                            |
| ----------------- | --------------------------- | ----------------------------------------------------------------- |
| `installCommand`  | `npm ci`                    | Instala exatamente as versões do `package-lock.json`              |
| `buildCommand`    | `npm run build`             | O mesmo build testado no E2E                                      |
| `outputDirectory` | `dist/portfolio/browser`    | Pasta gerada pelo Angular                                         |
| `rewrites`        | `/(.*)` → `/index.csr.html` | Rotas inexistentes abrem a aplicação, que redireciona para a home |

### Secrets necessários

Cadastrados em **Settings → Secrets and variables → Actions**:

| Secret              | O que é                              | Onde obter                                |
| ------------------- | ------------------------------------ | ----------------------------------------- |
| `VERCEL_TOKEN`      | Autoriza o deploy na conta da Vercel | vercel.com → Account Settings → Tokens    |
| `VERCEL_ORG_ID`     | Identifica a conta/time              | `.vercel/project.json` após `vercel link` |
| `VERCEL_PROJECT_ID` | Identifica o projeto                 | `.vercel/project.json` após `vercel link` |

O token nunca vai para o código nem para os logs (o GitHub o mascara como `***`). PRs vindos de
forks não recebem secrets, por isso o job de preview só roda em PRs do próprio repositório.

## Como reproduzir do zero

```bash
npm install -g vercel
vercel login
vercel link          # cria o projeto; responda "no" para conectar o repositório Git
vercel pull --yes --environment=preview
vercel build         # teste local: o resultado sai em .vercel/output/static
```

Depois, crie o token e cadastre os três secrets no GitHub.

## Rollback

- Reverter o commit na `main`: o pipeline publica a versão anterior.
- Emergência: `vercel rollback` (ou "Promote" de um deploy antigo no painel da Vercel) volta a
  produção na hora, sem esperar o pipeline.
