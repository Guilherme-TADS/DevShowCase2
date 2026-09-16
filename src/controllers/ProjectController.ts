import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/ProjectService';

const projectService = new ProjectService();

export class ProjectController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const project = await projectService.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await projectService.getAllProjects(req.query as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async upvote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const result = await projectService.upvoteProject(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const project = await projectService.getProjectById(id);
      res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  }
}
