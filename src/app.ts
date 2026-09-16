import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use(cors());
app.use(express.json());

// Swagger UI Documentation Endpoint
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api', routes);

// Root healthcheck with links
app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>DevShowcase API - Painel da API</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; }
        .card { max-width: 720px; margin: 0 auto; background: #1e293b; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
        .header-title { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 0; margin-bottom: 1rem; }
        h1 { color: #38bdf8; margin: 0; font-size: 1.75rem; display: flex; align-items: center; gap: 0.75rem; }
        .badge { background: #10b981; color: #022c22; font-size: 0.8rem; padding: 0.3rem 0.6rem; border-radius: 0.375rem; font-weight: 700; letter-spacing: 0.05em; display: inline-flex; align-items: center; justify-content: center; }
        a.btn { display: inline-block; background: #0284c7; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.5rem; font-weight: bold; margin-top: 1rem; margin-bottom: 1rem; }
        a.btn:hover { background: #0369a1; }
        ul { line-height: 1.9; }
        code { background: #334155; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-family: monospace; color: #38bdf8; font-size: 0.9em; }
        .highlight { color: #facc15; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header-title">
          <h1>🚀 DevShowcase API</h1>
          <span class="badge">ONLINE (PRODUÇÃO)</span>
        </div>
        <p>A API robusta do DevShowcase está em execução com suporte completo a PostgreSQL, Swagger e tratamento global de exceções!</p>
        <p><a href="/docs" class="btn">📖 Abrir Swagger UI (Documentação Interativa)</a></p>
        <h3>Endpoints REST Disponíveis:</h3>
        <ul>
          <li><code>GET /api/projects</code> - Listar projetos <span class="highlight">(com filtro ?technology=... e paginação ?page=1&limit=10)</span></li>
          <li><code>POST /api/projects</code> - Cadastrar projeto</li>
          <li><code>PUT /api/projects/{id}/upvote</code> - <span class="highlight">Incrementar curtidas/estrelas (+1)</span></li>
          <li><code>POST /api/projects/{id}/feedbacks</code> - <span class="highlight">Cadastrar feedback (nota 1 a 5 com cálculo da nota média)</span></li>
          <li><code>GET /api/projects/{id}/feedbacks</code> - Listar opiniões de um projeto</li>
          <li><code>POST /api/profiles</code> - Cadastrar perfil de desenvolvedor</li>
          <li><code>GET /api/profiles</code> - Listar todos os perfis</li>
          <li><code>GET /api/profiles/{id}</code> - Buscar perfil por ID com seus projetos</li>
          <li><code>POST /api/technologies</code> - Cadastrar tecnologia</li>
          <li><code>GET /api/technologies</code> - Listar todas as tecnologias</li>
        </ul>
      </div>
    </body>
    </html>
  `);
});

// Middleware 404 para rotas inexistentes
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    error: `Rota '${req.method} ${req.originalUrl}' não encontrada.`,
    message: `Rota '${req.method} ${req.originalUrl}' não encontrada.`
  });
});

// Error handling middleware
app.use(errorHandler);

export default app;
