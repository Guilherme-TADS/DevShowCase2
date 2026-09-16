import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      error: err.message,
      message: err.message
    });
    return;
  }

  if (err instanceof ZodError) {
    const fieldErrors = err.issues.map((issue) => ({
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

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'campo único';
      res.status(409).json({
        statusCode: 409,
        error: `Conflito de dados: o valor informado para ${target} já está cadastrado.`,
        message: `Conflito de dados: o valor informado para ${target} já está cadastrado.`
      });
      return;
    }

    // P2025: Record not found
    if (err.code === 'P2025') {
      res.status(404).json({
        statusCode: 404,
        error: 'Registro não encontrado no banco de dados.',
        message: 'Registro não encontrado no banco de dados.'
      });
      return;
    }

    // P2003: Foreign key constraint failed
    if (err.code === 'P2003') {
      res.status(400).json({
        statusCode: 400,
        error: 'Falha de integridade referencial: registro relacionado inexistente.',
        message: 'Falha de integridade referencial: registro relacionado inexistente.'
      });
      return;
    }
  }

  // SyntaxError from invalid JSON body
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      statusCode: 400,
      error: 'JSON malformado no corpo da requisição.',
      message: 'JSON malformado no corpo da requisição.'
    });
    return;
  }

  console.error('Unhandled Error:', err);
  res.status(500).json({
    statusCode: 500,
    error: 'Erro interno do servidor.',
    message: 'Ocorreu um erro inesperado no servidor. Tente novamente mais tarde.'
  });
};

