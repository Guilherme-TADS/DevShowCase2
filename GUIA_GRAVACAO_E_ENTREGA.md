# 🎬 Guia de Gravação do Vídeo (5 a 8 min) e Entrega do Projeto

Este documento contém todas as orientações para a gravação da apresentação em vídeo da **DevShowcase API**, o passo a passo para o deploy em nuvem (Render + PostgreSQL) e o modelo para o documento **PDF de entrega final**.

---

## 📋 Checklist das Regras de Gravação

| Requisito | Descrição |
| :--- | :--- |
| **Duração** | Entre **5 e 8 minutos** (não ultrapassar e nem fazer menos de 5 min). |
| **Webcam / Câmera** | Cada aluno do grupo deve aparecer na câmera no início dizendo seu **nome completo**. |
| **Compartilhamento** | Gravar a **tela inteira** do computador com áudio limpo. |
| **Foco Prático** | Demonstração da API em execução usando o **Postman**, mostrando requisições e respostas no console. |
| **Novos Endpoints** | Demonstrar `POST /api/projects/:id/feedbacks`, `PUT /api/projects/:id/upvote` e `GET /api/projects` (filtro e paginação). |
| **Tratamento de Erros** | Simular no Postman um **Erro 400 (Bad Request)** e um **Erro 404 (Not Found)** para evidenciar o tratamento global de exceções. |
| **Visibilidade YouTube** | Postar o vídeo no YouTube com status de visibilidade **Não Listado** (*Unlisted*). |

---

## ⏱️ Roteiro Minuto a Minuto Sugerido (Tempo Total: ~6 minutos)

### Minuto 0:00 a 0:45 - Apresentação Pessoal e Visão Geral
- **Webcam ligada:** Diga seu nome completo (e dos demais integrantes do grupo, se houver).
- **Fala sugerida:**
  > *"Olá! Meu nome é [Seu Nome Completo] e esta é a apresentação da etapa final da plataforma DevShowcase API. Nesta entrega, transformamos a base da aplicação em uma API pronta para produção com PostgreSQL, regras de negócio na camada de serviço, tratamento global de exceções, documentação Swagger e deploy no Render."*
- Mostre rapidamente a estrutura do projeto no VS Code:
  - `src/controllers`, `src/services`, `src/dtos`, `src/middlewares/errorHandler.ts` e `prisma/schema.prisma`.

### Minuto 0:45 a 1:45 - Cadastro de Perfil, Tecnologias e Projeto
- Abra o Postman na coleção **DevShowcase API - Produção e Testes Finais**:
- Execute a pasta **2. Perfis (Profiles)**:
  - `POST /api/profiles`: cria o perfil e salva o `profileId` automaticamente.
- Execute a pasta **3. Tecnologias (Technologies)**:
  - `POST /api/technologies - Node.js`
  - `POST /api/technologies - React`
- Execute a pasta **4. Projetos (Projects)**:
  - `POST /api/projects`: cria o projeto associado ao perfil e às tecnologias cadastradas. Mostre o retorno HTTP 201 com `upvotes: 0` e `averageRating: 0`.

### Minuto 1:45 a 3:00 - Demonstração dos Novos Endpoints
- **1. Upvote / Curtidas:**
  - Execute `PUT /api/projects/{{projectId}}/upvote - Primeiro Upvote`: destaque no retorno que o campo `upvotes` incrementou para `1`.
  - Execute novamente: mostre que incrementou para `2`.
- **2. Avaliações com Cálculo de Média (`averageRating`):**
  - Execute `POST /api/projects/{{projectId}}/feedbacks - Avaliação 1 (Nota 5)`: mostre que o feedback foi cadastrado e a média do projeto foi calculada como `5.0`.
  - Execute `POST /api/projects/{{projectId}}/feedbacks - Avaliação 2 (Nota 4)`: mostre que a média atualizada passou para `4.5` (média de 5 e 4) e `totalFeedbacks` é 2.
  - Explique que o cálculo foi executado na camada de serviço (`FeedbackService`) e atualizado na tabela `projects`.

### Minuto 3:00 a 4:00 - Busca de Projetos, Paginação e Filtragem
- Na pasta **4. Projetos**:
  - Execute `GET /api/projects - Paginação (Página 1, Limite 10)`: mostre o objeto `data` e a estrutura de `pagination` (`page: 1, limit: 10, total, totalPages`).
  - Execute `GET /api/projects - Filtrar por Tecnologia (Node.js)`: aponte o parâmetro `?technology=Node.js` na URL e mostre que o projeto retornado contém a tecnologia filtrada.

