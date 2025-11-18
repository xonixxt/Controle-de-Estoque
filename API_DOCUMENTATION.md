# Documentação da API — Controle de Estoque

Base (local): `http://localhost:3000`

Autenticação
-----------
- Autenticação via JWT pelo header `Authorization: Bearer <token>`.
- Obtenha o `token` em `POST /api/auth/login` ou após `POST /api/auth/register`.

Endpoints
--------

## Auth

### POST /api/auth/register
- Público
- Body (JSON):
  ```json
  { "name": "Fulano", "email": "fulano@example.com", "password": "senha123" }
  ```
- Resposta: `201` `{ token, user }`

### POST /api/auth/login
- Público
- Body (JSON):
  ```json
  { "email": "fulano@example.com", "password": "senha123" }
  ```
- Resposta: `200` `{ token, user }`


## Produtos

### GET /api/products
- Requer autenticação (rotas protegidas no projeto atual)
- Retorna: array de produtos

### GET /api/products/:id
- Requer autenticação
- Retorna: objeto único de produto

### POST /api/products
- Requer autenticação
- Validações:
  - `name` (obrigatório)
  - `price` (obrigatório, numérico)
  - `quantity` (opcional, inteiro >= 0)
- Exemplo de request:
  ```json
  { "name": "Maçã", "price": 3.5, "quantity": 10, "sku": "SKU001" }
  ```
- Comportamento: o servidor normaliza o `name` (minusculas, sem acentos) para `normalizedName`. Se já existir um produto com o mesmo `normalizedName` pertencente ao mesmo dono, o produto é atualizado (nome formatado, preço atualizado e quantidade somada). Caso contrário, um novo produto é criado.
- Respostas: `201` quando criado ou `200` quando houve merge/atualização.

### PUT /api/products/:id
- Requer autenticação
- Validações (opcionais, se fornecidas são verificadas):
  - `name` (não pode ser vazio)
  - `price` (numérico)
  - `quantity` (inteiro >= 0)
  - (a feature de categorias foi removida da API)
- Exemplo de request:
  ```json
  { "name": "Maçã Grande", "price": 4.0 }
  ```
- Comportamento: atualizar `name` atualiza também `normalizedName`.

### DELETE /api/products/:id
- Requer autenticação
- Remove o produto pelo id



## Estoque (Movimentações)

### GET /api/stock
- Requer autenticação
- Query opcional: `?product=<productId>` para filtrar

### POST /api/stock
- Requer autenticação
- Validações:
  - `product` (obrigatório)
  - `type` ('entrada' | 'saida')
  - `quantity` (inteiro > 0)
- Exemplo de request:
  ```json
  { "product": "<productId>", "type": "entrada", "quantity": 5, "reason": "Reabastecimento" }
  ```
- Comportamento: a operação é executada em transação; `product.quantity` é ajustado. Se a quantidade ficar <= 0 após a movimentação, o documento do produto pode ser removido (a movimentação ainda é salva).


Erros / Respostas
------------------
- Erros de validação: `400` com `{ errors: [...] }` quando o `express-validator` falha.
- Erros de autenticação: `401` com `{ message: 'Token não fornecido' }` ou `{ message: 'Token inválido' }`.
- Não encontrado: `404` com `{ message: 'Produto não encontrado' }` (ou equivalentes para outras entidades).
- Erro de servidor: `500` com `{ message: 'Erro no servidor' }`.


Contatos / observações
----------------
- Consulte o `README.md` na raiz para instruções de instalação e execução.
- Sempre faça backup do banco antes de rodar migrações que removem documentos.
