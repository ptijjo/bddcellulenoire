import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto, InvitationUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { modo } from '@/middlewares/modo';
import { auth } from '@/middlewares/auth';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, modo, this.user.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`, modo, this.user.getUserById);
    this.router.post(`${this.path}/:id`, /*modo,*/ ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.post(`${this.path}/invitation`, /*modo, */ ValidationMiddleware(InvitationUserDto), this.user.inviteUser);
    this.router.put(`${this.path}/:id(\\d+)`, auth, ValidationMiddleware(CreateUserDto, true), this.user.updateUser);
    this.router.delete(`${this.path}/:id(\\d+)`, modo, this.user.deleteUser);
  }
}
