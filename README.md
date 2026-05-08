# 🛒 API Ecommerce

<p>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/Bcryptjs-6A4C93?style=for-the-badge&logo=security&logoColor=white" />
</p>

API RESTful de e-commerce desenvolvida com **Node.js**, **Express**, **TypeScript**, **PostgreSQL** e **Prisma ORM**.

O projeto foi construído com foco em organização, separação de responsabilidades e boas práticas de arquitetura, aplicando conceitos de **Clean Architecture** e **DDD** para manter o domínio da aplicação independente das tecnologias externas.

---

## 📌 Sobre o projeto

Esta API simula o funcionamento básico de um sistema de e-commerce, permitindo o gerenciamento de usuários, produtos, carrinho de compras, pedidos e pagamentos.

A aplicação possui autenticação com **JWT**, criptografia de senha com **Bcrypt**, controle de acesso por perfil de usuário e persistência de dados utilizando **PostgreSQL** com **Prisma ORM**.

---

## 🏗️ Arquitetura

O projeto segue uma estrutura baseada em camadas, separando regras de negócio, casos de uso, infraestrutura e entrada da aplicação.

```txt
src/
├── domain/        # Entidades, erros, contratos e regras de domínio
├── application/   # Casos de uso, DTOs e factories
├── infra/         # Banco de dados, HTTP, repositórios e serviços externos
└── main/          # Inicialização da aplicação
```

### Principais responsabilidades

- **Domain:** concentra as entidades, regras de negócio e contratos.
- **Application:** contém os casos de uso da aplicação.
- **Infra:** implementa detalhes externos, como banco de dados, controllers, middlewares e repositórios.
- **Main:** responsável pela inicialização da aplicação.

---

## ⚙️ Funcionalidades

### 👤 Usuários

- Cadastro de usuários
- Login com autenticação JWT
- Listagem de usuários
- Exclusão da própria conta
- Controle de acesso por perfil de usuário

### 📦 Produtos

- Criação de produtos
- Listagem de produtos
- Busca de produtos por nome
- Atualização de produtos
- Exclusão de produtos

### 🛒 Carrinho

- Adição de itens ao carrinho
- Remoção de itens do carrinho
- Consulta do carrinho do usuário
- Limpeza completa do carrinho

### 🧾 Pedidos

- Criação de pedidos
- Listagem de pedidos do usuário
- Cancelamento de pedido
- Pagamento de pedido

---

## 🔐 Autenticação e autorização

A API utiliza autenticação baseada em **JWT**.

As rotas protegidas exigem o envio do token no header da requisição:

```txt
Authorization: Bearer <token>
```

Além da autenticação, algumas rotas possuem controle de acesso por perfil de usuário.

### Perfis disponíveis

- `ADMIN`
- `CLIENT`

Rotas administrativas, como criação, atualização e exclusão de produtos, são restritas ao perfil `ADMIN`.

---

## 📍 Principais rotas

### Usuários

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/users` | Cadastra um novo usuário | Não |
| POST | `/login` | Realiza login do usuário | Não |
| GET | `/users` | Lista usuários cadastrados | Sim, ADMIN |
| DELETE | `/users/me` | Exclui o próprio usuário | Sim |

---

### Produtos

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/products` | Cria um novo produto | Sim, ADMIN |
| GET | `/products` | Lista todos os produtos | Não |
| GET | `/products/search` | Busca produtos por nome | Não |
| PUT | `/products/:id` | Atualiza um produto | Sim, ADMIN |
| DELETE | `/products/:id` | Remove um produto | Sim, ADMIN |

---

### Carrinho

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/cart/items` | Adiciona um item ao carrinho | Sim |
| DELETE | `/cart/items/:cartItemId` | Remove um item do carrinho | Sim |
| GET | `/cart` | Consulta o carrinho do usuário | Sim |
| DELETE | `/cart` | Limpa o carrinho | Sim |

---

### Pedidos

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/orders` | Cria um novo pedido | Sim |
| GET | `/orders` | Lista os pedidos do usuário | Sim |
| PATCH | `/orders/:orderId/cancel` | Cancela um pedido | Sim |
| PATCH | `/orders/:orderId/pay` | Realiza o pagamento de um pedido | Sim |

---

## 🧠 Conceitos aplicados

- API REST
- Clean Architecture
- Domain-Driven Design
- Repository Pattern
- Use Cases
- Controllers
- Middlewares
- DTOs
- Autenticação JWT
- Controle de acesso por roles
- Tratamento centralizado de erros
- ORM com Prisma
