import { prisma } from '../config/prisma';
import { CreateTechnologyDTO } from '../dtos/TechnologyDTO';
import { AppError } from '../middlewares/errorHandler';

export class TechnologyService {
  async createTechnology(data: CreateTechnologyDTO) {
    const existingTech = await prisma.technology.findFirst({
      where: {
        name: {
          equals: data.name
        }
      }
    });

    if (existingTech) {
      throw new AppError('Já existe uma tecnologia cadastrada com este nome.', 409);
    }

    const tech = await prisma.technology.create({
      data: {
        name: data.name,
        category: data.category || null
      }
    });

    return tech;
  }

  async getAllTechnologies() {
    const technologies = await prisma.technology.findMany({
      orderBy: { name: 'asc' }
    });

    return technologies;
  }
}
