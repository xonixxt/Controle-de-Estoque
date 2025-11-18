# Controle de Estoque

Aplicação full-stack para controle de estoque, desenvolvida com Node.js, Express, TypeScript, MongoDB (Mongoose) no backend e React + TypeScript + Sass no frontend. O projeto inclui autenticação JWT, gerenciamento de estado com Redux e uma API RESTful para produtos e movimentações no estoque.

Visão rápida
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

Pré-requisitos
- Node.js 18+ e `npm`
- MongoDB (URI de conexão) — para desenvolvimento local você pode usar um servidor Mongo local ou Atlas.

Variáveis de ambiente
Crie um arquivo `.env` na pasta `backend` com ao menos:

```
MONGODB_URI=mongodb://...          # string de conexão MongoDB
JWT_SECRET=sua_chave_secreta       # não use valor padrão em produção
PORT=3000                          # opcional
```

Instalação e execução (desenvolvimento)

1. Instale dependências do backend e frontend:

```cmd
cd C:\Users\jotab.DESKTOP-O59QV75\Downloads\backend
npm install
cd frontend
npm install
```

2. Rodar backend em modo dev (usa `ts-node-dev`):

```cmd
cd C:\Users\jotab.DESKTOP-O59QV75\Downloads\backend
npm run dev
```

3. Rodar frontend (em outro terminal):

```cmd
cd C:\Users\jotab.DESKTOP-O59QV75\Downloads\backend\frontend
npm run dev
```

Testes

- Backend (Jest):

```cmd
cd C:\Users\jotab.DESKTOP-O59QV75\Downloads\backend
npm test
```

- Frontend (Vitest):

```cmd
cd C:\Users\jotab.DESKTOP-O59QV75\Downloads\backend\frontend
npm test
```

Produtos por usuário

- Os produtos agora são vinculados ao usuário que os cria (`owner`).
- Usuários comuns veem apenas os seus produtos. Usuários com `role: 'admin'` veem todos.

Admin automático

- Para facilitar a implantação, o servidor cria/garante uma conta admin no startup se ela não existir.
- Configure `ADMIN_EMAIL` e `ADMIN_PASSWORD` no arquivo `.env` para definir as credenciais desejadas. Se não definidos, valores padrão são usados (apenas para desenvolvimento):

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SenhaForte123
```

- O admin criado terá `role: 'admin'`. Após iniciar o backend, efetue login via o formulário de login no frontend (não há autenticação automática embutida no UI).

Documentação da API
- Veja `API_DOCUMENTATION.md` na raiz do backend para lista completa de endpoints, exemplos e comportamento especial (normalização de nomes, transações de estoque).

Observações de segurança
- Não use o `JWT_SECRET` padrão em produção. Use variáveis de ambiente seguras.
- Faça backup do banco antes de rodar migrações que removem documentos.

Próximos passos recomendados
- Adicionar testes cobrindo a lógica de normalização/deduplicação.
- Criar pipeline de CI/CD e scripts de backup para produção.

Obrigado — se quiser, eu posso gerar uma coleção Postman/Insomnia, adicionar scripts npm para migração, ou preparar um PR com estas mudanças.

Como visualizar a API (rápido)
--------------------------------
Você pode visualizar os dados da API de três maneiras simples — escolha a que preferir:

- 1) Pela interface (recomendado)
	- Inicie o backend e o frontend e abra o UI:
		```cmd
		cd C:\Users\jotab.DESKTOP-O59QV75\Downloads\backend
		npm run dev

		# em outro terminal
		cd C:\Users\jotab.DESKTOP-O59QV75\Downloads\backend\frontend
		npm run dev
		```
	- Abra `http://localhost:5173` no navegador, faça login e acesse a página **Produtos** (ou **Usuários** → “Acessar”) para ver os dados sem usar terminal.

- 2) Diretamente no navegador (Console) — sem instalar nada
 - 2) Via terminal (curl) — sem frontend
	- Fazer login (retorna `token`):
		```cmd
		curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"SenhaForte123\"}"
		```
	- Usar o token para listar produtos (substitua pelo token recebido):
		```cmd
		curl -H "Authorization: Bearer <TOKEN_AQUI>" http://localhost:3000/api/products
		```
	- Dica: você pode definir uma variável de ambiente no `cmd` para não colar o token toda vez:
		```cmd
		set TOKEN=eyJ...seu_token_aqui...
		curl -H "Authorization: Bearer %TOKEN%" http://localhost:3000/api/products
		```
	- Opcional: criar um `.bat` simples que faz login e lista produtos automaticamente (útil para demonstração em terminal).

- 3) Via curl / Postman (fluxo JWT explícito)
	- Fazer login (retorna `token`):
		```cmd
		curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"SenhaForte123\"}"
		```
	- Usar o token para listar produtos:
		```cmd
		curl -H "Authorization: Bearer <TOKEN_AQUI>" http://localhost:3000/api/products
		```

Observações
- Rotas protegidas exigem o header `Authorization: Bearer <TOKEN>`; abra o frontend para evitar lidar com tokens manualmente.
- Se o backend não subir, verifique `MONGODB_URI` no `.env` e os logs do servidor.

