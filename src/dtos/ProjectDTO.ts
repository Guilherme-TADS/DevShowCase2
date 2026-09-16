import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string({ message: 'O título do projeto é obrigatório.' })
    .trim()
    .min(1, { message: 'O título do projeto não pode estar em branco.' }),
  description: z.string({ message: 'A descrição do projeto é obrigatória.' })
    .trim()
    .min(1, { message: 'A descrição do projeto não pode estar em branco.' }),
  repositoryUrl: z.string()
    .url({ message: 'A URL do repositório deve ser uma URL válida.' })
    .optional()
    .or(z.literal('')),
  demoUrl: z.string()
    .url({ message: 'A URL de demonstração deve ser uma URL válida.' })
    .optional()
    .or(z.literal('')),
  profileId: z.string({ message: 'O ID do perfil do autor é obrigatório.' })
    .trim()
    .min(1, { message: 'O ID do perfil do autor é obrigatório.' }),
  technologyIds: z.array(z.string()).optional().default([])
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;

export const listProjectsQuerySchema = z.object({
  technology: z.string().optional(),
  tech: z.string().optional(),
  page: z.coerce.number().int().min(1, 'A página deve ser maior ou igual a 1.').optional().default(1),
  limit: z.coerce.number().int().min(1, 'O limite deve ser no mínimo 1.').max(100, 'O limite deve ser no máximo 100.').optional().default(10)
});

export type ListProjectsQueryDTO = z.infer<typeof listProjectsQuerySchema>;
