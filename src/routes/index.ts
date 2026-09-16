import { Router } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { TechnologyController } from '../controllers/TechnologyController';
import { ProjectController } from '../controllers/ProjectController';
import { FeedbackController } from '../controllers/FeedbackController';
import { validateSchema } from '../middlewares/validateSchema';
import { createProfileSchema } from '../dtos/ProfileDTO';
import { createTechnologySchema } from '../dtos/TechnologyDTO';
import { createProjectSchema } from '../dtos/ProjectDTO';
import { createFeedbackSchema, createProjectFeedbackSchema } from '../dtos/FeedbackDTO';

const router = Router();

const profileController = new ProfileController();
const technologyController = new TechnologyController();
const projectController = new ProjectController();
const feedbackController = new FeedbackController();

// Profile Endpoints
router.post('/profiles', validateSchema(createProfileSchema), profileController.create);
router.get('/profiles', profileController.getAll);
router.get('/profiles/:id', profileController.getById);

// Technology Endpoints
router.post('/technologies', validateSchema(createTechnologySchema), technologyController.create);
router.get('/technologies', technologyController.getAll);

// Project Endpoints
router.post('/projects', validateSchema(createProjectSchema), projectController.create);
router.get('/projects', projectController.getAll);
router.get('/projects/:id', projectController.getById);

// Novos Endpoints da Etapa Final
router.post('/projects/:id/feedbacks', validateSchema(createProjectFeedbackSchema), feedbackController.createForProject);
router.put('/projects/:id/upvote', projectController.upvote);
router.get('/projects/:id/feedbacks', feedbackController.getByProject);
router.get('/projects/:projectId/feedbacks', feedbackController.getByProject);

// Feedback Endpoints Gerais
router.post('/feedbacks', validateSchema(createFeedbackSchema), feedbackController.create);
router.get('/feedbacks', feedbackController.getAll);

export default router;
