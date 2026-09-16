import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/ProfileService';

const profileService = new ProfileService();

export class ProfileController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await profileService.createProfile(req.body);
      res.status(201).json(profile);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profiles = await profileService.getAllProfiles();
      res.status(200).json(profiles);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const profile = await profileService.getProfileById(id);
      res.status(200).json(profile);
    } catch (error) {
      next(error);
    }
  }
}
