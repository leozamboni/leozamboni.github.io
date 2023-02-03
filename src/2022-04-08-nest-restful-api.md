% [pt-br] RESTful API com NestJS, Docker Compose, Postgres, TypeORM e Swagger
% Leonardo Z. N.
% 08/04/2022

Esse post é um tutorial onde vou mostrar como construir uma [RESTful API](https://en.wikipedia.org/wiki/Representational_state_transfer). Não vou abordar assuntos teóricos - _e nem assuntos básicos como: como usar o terminal, vscode, JavaScript, TypeScript, .._ - mas eles têm alguma importância caso você nunca tenha visto nada parecido antes. Se esse for o caso, uma leitura nos artigos da wikipedia - _ou suas respectivas documentações_ - sobre o assunto será suficiente.

[comment]: # "Tecs:"

[comment]: # (- [NestJS](#nestjs);)
[comment]: # (- [Docker](#docker);)
[comment]: # (- [Docker Compose](#docker-compose);)
[comment]: # (- [Postgres](#postgres);)
[comment]: # (- [TypeORM](#typeorm);)
[comment]: # (- [pgAdmin](#pgadmin);)
[comment]: # (- [CRUD](#crud);)
[comment]: # (- [Swagger](#swagger).)

# NestJS

Antes de tudo, eu vou usar o yarn mas você pode usar o npm ou qualquer outro package manager basta trocar yarn pelo mesmo. Precisamos instalar o [docker](https://docs.docker.com/engine/install/ubuntu/) e o [docker compose](https://docs.docker.com/compose/install/) também.

Depois vamos instalar o NestJS:

```
yarn global add @nestjs/cli
```

e criaremos nosso projeto com o yarn:

```
nest new nest_api
```

# Docker

Agora chegou a hora de configurarmos nossos containers. Primeiro crie um arquivo **Dockerfile**. Ele é responsável pela nossa imagem principal.

```
nest_api/
├── node_modules/
├── src/
├── test/
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── Dockerfile <---
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

Dentro dele:

```
# Dockerfile:
# Esse arquivo está dizendo para o docker que usaremos uma imagem base para a criação do nosso container;
FROM node:17
# Que o diretório do mesmo será /home/api;
WORKDIR /home/api
# Onde copiamos os arquivos package.json e yarn.lock para dentro do diretório;
COPY package.json .
COPY yarn.lock .
# Logo em seguida instalaremos as dependências;
RUN yarn install
# Copiamos o resto dos arquivos para dentro dele;
COPY . .
# E para finalizar iniciaremos a aplicação.
CMD yarn start:dev
```

Agora você pode rodar o comando para ver se tudo está funcionando:

```
docker build -t nest_api .
```

Se a saída no final for _Successfully built_ e _Successfully tagged_ podemos seguir para o próximo passo.

# Docker Compose

Crie um arquivo chamado **docker-compose.dev.yml**.
Perceba que até agora nós apenas estamos configurando nosso ambiente de desenvolvimento. Para outros ambientes a configuração não será a mesma.

```
nest_api/
├── node_modules/
├── src/
├── test/
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── docker-compose.dev.yml <---
├── Dockerfile
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

Dentro dele:

```
# docker-compose.dev.yml:
# Basicamente aqui estamos criando 3 containers para nossa aplicação:
# O primeiro para a api;
# Outro para o postgres;
# E o último para o pgadmin. Que nos ajudará a gerenciar o banco de dados.
version: "3.8"
services:
  api:
      container_name: nest-tutorial-api
      build: .
      # Como em nosso container as portas são diferentes, mapeamos elas:
      ports:
          - "3000:3000"
      volumes:
          - .:/home/api
          - /home/api/node_modules
      networks:
          - nest_api_tutorial

  pgadmin:
      container_name: nest-tutorial-pgadmin
      # Imagem base para o container do pgAdmin:
      image: dpage/pgadmin4
      restart: unless-stopped
      # Acesso ao pgAdmin:
      environment:
          PGADMIN_DEFAULT_EMAIL: 'admin@admin.com.br'
          PGADMIN_DEFAULT_PASSWORD: root
      ports:
          - 16543:80
      depends_on:
          - postgres
      networks:
          - nest_api_tutorial

  postgres:
      container_name: nest-tutorial-postgres
      # Imagem base para o container do Postgres:
      image: postgres:latest
      ports:
          - "3500:5432"
      # Acesso ao banco de dados:
      environment:
          POSTGRES_USER: user
          POSTGRES_PASSWORD: root
          POSTGRES_DB: db
      networks:
          - nest_api_tutorial

# Definimos que os containers compartilharão de um uma mesma rede interna.
networks:
  nest_api_tutorial:
```

Agora para criarmos nossos containers:

```
docker-compose -f docker-compose.dev.yml up
```

Se tudo der certo após alguns segundos já será possível visualizar nossos containers rodando na extensão do docker para vscode ou com o comando:

```
docker ps
```

# Postgres

```
yarn add pg
```

Para configurarmos nossa API com o Postgres primeiro criaremos um arquivo chamado **dev.env**.

```
nest_api/
├── node_modules/
├── src/
├── test/
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── dev.env <---
├── docker-compose.dev.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

Com as variáveis:

```
# dev.env:
# DATABASE

POSTGRES_HOST=postgres
POSTGRES_USERNAME=user
POSTGRES_PASSWORD=root
POSTGRES_DATABASE=db
```

Esse arquivo deve seguir com as informações contidas no nosso container. Onde _POSTGRES_HOST_ é o nome da imagem.

# TypeORM

Para fazer a conexão com o banco primeiro adicione o TypeORM. Também vamos precisar do dotenv no nosso projeto:

```
yarn add @nestjs/typeorm typeorm dotenv
```

Agora crie uma pasta dentro do diretório _src_ chamada **config** e dentro dela o arquivo **orm.config.ts**.

```
nest_api/
├── node_modules/
├── src/
  ├── config/
      └── orm.config.ts <---
  ├── app.controller.spec.ts
  ├── app.controller.ts
  ├── app.module.ts
  ├── app.service.ts
  └── main.ts
├── test/
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── dev.env
├── docker-compose.dev.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

```
// orm.config.ts:
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Models from '../models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  path: __dirname + '/./../../dev.env',
});

export const ormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: 5432,
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: [...Object.keys(Models).map((key) => Models[key])],
  synchronize: true,
};
```

Aqui estamos conectando nossa aplicação com as variáveis de desenvolvimento contidas no arquivo _dev.env_.
Mas ainda não passamos essas informações para nossa API. Para isso no arquivo **app.modules.ts** importe nossa variável no array _imports_ do nosso module:

```
@Module({
  imports: [TypeOrmModule.forRoot(ormConfig)],
  controllers: [AppController],
  providers: [AppService],
})
```

Agora para saber se tudo está funcionando corretamente vamos rodar o comando:

```
docker-compose -f docker-compose.dev.yml up --build
```

Se tudo estiver certo devemos receber _Nest application successfully started_ no log do container da API.

# pgAdmin

Com os containers rodando podemos acessar o banco pelo pgAdmin. Vamos entrar no endereço _http://localhost:16543/_ e conectar com as informações que passamos no arquivo do docker compose:

> email: admin@admin.com.br
>
> senha: root

Vamos criar um server com nome "Tutorial" e na aba _connection_ vamos colocar as variáveis que conectamos nossa API:

> Host: postgres
>
> Username: user
>
> Password: root

Com isso já podemos administrar nosso banco pelo pgAdmin.

# CRUD

Vamos aproveitar a implementação do CRUD para já documentarmos nossa API com o Swagger:

```
yarn add @nestjs/swagger
```

Para criarmos um CRUD simples na nossa API - _sem levar em consideração autenticação_ - vamos primeiro criar uma model.
Para nossa API ficar mais organizada criaremos uma pasta **models** dentro do diretório _src_ e os arquivos: **example.model.ts** e **index.ts**:

```
nest_api/
├── node_modules/
├── src/
  ├── config/
  ├── models/
      ├── example.model.ts <---
      └── index.ts <---
  ├── app.controller.spec.ts
  ├── app.controller.ts
  ├── app.module.ts
  ├── app.service.ts
  └── main.ts
├── test/
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── dev.env
├── docker-compose.dev.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

Uma model é a representação da nossa tabela no banco de dados.
Vamos criar uma tabela simples para usarmos como exemplo.
Com apenas três campos:

- Um campo _id_ do tipo _number_;
- Um campo _name_ do tipo _string_;
- E um campo _age_ do tipo _number_.

```
// example.model.ts:
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Example {
 @PrimaryGeneratedColumn()
 id!: number;

 @Column()
 name: string;

 @Column()
 age: number;

 constructor(example: Partial<Example>) {
   Object.assign(this, example);
 }
}

```

```
// index.ts:
export * from './example.model';
```

Agora para criar o CRUD em si vamos usar o comando:

```
nest g resource example
```

No arquivo _create-example.dto_ dentro da pasta _dto_ no diretório criado:

```
// create-example.dto:
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateExampleDto {
 @ApiProperty()
 @IsNumber()
 id?: number;

 @ApiProperty()
 @IsString()
 @IsNotEmpty()
 @MaxLength(200)
 name: string;

 @ApiProperty()
 @IsNumber()
 @IsNotEmpty()
 age: number;
}
```

E no arquivo _example.service.ts_:

```
// example.service.ts:
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Example } from 'src/models';
import { Repository } from 'typeorm';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Injectable()
export class ExampleService {
 constructor(
   @InjectRepository(Example)
   private readonly exampleRepository: Repository<Example>,
 ) {}

 create(createExampleDto: CreateExampleDto) {
   return this.exampleRepository.save(createExampleDto);
 }

 findAll() {
   return this.exampleRepository.find();
 }

 findOne(id: number) {
   return this.exampleRepository.findOneBy({ id: id });
 }

 update(id: number, updateExampleDto: UpdateExampleDto) {
   return this.exampleRepository.update(id, updateExampleDto);
 }

 remove(id: number) {
   return this.exampleRepository.delete(id);
 }
}
```

Se tudo funcionou como o esperado você vai poder visualizar a tabela _example_ no banco de dados através do pgAdmin.

# Swagger

Com o Swagger já instalado, no arquivo _main.ts_:

```
// main.ts:
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
 const app = await NestFactory.create(AppModule);

 const config = new DocumentBuilder()
   .setTitle('Example')
   .setDescription('The Example API description')
   .setVersion('1.0')
   .addTag('Example Api')
   .build();

 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, document);

 await app.listen(3000);
}
bootstrap();
```

Pronto. Se tudo deu certo você já vai poder visualizar e testar sua API através do Swagger no endereço _http://localhost:3000/api_.

[Código completo do tutorial](https://github.com/leozamboni/docker-nest-boilerplate).
