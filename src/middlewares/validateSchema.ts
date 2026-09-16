import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateSchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));

        res.status(400).json({
          statusCode: 400,
          error: 'Erro de validação nos dados enviados.',
          message: 'Erro de validação nos dados enviados.',
          details: fieldErrors
        });
        return;
      }
      next(error);
    }
  };
};
