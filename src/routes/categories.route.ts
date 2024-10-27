/* eslint-disable prettier/prettier */
import { Router } from 'express';
import { CategoryController } from '@controllers/categories.controller';
import { CreateCategoryDto } from '@dtos/categories.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { modo } from '@/middlewares/modo';


export class CategoryRoute implements Routes {
  public path = '/categories';
  public router = Router();
  public category = new CategoryController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.category.getCatgeories);
    this.router.get(`${this.path}/:id`, this.category.getCategoryId);
    this.router.post(`${this.path}/:id`, modo, ValidationMiddleware(CreateCategoryDto), this.category.createCategory);
  }
}
