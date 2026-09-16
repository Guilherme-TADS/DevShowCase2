import { z } from 'zod';

export const createTechnologySchema = z.object({
  name: z.string({ message: 'O nome da tecnologia é obrigatório.' })
    .trim()
    .min(1, { message: 'O nome da tecnologia não pode estar em branco.' }),
  category: z.string().optional()
});

export type CreateTechnologyDTO = z.infer<typeof createTechnologySchema>;