### Minuto 4:00 a 5:15 - Tratamento Global de Exceções
- Abra a pasta **7. Tratamento Global de Erros**:
  - **Erro 400 (Bad Request):**
    - Execute `POST /api/projects/:id/feedbacks - Erro 400 (Nota Inválida 6)`: mostre a resposta HTTP 400 com a mensagem amigável e o detalhe do campo `rating`.
    - Execute `POST /api/projects/:id/feedbacks - Erro 400 (Comentário Vazio)`: mostre o erro amigável de campo obrigatório.
  - **Erro 404 (Not Found):**
    - Execute `PUT /api/projects/00000000-0000-0000-0000-000000000000/upvote`: mostre o status HTTP 404 com `"error": "Projeto informado não foi encontrado."`.
    - Execute `GET /api/rota-inexistente`: mostre a captura da rota não mapeada pelo middleware com status HTTP 404.

### Minuto 5:15 a 6:15 - Swagger e Deploy em Produção (Render)
- Abra o navegador:
  - Acesse a rota `/docs` (Swagger UI): mostre a interface interativa com todos os endpoints, parâmetros e schemas.
  - Acesse a URL pública do projeto em produção no Render (ex: `https://devshowcase-api.onrender.com`).
  - Mostre que a API está rodando online conectada ao banco PostgreSQL na nuvem.

### Minuto 6:15 a 6:30 - Conclusão
- Agradeça e finalize a gravação.

---

## 🚀 Passo a Passo para Deploy no Render com PostgreSQL

### Opção 1: Usando Render Blueprint (`render.yaml`) - Mais Rápido
1. Certifique-se de que todas as alterações estão comitadas e enviadas para o seu repositório GitHub:
   ```bash
   git add .
   git commit -m "feat: etapa final com PostgreSQL, regras de negocio e deploy no Render"
   git push origin main
   ```
2. Acesse [dashboard.render.com](https://dashboard.render.com).
3. Clique em **New +** $\rightarrow$ **Blueprint**.
4. Selecione o seu repositório `DevShowcaseAPI`.
5. O Render detectará automaticamente o arquivo `render.yaml` e criará:
   - Um banco de dados **PostgreSQL** gratuito (`devshowcase-postgres`).
   - Um **Web Service** Node.js configurado com as variáveis de ambiente necessárias.
6. Clique em **Apply** e aguarde o build e deploy.

### Opção 2: Criando Manualmente no Render
1. **Criar Banco de Dados PostgreSQL:**
   - No painel do Render, clique em **New +** $\rightarrow$ **PostgreSQL**.
   - Defina um nome (ex: `devshowcase-db`), selecione a região e o plano **Free**.
   - Clique em **Create Database**.
   - Após criado, copie o valor do campo **Internal Database URL** (ou **External Database URL**).
2. **Criar o Web Service:**
   - No painel do Render, clique em **New +** $\rightarrow$ **Web Service**.
   - Conecte o repositório `DevShowcaseAPI`.
   - Configure os campos:
     - **Runtime:** `Node`
     - **Build Command:** `npm install && npm run render:build`
     - **Start Command:** `npm start`
     - **Plan:** `Free`
   - Na seção **Environment Variables**, adicione:
     - `DATABASE_URL`: Cole a URL de conexão do PostgreSQL criado.
     - `PORT`: `3000`
3. Clique em **Create Web Service** e aguarde o término do deploy. A URL pública da sua API será exibida no topo do painel (ex: `https://devshowcase-api.onrender.com`).

---

## 📄 Modelo para o PDF de Entrega

Crie um documento (no Word, Google Docs ou Canva) e exporte como **PDF** com o seguinte conteúdo:

```text
======================================================================
                 DEVSHOWCASE API - ENTREGA FINAL
======================================================================

Disciplina: Desenvolvimento de APIs Robustas / Backend
Integrantes do Grupo:
- [Seu Nome Completo] - RM: [Seu RM / Matrícula]
  (Repita para todos os integrantes do grupo)

----------------------------------------------------------------------
                           LINKS DE ENTREGA
----------------------------------------------------------------------

1. LINK DO REPOSITÓRIO NO GITHUB:
   https://github.com/Guilherme-TADS/DevShowCase2

2. LINK PÚBLICO DA API EM PRODUÇÃO (RENDER):
   https://devshowcase-api.onrender.com

   (Swagger Interativo: https://devshowcase-api.onrender.com/docs)

3. LINK DO VÍDEO NÃO LISTADO NO YOUTUBE:
   [Insira aqui a URL do seu vídeo no YouTube]
   (Exemplo: https://youtu.be/xxxxxxxxxxx)

----------------------------------------------------------------------
                      TECNOLOGIAS E DESTAQUES
----------------------------------------------------------------------
- Node.js, TypeScript, Express.js
- Banco de Dados PostgreSQL provisionado em nuvem
- Prisma ORM com migração e geração de ERD
- Regras de negócio implementadas na camada de serviço (cálculo de média e upvotes)
- Filtragem de projetos por tecnologia e paginação estruturada
- Tratamento global de exceções (HTTP 400, 404, 409, 500)
- Documentação interativa OpenAPI 3.0 / Swagger UI
- Deploy contínuo configurado a partir da branch main do GitHub
======================================================================
```
