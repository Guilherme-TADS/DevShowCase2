import { z } from 'zod';

export const createProjectFeedbackSchema = z.object({
  comment: z.string({ message: 'O comentário é obrigatório.' })
    .trim()
    .min(1, { message: 'O comentário não pode estar em branco.' }),
  rating: z.coerce.number({ message: 'A nota deve ser um número entre 1 e 5.' })
    .int({ message: 'A nota deve ser um número inteiro.' })
    .min(1, { message: 'A nota mínima permitida é 1.' })
    .max(5, { message: 'A nota máxima permitida é 5.' })
});

export type CreateProjectFeedbackDTO = z.infer<typeof createProjectFeedbackSchema>;

export const createFeedbackSchema = z.object({
  comment: z.string({ message: 'O comentário é obrigatório.' })
    .trim()
    .min(1, { message: 'O comentário não pode estar em branco.' }),
  rating: z.coerce.number().int().min(1, 'A nota mínima é 1.').max(5, 'A nota máxima é 5.').default(5),
  projectId: z.string({ message: 'O ID do projeto é obrigatório.' })
    .trim()
    .min(1, { message: 'O ID do projeto é obrigatório.' })
});

export type CreateFeedbackDTO = z.infer<typeof createFeedbackSchema>;

