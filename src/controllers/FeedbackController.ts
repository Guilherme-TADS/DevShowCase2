import { Request, Response, NextFunction } from 'express';
import { FeedbackService } from '../services/FeedbackService';

const feedbackService = new FeedbackService();

export class FeedbackController {
  async createForProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = String(req.params.id || req.params.projectId);
      const feedback = await feedbackService.createFeedbackForProject(projectId, req.body);
      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const feedback = await feedbackService.createFeedback(req.body);
      res.status(201).json(feedback);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const feedbacks = await feedbackService.getAllFeedbacks();
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  }

  async getByProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const projectId = String(req.params.id || req.params.projectId);
      const feedbacks = await feedbackService.getFeedbacksByProject(projectId);
      res.status(200).json(feedbacks);
    } catch (error) {
      next(error);
    }
  }
}
