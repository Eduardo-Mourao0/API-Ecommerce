# API Ecommerce

API REST de ecommerce desenvolvida com **Node.js**, **Express**, **TypeScript**, **Prisma** e **PostgreSQL**.

O projeto segue principios de **Clean Architecture**, mantendo controllers finos, use cases responsaveis pelas regras de aplicacao e repositorios isolando o acesso ao banco de dados.

## Tecnologias

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- JWT
- Bcryptjs
- Docker Compose

## Arquitetura

```text
src/
|-- domain/        # Entidades, erros, contratos e regras de dominio
|-- application/   # Use cases, DTOs e factories
|-- infra/         # Banco, HTTP, repositorios e servicos externos
`-- main/          # Bootstrap da aplicacao
```

## Modulos

### Usuarios

- Cadastro de usuario
- Login com JWT
- Listagem de usuarios
- Exclusao de usuario

### Produtos

- Criacao de produto
- Listagem de produtos
- Busca por nome
- Atualizacao de produto
- Exclusao de produto

### Carrinho

- Adicionar item ao carrinho
- Remover item do carrinho
- Consultar carrinho
- Limpar carrinho

### Pedidos

- Criar pedido
- Listar pedidos
- Cancelar pedido
- Pagar pedido

## Scripts

```bash
npm run dev
npm run build
npm start
```

## Autenticacao

Rotas protegidas utilizam JWT no header:

```http
Authorization: Bearer token
```

## Status

Projeto em desenvolvimento, com estrutura base de dominio, aplicacao, infraestrutura, use cases, controllers, DTOs e factories.
