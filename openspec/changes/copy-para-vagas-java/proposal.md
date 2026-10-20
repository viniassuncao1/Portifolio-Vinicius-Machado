# Proposal

## Why

O portfólio é lido por quem recruta para vagas de Desenvolvedor Full Stack Java + Angular e de
Desenvolvedor Backend Java. Uma revisão com o método da mentoria (✅ já aparece / ⚠️ existe mas
não aparece / ❓ falta) mostrou que:

- o cargo atual na Memora não cita nenhuma tecnologia, só liderança e Scrum;
- o Sobre Mim abre pela liderança e pela Watts, e não pela stack;
- os projetos mais alinhados às vagas (cases da Memora em Java e este portfólio em Angular)
  estão em 4º e 5º, atrás de duas landing pages;
- termos que o Vinicius usa no dia a dia (API REST, microsserviços, JPA, Spring Security, JUnit)
  não estão escritos.

O Vinicius também entregou um projeto novo em Java: o launcher de TV para Android 4.4.

## What Changes

- **Início**: cargo sem "Júnior", como recomenda a mentoria.
- **Sobre Mim**: resumo de 4 frases que abre pela stack (Java 21 e Spring Boot no back-end,
  Angular no front-end), depois a Memora, a Watts e a formação.
- **Experiências**: destaques técnicos no cargo atual da Memora (APIs REST em Java 21 e Spring
  Boot com JPA e Spring Security, microsserviços, Angular 17, GitLab CI/CD, liderança de squad) e
  palavras-chave no estágio.
- **Skills**: Spring Security nos frameworks e no domínio diário; JUnit no uso pontual.
- **Projetos**: nova ordem e um projeto novo, de 5 para 6 rotas:
  1. Cases da Memora · 2. Este portfólio · 3. Launcher de TV (novo) · 4. Ana · 5. Landing page da
  Dra. Juliana · 6. Landing page da Watts Company.
- Entrada 0022 do diário.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `secao-inicio`: cargo sem "Júnior".
- `secao-sobre-mim`: novo resumo profissional.
- `secao-experiencias`: destaques técnicos do cargo atual.
- `secao-skills`: Spring Security e JUnit.
- `secao-projetos`: nova ordem e o Projeto 3, launcher de TV.

## Impact

- Código: `features/inicio`, `sobre-mim`, `experiencias`, `skills`, `projeto-1` a `projeto-6`,
  `core/secoes.ts`, `core/previews.ts` e `app.routes.ts`.
- Endereços: `/projeto-N` passa a mostrar outro projeto. Links antigos continuam abrindo uma
  página válida, só que com outro conteúdo.
- Testes: unitários e E2E das seções e dos projetos.
- Documentação: entrada 0022 do diário.
