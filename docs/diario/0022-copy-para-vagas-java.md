# 0022: Textos para vagas Java

- **Data:** 2026-10-19
- **Change:** [copy-para-vagas-java](../../openspec/changes/copy-para-vagas-java/)
- **PR:** [#40](https://github.com/viniassuncao1/Portifolio-Vinicius-Machado/pull/40)
- **Testes:** 790 testes unitários e 887 testes E2E
- **ADRs:** nenhum novo.

## Problema

O portfólio é lido por quem recruta para vagas de Full Stack Java + Angular e de Backend Java.
Revisei os textos com o método da mentoria: o que já aparece, o que existe mas não aparece e o que
falta. O cargo atual na Memora não citava nenhuma tecnologia, o Sobre Mim abria pela liderança e os
dois projetos mais próximos dessas vagas estavam em 4º e 5º, atrás de duas landing pages.

## Decisões

- **Sobre Mim em quatro frases:** a stack primeiro (Java 21 e Spring Boot no back-end, Angular no
  front-end), depois a Memora, a Watts Company e a formação.
- **Memora com a stack do dia a dia:** APIs REST com Spring Data JPA e Spring Security em
  microsserviços, componentes em Angular 17, GitLab CI/CD com Docker e Kubernetes, e a liderança de
  squad.
- **Cargo sem "Júnior" só na apresentação.** Na experiência, o cargo continua o real.
- **Projetos em nova ordem, trocando o conteúdo entre as rotas:** cases da Memora, este portfólio,
  o launcher de TV, a Ana e as duas landing pages. Slugs descritivos foram descartados porque
  mudariam o padrão `ProjetoN.java` sem ganho para quem lê.
- **Projeto novo, o launcher de TV:** fork do CleanYourTV levado do Android 8 para o Android 4.4,
  em Java. O `▶ Executar` abre o repositório no GitHub.
- **JUnit em "uso pontual",** porque o uso começou há pouco.

## Aprendizado

- **Texto também tem público-alvo.** O mesmo conteúdo, reordenado, conversa melhor com a vaga.
- **Fato antes de palavra-chave.** Cada termo novo veio de uma resposta do Vinicius, não de uma
  lista de vagas.

## Links

- Change: [`openspec/changes/copy-para-vagas-java`](../../openspec/changes/copy-para-vagas-java/)
- Entrada anterior: [0021 ícone com iniciais](0021-icone-com-iniciais.md)

## Rascunho de post para o LinkedIn

> Reescrevi os textos do meu portfólio pensando em quem lê, e não em quem escreve.
>
> O cargo atual na Memora não citava nenhuma tecnologia. Só falava de liderança e Scrum. Agora ele
> diz o que eu faço no dia a dia: APIs REST em Java 21 e Spring Boot, com JPA e Spring Security, em
> microsserviços, e componentes em Angular 17 que consomem essas APIs.
>
> Os projetos também mudaram de ordem. Os cases em Java e o próprio portfólio em Angular estavam em
> 4º e 5º, atrás de duas landing pages. Agora abrem a lista.
>
> E entrou um projeto novo: um launcher de TV em Java, levado do Android 8 para o Android 4.4, com os
> 42 testes do projeto passando.
>
> Nada foi inventado. Cada palavra nova veio de algo que eu já faço.
>
> Qual seção do seu portfólio diz menos do que você faz de verdade?
>
> #Java #SpringBoot #Angular
