# Frontend — Controle de Estoque

Este frontend foi escrito em React + TypeScript + Sass e Redux Toolkit.

Como rodar (na pasta `frontend`):

```bash
npm install
npm run dev
```

Observações:
- Este frontend é propositalmente simples para atender ao requisito da disciplina.
- O backend deve estar rodando em `http://localhost:3000` para as chamadas a `/api` funcionarem.

Admin (entrar como admin)

- O servidor garante a existência de uma conta admin no startup. Configure `ADMIN_EMAIL` e `ADMIN_PASSWORD` no `.env` do backend para definir as credenciais do admin.

Exemplo `.env` (backend):

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SenhaForte123
```

- Após reiniciar o backend com essas variáveis, efetue login no frontend pelo formulário de login usando as credenciais do admin. Não existe um botão/link de "login automático" no UI; use o formulário de email/senha.

Como visualizar a API (rápido)
--------------------------------
Você pode ver os dados da API sem usar DevTools:

- Pela interface (recomendado): inicie backend e frontend e abra `http://localhost:5173`. Faça login e acesse **Produtos**.
- Via terminal (curl): faça login e use o token para listar produtos (exemplos no README do backend):
	```cmd
	curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"SenhaForte123\"}"
	curl -H "Authorization: Bearer <TOKEN_AQUI>" http://localhost:3000/api/products
	```
- Opcional: use Postman/Insomnia para importar uma collection e testar visualmente.

Se preferir, use o frontend para evitar copiar tokens manualmente — o app já adiciona o token automaticamente nas requisições.
