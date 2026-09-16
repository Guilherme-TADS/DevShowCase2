export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'DevShowcase API',
    version: '1.0.0',
    description: 'Documentação interativa dos endpoints REST da plataforma DevShowcase API com suporte a PostgreSQL, regras de negócio e tratamento global de exceções.'
  },
  servers: [
    {
      url: '/',
      description: 'Servidor Atual (Local / Nuvem / Render)'
    },
    {
      url: 'http://localhost:3000',
      description: 'Servidor Local (Desenvolvimento)'
    }
  ],
  paths: {
    '/api/profiles': {
      post: {
        summary: 'Cadastrar Perfil do Desenvolvedor',
        tags: ['Profiles'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email'],
                properties: {
                  name: { type: 'string', example: 'Guilherme Carvalho' },
                  email: { type: 'string', example: 'guilherme@devshowcase.io' },
                  bio: { type: 'string', example: 'Desenvolvedor Full Stack' },
                  githubUrl: { type: 'string', example: 'https://github.com/guilherme' },
                  linkedinUrl: { type: 'string', example: 'https://linkedin.com/in/guilherme' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Perfil criado com sucesso' },
          '400': { description: 'Erro de validação nos dados enviados' },
          '409': { description: 'E-mail já cadastrado' }
        }
      },
      get: {
        summary: 'Listar Todos os Perfis Cadastrados',
        tags: ['Profiles'],
        responses: {
          '200': { description: 'Lista de todos os perfis com seus projetos associados' }
        }
      }
    },
    '/api/profiles/{id}': {
      get: {
        summary: 'Buscar Perfil por ID',
        tags: ['Profiles'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID do perfil',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Perfil encontrado com lista de projetos' },
          '404': { description: 'Perfil não encontrado' }
        }
      }
    },
    '/api/technologies': {
      post: {
        summary: 'Cadastrar Tecnologia',
        tags: ['Technologies'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Node.js' },
                  category: { type: 'string', example: 'Backend' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Tecnologia cadastrada com sucesso' },
          '400': { description: 'Erro de validação nos dados' },
          '409': { description: 'Tecnologia já cadastrada' }
        }
      },
      get: {
        summary: 'Listar Todas as Tecnologias',
        tags: ['Technologies'],
        responses: {
          '200': { description: 'Lista de tecnologias cadastradas' }
        }
      }
    },
    '/api/projects': {
      post: {
        summary: 'Cadastrar Projeto',
        tags: ['Projects'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'profileId'],
                properties: {
                  title: { type: 'string', example: 'DevShowcase Platform' },
                  description: { type: 'string', example: 'Plataforma para exibição de portfólios de desenvolvedores' },
                  repositoryUrl: { type: 'string', example: 'https://github.com/guilherme/devshowcase-api' },
                  demoUrl: { type: 'string', example: 'https://devshowcase.io' },
                  profileId: { type: 'string', example: 'UUID_DO_PERFIL' },
                  technologyIds: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['UUID_TECNOLOGIA_1', 'UUID_TECNOLOGIA_2']
                  }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Projeto criado com sucesso' },
          '400': { description: 'Erro de validação' },
          '404': { description: 'Perfil ou tecnologia não encontrada' }
        }
      },
      get: {
        summary: 'Buscar Projetos com Filtragem e Paginação',
        tags: ['Projects'],
        parameters: [
          {
            name: 'technology',
            in: 'query',
            required: false,
            description: 'Nome ou ID da tecnologia para filtrar os projetos',
            schema: { type: 'string', example: 'Node.js' }
          },
          {
            name: 'page',
            in: 'query',
            required: false,
            description: 'Número da página (inicia em 1)',
            schema: { type: 'integer', default: 1, example: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            description: 'Quantidade de projetos por página (máx. 100)',
            schema: { type: 'integer', default: 10, example: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'Lista paginada de projetos com autor, tecnologias, feedbacks, nota média e upvotes',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { type: 'object' }
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer', example: 1 },
                        limit: { type: 'integer', example: 10 },
                        total: { type: 'integer', example: 1 },
                        totalPages: { type: 'integer', example: 1 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/projects/{id}': {
      get: {
        summary: 'Buscar Projeto por ID',
        tags: ['Projects'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID do projeto',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Detalhes do projeto com tecnologias e feedbacks' },
          '404': { description: 'Projeto não encontrado' }
        }
      }
    },
    '/api/projects/{id}/upvote': {
      put: {
        summary: 'Incrementar Upvotes / Estrelas do Projeto (+1)',
        tags: ['Projects'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID do projeto a receber o upvote',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Upvote registrado com sucesso e contador incrementado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Upvote registrado com sucesso!' },
                    id: { type: 'string' },
                    title: { type: 'string' },
                    upvotes: { type: 'integer', example: 1 },
                    averageRating: { type: 'number', example: 4.5 }
                  }
                }
              }
            }
          },
          '404': { description: 'Projeto não encontrado' }
        }
      }
    },
    '/api/projects/{id}/feedbacks': {
      post: {
        summary: 'Cadastrar Feedback (Nota 1-5 e Comentário) com Cálculo da Média',
        tags: ['Feedbacks'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID do projeto',
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['comment', 'rating'],
                properties: {
                  comment: { type: 'string', example: 'Excelente arquitetura e organização de código!' },
                  rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Feedback criado com sucesso e nota média recalculada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    comment: { type: 'string' },
                    rating: { type: 'integer', example: 5 },
                    projectId: { type: 'string' },
                    createdAt: { type: 'string' },
                    projectAverageRating: { type: 'number', example: 4.8 },
                    totalFeedbacks: { type: 'integer', example: 5 }
                  }
                }
              }
            }
          },
          '400': { description: 'Erro de validação (ex: nota fora do intervalo de 1 a 5 ou comentário vazio)' },
          '404': { description: 'Projeto não encontrado' }
        }
      },
      get: {
        summary: 'Listar Feedbacks de um Projeto',
        tags: ['Feedbacks'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'UUID do projeto',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': { description: 'Lista de avaliações do projeto' },
          '404': { description: 'Projeto não encontrado' }
        }
      }
    },
    '/api/feedbacks': {
      post: {
        summary: 'Cadastrar Feedback para um Projeto (Via Body)',
        tags: ['Feedbacks'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['comment', 'projectId'],
                properties: {
                  comment: { type: 'string', example: 'Excelente código!' },
                  rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                  projectId: { type: 'string', example: 'UUID_DO_PROJETO' }
                }
              }
            }
          }
        },
        responses: {
          '201': { description: 'Feedback cadastrado com sucesso' },
          '400': { description: 'Erro de validação' },
          '404': { description: 'Projeto não encontrado' }
        }
      },
      get: {
        summary: 'Listar Todos os Feedbacks Cadastrados',
        tags: ['Feedbacks'],
        responses: {
          '200': { description: 'Lista completa de todos os feedbacks do sistema' }
        }
      }
    }
  }
};

