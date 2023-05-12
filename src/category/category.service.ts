import { Injectable } from '@nestjs/common';
import { CategoryDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CategoryDto, userId: number) {
    const newCategory = await this.prisma.category.create({
      data: {
        updatedById: userId,
      },
    });
    const translation = await this.prisma.categoryTranslation.create({
      data: {
        ...dto,
        updatedById: userId,
        categoryId: newCategory.id,
      },
    });
    return {
      ...translation,
      ...newCategory,
    };
  }
}
