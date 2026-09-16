import { prisma } from '../config/prisma';
import { CreateProfileDTO } from '../dtos/ProfileDTO';
import { AppError } from '../middlewares/errorHandler';

export class ProfileService {
  async createProfile(data: CreateProfileDTO) {
    const existingProfile = await prisma.profile.findUnique({
      where: { email: data.email }
    });

    if (existingProfile) {
      throw new AppError('Já existe um perfil cadastrado com este e-mail.', 409);
    }

    const profile = await prisma.profile.create({
      data: {
        name: data.name,
        email: data.email,
        bio: data.bio || null,
        githubUrl: data.githubUrl || null,
        linkedinUrl: data.linkedinUrl || null
      }
    });

    return profile;
  }

  async getAllProfiles() {
    const profiles = await prisma.profile.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        projects: {
          include: {
            technologies: {
              include: {
                technology: true
              }
            },
            feedbacks: true
          }
        }
      }
    });

    return profiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      githubUrl: profile.githubUrl,
      linkedinUrl: profile.linkedinUrl,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      projects: profile.projects.map((proj) => ({
        id: proj.id,
        title: proj.title,
        description: proj.description,
        repositoryUrl: proj.repositoryUrl,
        demoUrl: proj.demoUrl,
        upvotes: proj.upvotes,
        averageRating: proj.averageRating,
        createdAt: proj.createdAt,
        updatedAt: proj.updatedAt,
        technologies: proj.technologies.map((t) => t.technology),
        feedbacks: proj.feedbacks
      }))
    }));
  }

  async getProfileById(id: string) {
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            technologies: {
              include: {
                technology: true
              }
            },
            feedbacks: true
          }
        }
      }
    });

    if (!profile) {
      throw new AppError('Perfil não encontrado.', 404);
    }

    const formattedProjects = profile.projects.map((proj) => ({
      id: proj.id,
      title: proj.title,
      description: proj.description,
      repositoryUrl: proj.repositoryUrl,
      demoUrl: proj.demoUrl,
      upvotes: proj.upvotes,
      averageRating: proj.averageRating,
      createdAt: proj.createdAt,
      updatedAt: proj.updatedAt,
      technologies: proj.technologies.map((t) => t.technology),
      feedbacks: proj.feedbacks
    }));

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      githubUrl: profile.githubUrl,
      linkedinUrl: profile.linkedinUrl,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      projects: formattedProjects
    };
  }
}
