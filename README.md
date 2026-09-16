# 🚀 DevShowcase API - Plataforma de Portfólios de Desenvolvedores

Backend robusto e pronto para produção da plataforma **DevShowcase API**, desenvolvido em Node.js com TypeScript, Express.js, Prisma ORM e banco de dados relacional **PostgreSQL**, com deploy contínuo configurado para o **Render**.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** TypeScript
- **Runtime:** Node.js (v20+)
- **Framework Web:** Express.js
- **ORM / Modelagem:** Prisma ORM (v6)
- **Banco de Dados:** PostgreSQL (Render PostgreSQL / Supabase)
- **Validação de Dados:** Zod
- **Documentação:** Swagger UI / OpenAPI 3.0
- **Hospedagem & Deploy Contínuo:** Render (PaaS)
- **Gerenciamento de Ambiente:** `dotenv`
- **Diagramação ERD:** `prisma-erd-generator`

---

## 📐 Modelagem de Entidades Relacionais

1. **Profile (Perfil do Desenvolvedor)**
   - Atributos: `id` (UUID), `name`, `email` (único), `bio`, `githubUrl`, `linkedinUrl`, `createdAt`, `updatedAt`.
   - **Relacionamento:** `Profile 1 : N Project` (Um perfil pode possuir vários projetos).

2. **Project (Projeto)**
   - Atributos: `id` (UUID), `title`, `description`, `repositoryUrl`, `demoUrl`, `upvotes` (inteiro), `averageRating` (float), `profileId` (FK), `createdAt`, `updatedAt`.
   - **Relacionamentos:**
     - `Project 1 : N Feedback` (Recebe múltiplos feedbacks e avaliações).
     - `Project N : N Technology` (Relacionamento muitos-para-muitos via tabela `project_technologies`).

3. **Technology (Tecnologia)**
   - Atributos: `id` (UUID), `name` (único), `category`, `createdAt`.
   - **Relacionamento:** `Technology N : N Project`.

4. **Feedback (Avaliação / Opinião)**
   - Atributos: `id` (UUID), `comment`, `rating` (1 a 5), `projectId` (FK), `createdAt`.
   - **Relacionamento:** `Feedback N : 1 Project`.

---

## ⚡ Regras de Negócio e Funcionalidades da Etapa Final

1. **Cálculo da Nota Média do Projeto (`POST /api/projects/:id/feedbacks`):**
   - Ao registrar um feedback com nota de 1 a 5, o serviço calcula dinamicamente a média aritmética de todas as avaliações do projeto e persiste no campo `averageRating` do projeto.
2. **Incremento de Curtidas/Estrelas (`PUT /api/projects/:id/upvote`):**
   - Incrementa de forma atômica o contador `upvotes` (+1) do projeto especificado.
3. **Busca Paginada e Filtrada (`GET /api/projects`):**
   - Permite filtrar projetos por tecnologia (`?technology=Node.js`).
   - Suporta paginação via `?page=1&limit=10`, retornando total de registros e total de páginas.
4. **Tratamento Global de Erros:**
   - Respostas amigáveis padronizadas em JSON para erros 400 (validação Zod e sintaxe), 404 (recursos e rotas inexistentes), 409 (conflito de campos únicos) e 500 (erros internos).
5. **Documentação Interativa Swagger:**
   - Acessível na rota `/docs` e `/api-docs`.

---

## 💻 Como Executar Localmente

### Pré-requisitos
- Node.js (v18 ou superior)
- npm
- Instância PostgreSQL ativa (local ou em nuvem no Supabase/Render)

### Passos:

1. **Instalar as dependências:**
   ```bash
   npm install
   ```

2. **Configurar as Variáveis de Ambiente:**
   Crie o arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://postgres:sua_senha@host:5432/postgres?sslmode=require"
   ```

3. **Sincronizar o Schema com o Banco PostgreSQL:**
   ```bash
   npx prisma db push
   ```

4. **Iniciar o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a API em: `http://localhost:3000`  
   Documentação Swagger: `http://localhost:3000/docs`

---

## 🌐 Deploy em Produção (Render + PostgreSQL)

O repositório inclui a configuração de Infraestrutura como Código `render.yaml` (Render Blueprint):

1. Faça push do código para o GitHub na branch `main`:
   ```bash
   git add .
   git commit -m "feat: etapa final pronta para producao"
   git push origin main
   ```
2. Acesse [Render Dashboard](https://dashboard.render.com).
3. Selecione **New +** $\rightarrow$ **Blueprint** e conecte o repositório `DevShowcaseAPI`.
4. O Render provisionará automaticamente o **PostgreSQL** e o **Web Service**, executando `render:build` e iniciando o serviço.

---

## 📑 Principais Endpoints da API

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/` | Painel de status e links da API |
| `GET` | `/docs` | Documentação interativa Swagger UI |
| `GET` | `/api/projects` | Buscar projetos (suporta `?technology=...&page=1&limit=10`) |
| `POST` | `/api/projects` | Cadastrar novo projeto |
| `GET` | `/api/projects/:id` | Buscar detalhes de um projeto por ID |
| `PUT` | `/api/projects/:id/upvote` | Incrementar curtidas/estrelas (+1) |
| `POST` | `/api/projects/:id/feedbacks` | Cadastrar feedback (nota 1 a 5 e comentário) com cálculo de média |
| `GET` | `/api/projects/:id/feedbacks` | Listar feedbacks de um projeto |
| `POST` | `/api/profiles` | Cadastrar perfil de desenvolvedor |
| `GET` | `/api/profiles` | Listar todos os perfis |
| `GET` | `/api/profiles/:id` | Buscar perfil por ID |
| `POST` | `/api/technologies` | Cadastrar tecnologia |
| `GET` | `/api/technologies` | Listar tecnologias |

---

## 🧪 Testes com Postman

A coleção completa de requisições para testes e validação de todos os endpoints e tratamentos de erro está disponível no arquivo [`devshowcase.postman_collection.json`](./devshowcase.postman_collection.json).

