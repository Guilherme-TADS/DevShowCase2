import { z } from 'zod';

export const createProfileSchema = z.object({
  name: z.string({ message: 'O nome é obrigatório.' })
    .trim()
    .min(1, { message: 'O nome não pode estar em branco.' }),
  email: z.string({ message: 'O e-mail é obrigatório.' })
    .trim()
    .email({ message: 'Forneça um endereço de e-mail válido.' }),
  bio: z.string().optional(),
  githubUrl: z.string()
    .url({ message: 'A URL do GitHub deve ser uma URL válida.' })
    .optional()
    .or(z.literal('')),
  linkedinUrl: z.string()
    .url({ message: 'A URL do LinkedIn deve ser uma URL válida.' })
    .optional()
    .or(z.literal(''))
});

export type CreateProfileDTO = z.infer<typeof createProfileSchema>;
