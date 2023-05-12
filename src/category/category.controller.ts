import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUser, Roles } from '../auth/decorators';
import { JwtGuard, RolesGuard } from '../auth/guard';
// import { CategoryService } from './category.service';
import { CategoryDto } from './dto';

@Controller('categories')
export class CategoryController {
  // constructor(private categoryService: CategoryService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  createCategory(
    @GetUser('id') userId,
    @Body()
    dto: CategoryDto,
  ) {
    // return this.categoryService.createCategory(dto, userId);
  }
}
