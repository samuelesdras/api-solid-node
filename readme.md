## App

    GymPass style app.

## RFs (requisitos funcionais)

- Deve ser possível se cadastrar
- Deve ser possível se autenticar
- Deve ser possível obter o perfil de um usuário logado
- Deve ser possivel obter o número de check-ins realizados pelo usuário logado
- Deser ver possível o usuário obter o seu histórico de check-ins
- Deve ser possível o usuário buscar academias próximas
- Deve ser possível o usuário buscar academias pelo nome
- Deve ser possível o usuário realiar o check-in em uma academia
- Deve ser possível validar o check-in de um usuário
- Deve ser possível cadastrar uma academia

## RN (regras de negócio)

- O usuário não deve ser cadastrado com um email duplicado
- O usuário não pode fazer dois check-ins no mesmo dia
- O usuário não pode fazer check-in se não estiver perto (100m) da academai
  - O check-in só pode ser validado até 20 minutos após criado
- O check-in só pode ser validado por um administrador
- A academia só pode ser cadastrada por administradores

## RNFs (Requisitos não-funcionais)

- A senha do usuário precisa estar criptografada
- O dados da aplicação precisam estar persistidos em um banco postgres
- Todas as listas de dados precisam estar paginadas com 20 items por página
- O usuário deve ser identificado por um jwt (json web token)

## libs:

- npm i typescript @types/node tsx tsup -D
- npm i fastify dotenv zod
- npx tsc --init cria o arquivo tsconfig.json e colocar o "target":"es2020"

## Anotations

## prisma

- npx prisma -h
- npx prisma init
- npx prisma generate -> Cria as funções que o orm prisma vai usar para acessar a tabela recem gerada. Fica em node_modules/.prisma/client/schema.prisma
- npm i @prisma/client -> é o que vai acessar o db
- npx prisma migrate dev -> olha o que tem no schema.prisma e persiste no banco

## docker

hub.docker.com -> exemplos de containers com configuração inicial feita

- comando para rodar/criar o container:
  docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=apisolid -p 5432:5432 bitnami/postgresql:latest

- comando para listar os containers
  docker ps -a
- docker start/stop nomeDoContainer para iniciar/parar um container
  docker start api-solid-pg

- Para excluir um cotainer:
  docker rm nomeDoContainer

- Ver logs
  docker logs nomeDoContainer

- Quando tem o arquivo docker-compose.yml
  docker compose up -d //Sem este -d, vai mostrar os logs

- Para parar o container
  docker compose stop

- Para excluir o container
  docker compose down

## bcryptjs

- npm i bcryptjs
- npm i -D @types/bcryptjs

## testes
