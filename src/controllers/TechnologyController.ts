import { Request, Response, NextFunction } from 'express';
import { TechnologyService } from '../services/TechnologyService';

const technologyService = new TechnologyService();

export class TechnologyController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tech = await technologyService.createTechnology(req.body);
      res.status(201).json(tech);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const technologies = await technologyService.getAllTechnologies();
      res.status(200).json(technologies);
    } catch (error) {
      next(error);
    }
  }
}
