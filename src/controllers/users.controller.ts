import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { InvitationUserDto } from '@/dtos/users.dto';
import { TokenService } from '@/services/token.service';
import jwt from 'jsonwebtoken';
import { EXPIRED_TOKEN, SECRET_KEY } from '@/config';
export class UserController {
  public user = Container.get(UserService);
  public token = Container.get(TokenService);

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.user.findAllUser();

      res.status(200).json({ data: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const findOneUserData: User = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public inviteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: InvitationUserDto = req.body;
      const inviteUser = await this.user.invitation(data);

      res.status(200).json({ data: inviteUser, message: 'invitation envoyée !' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const decodedToken = await this.token.tokenInvitation(req.params.id);

      userData.email = decodedToken.email;
      userData.idInvitation = decodedToken.idInvitation;

      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const userData: User = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public connectUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: { identifiant: string; password: string } = req.body;
      const connectUserData: User = await this.user.connectionUser(userData);

      //Creation du token d'authentification

      const token = jwt.sign(
        {
          userId: connectUserData.id,
          userEmail: connectUserData.email,
          userRole: connectUserData.role,
          userPseudo: connectUserData.pseudo,
          userPhoto: connectUserData.avatar,
        },
        SECRET_KEY as string,
        { expiresIn: EXPIRED_TOKEN as string },
      );

      res.status(200).json({ data: connectUserData, token: token, message: 'connected' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: deleteUserData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
