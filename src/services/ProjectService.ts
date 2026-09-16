import { prisma } from '../config/prisma';
import { CreateProjectDTO, ListProjectsQueryDTO } from '../dtos/ProjectDTO';
import { AppError } from '../middlewares/errorHandler';

export class ProjectService {
  async createProject(data: CreateProjectDTO) {
    // 1. Verify profile existence
    const profile = await prisma.profile.findUnique({
      where: { id: data.profileId }
    });

    if (!profile) {
      throw new AppError('Perfil informado não foi encontrado.', 404);
    }

    // 2. Verify technology existence if technologyIds are provided
    if (data.technologyIds && data.technologyIds.length > 0) {
      const foundTechs = await prisma.technology.findMany({
        where: { id: { in: data.technologyIds } }
      });

      if (foundTechs.length !== data.technologyIds.length) {
        throw new AppError('Uma ou mais tecnologias informadas não foram encontradas.', 404);
      }
    }

    // 3. Create project with connected technologies
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        repositoryUrl: data.repositoryUrl || null,
        demoUrl: data.demoUrl || null,
        profileId: data.profileId,
        upvotes: 0,
        averageRating: 0,
        technologies: {
          create: (data.technologyIds || []).map((techId) => ({
            technology: {
              connect: { id: techId }
            }
          }))
        }
      },
      include: {
        profile: true,
        technologies: {
          include: {
            technology: true
          }
        },
        feedbacks: true
      }
    });

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      repositoryUrl: project.repositoryUrl,
      demoUrl: project.demoUrl,
      upvotes: project.upvotes,
      averageRating: project.averageRating,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      profile: project.profile,
      technologies: project.technologies.map((t) => t.technology),
      feedbacks: project.feedbacks
    };
  }

  async upvoteProject(id: string) {
    const project = await prisma.project.findUnique({
      where: { id }
    });

    if (!project) {
      throw new AppError('Projeto informado não foi encontrado.', 404);
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        upvotes: {
          increment: 1
        }
      },
      include: {
        profile: true,
        technologies: {
          include: {
            technology: true
          }
        },
        feedbacks: true
      }
    });

    return {
      message: 'Upvote registrado com sucesso!',
      id: updated.id,
      title: updated.title,
      upvotes: updated.upvotes,
      averageRating: updated.averageRating,
      project: {
        id: updated.id,
        title: updated.title,
        description: updated.description,
        repositoryUrl: updated.repositoryUrl,
        demoUrl: updated.demoUrl,
        upvotes: updated.upvotes,
        averageRating: updated.averageRating,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        profile: updated.profile,
        technologies: updated.technologies.map((t) => t.technology),
        feedbacks: updated.feedbacks
      }
    };
  }

  async getAllProjects(query?: ListProjectsQueryDTO) {
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query?.limit) || 10));
    const skip = (page - 1) * limit;

    const tech = query?.technology || query?.tech;
    const where: any = {};

    if (tech && typeof tech === 'string' && tech.trim().length > 0) {
      const techFilter = tech.trim();
      where.technologies = {
        some: {
          technology: {
            OR: [
              { name: { contains: techFilter, mode: 'insensitive' } },
              { id: techFilter }
            ]
          }
        }
      };
    }

    const [total, projects] = await Promise.all([
      prisma.project.count({ where }),
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          technologies: {
            include: {
              technology: true
            }
          },
          feedbacks: true
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit) || (total === 0 ? 1 : 1);

    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      repositoryUrl: project.repositoryUrl,
      demoUrl: project.demoUrl,
      upvotes: project.upvotes,
      averageRating: project.averageRating,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      profile: project.profile,
      technologies: project.technologies.map((t) => t.technology),
      feedbacks: project.feedbacks
    }));

    return {
      data: formattedProjects,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        profile: true,
        technologies: {
          include: {
            technology: true
          }
        },
        feedbacks: true
      }
    });

    if (!project) {
      throw new AppError('Projeto informado não foi encontrado.', 404);
    }

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      repositoryUrl: project.repositoryUrl,
      demoUrl: project.demoUrl,
      upvotes: project.upvotes,
      averageRating: project.averageRating,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      profile: project.profile,
      technologies: project.technologies.map((t) => t.technology),
      feedbacks: project.feedbacks
    };
  }
}

