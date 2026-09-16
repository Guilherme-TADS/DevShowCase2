import { prisma } from '../config/prisma';
import { CreateFeedbackDTO } from '../dtos/FeedbackDTO';
import { AppError } from '../middlewares/errorHandler';

export class FeedbackService {
  async createFeedbackForProject(projectId: string, data: { comment: string; rating: number }) {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      throw new AppError('Projeto informado não foi encontrado.', 404);
    }

    const feedback = await prisma.feedback.create({
      data: {
        comment: data.comment,
        rating: data.rating,
        projectId
      }
    });

    // Calcula a média das avaliações do projeto
    const aggregate = await prisma.feedback.aggregate({
      where: { projectId },
      _avg: { rating: true },
      _count: { id: true }
    });

    const averageRating = Number((aggregate._avg.rating ?? data.rating).toFixed(2));

    // Atualiza a nota média no projeto
    await prisma.project.update({
      where: { id: projectId },
      data: { averageRating }
    });

    return {
      ...feedback,
      projectAverageRating: averageRating,
      totalFeedbacks: aggregate._count.id
    };
  }

  async createFeedback(data: CreateFeedbackDTO) {
    return this.createFeedbackForProject(data.projectId, {
      comment: data.comment,
      rating: data.rating
    });
  }

  async getAllFeedbacks() {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return feedbacks;
  }

  async getFeedbacksByProject(projectId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      throw new AppError('Projeto informado não foi encontrado.', 404);
    }

    const feedbacks = await prisma.feedback.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });

    return feedbacks;
  }
}
