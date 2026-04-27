# 🛒 Api-Ecommerce

API RESTful de e-commerce construída com Node.js, TypeScript, Express e PostgreSQL seguindo os princípios de Clean Architecture e DDD. Possui autenticação JWT, controle de acesso por roles e Prisma ORM.

## 🚀 Tecnologias

- **Node.js** + **TypeScript**
- **Express**
- **PostgreSQL** + **Prisma ORM**
- **JWT** — autenticação
- **Bcryptjs** — hash de senhas
- **Docker** + **Docker Compose**
- **UUID** — geração de IDs no domínio

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **DDD (Domain-Driven Design)**, separando as responsabilidades em camadas:

```
src/
├── domain/              # Entidades, repositórios (interfaces) e erros
│   ├── entities/
│   ├── repositories/
│   ├── services/
│   └── errors/
├── application/         # Casos de uso
│   └── use-cases/
├── infra/               # Implementações concretas
│   ├── database/
│   ├── http/
│   ├── repositories/
│   └── services/
└── main/                # Bootstrap da aplicação
```

## 📦 Módulos

### 👤 Usuários
- Registro com validação de nome, email e senha
- Login com JWT
- Listagem de usuários (admin)
- Exclusão de conta

### 📦 Produtos
- CRUD completo (admin)
- Listagem e pesquisa por nome
- Controle de stock

### 🛒 Carrinho
- Adicionar/remover itens
- Visualizar carrinho
- Limpar carrinho

### 📋 Pedidos
- Criar pedido a partir do carrinho
- Listar pedidos do utilizador
- Cancelar pedido
- Simular pagamento

## 👥 Roles

| Role    | Permissões |
|---------|-----------|
| `CLIENT` | Carrinho, pedidos, perfil |
| `ADMIN`  | CRUD de produtos, listagem de usuários |
