# Design

## Contexto

Mudança de conteúdo, sem componente novo. As decisões abaixo saem da revisão do texto com a
skill de mentoria de busca de emprego e das respostas do Vinicius.

## Decisões

### Ordem dos projetos trocando o conteúdo entre as rotas

Os projetos são as rotas genéricas `/projeto-1` a `/projeto-N`, e a ordem da árvore é a ordem de
`SECOES`. Para reordenar sem quebrar o padrão `ProjetoN.java`, o conteúdo muda de pasta:

| Rota         | Antes                     | Depois                     |
| ------------ | ------------------------- | -------------------------- |
| `/projeto-1` | Ana                       | Cases da Memora            |
| `/projeto-2` | LP da Dra. Juliana        | Este portfólio             |
| `/projeto-3` | LP da Watts Company       | Launcher de TV (novo)      |
| `/projeto-4` | Cases da Memora           | Ana                        |
| `/projeto-5` | Este portfólio            | LP da Dra. Juliana         |
| `/projeto-6` | (não existia)             | LP da Watts Company        |

Alternativa descartada: slugs descritivos (`/cases-memora`...). Mudaria o padrão dos arquivos, a
árvore e os redirecionamentos de endereços antigos sem ganho para quem recruta.

### Fatos usados

Só entram fatos confirmados pelo Vinicius ou pelo README do fork da TV:

- Memora hoje: APIs em Java 21 e Spring Boot com repositórios JPA e Spring Security, em
  microsserviços (login, gateway, financeiro, RH, entre outros); componentes em Angular 17
  integrados às APIs por services; GitLab CI/CD, Docker e Kubernetes em servidores locais; Scrum;
  liderança de squad (dúvidas, planejamento e revisão de merge requests de trainees e
  estagiários).
- JUnit: começou a usar há pouco, por isso entra em "uso pontual".
- TV: fork do CleanYourTV (Gathin, MIT), launcher Android em Java, `minSdk` de 26 para 19, o que
  depende de Android 5.0+ isolado em classes chamadas depois de checar a versão, cerca de 70
  avisos de compatibilidade resolvidos, 42 testes passando, testado em uma TV Philco com Android
  4.4 e 456 MB de RAM, com backup e comando de reversão para cada passo.

### Cargo sem "Júnior" só no Início

A mentoria pede o cargo-alvo sem "Júnior" na apresentação. Na experiência da Memora o cargo
continua o real ("Desenvolvedor Full Stack Júnior").

### Projeto da TV sem preview

Não há site para abrir. O `▶ Executar` usa link externo para o repositório no GitHub, como o
projeto do portfólio.
