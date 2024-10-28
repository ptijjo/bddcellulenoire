import { PrismaClient } from '@prisma/client';
import { Service } from 'typedi';
import { CreateUserDto, InvitationUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { sendMailActivation } from '@/mails/user/user.mail';
const cuid = require('cuid');
import jwt from 'jsonwebtoken';
import { EXPIRED_TOKEN_INVITATION, SECRET_KEY_INVITATION } from '@/config';
import bcrypt from 'bcrypt';
import fs from 'fs';

@Service()
export class UserService {
  public user = new PrismaClient().user;

  public async findAllUser(): Promise<User[]> {
    const allUser: User[] = await this.user.findMany();
    return allUser;
  }

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async invitation(invitationData: InvitationUserDto): Promise<string> {
    const findUser: User = await this.user.findUnique({ where: { email: invitationData.email } });
    if (findUser) throw new HttpException(409, `This email ${invitationData.email} already exists`);

    const idInvitation = cuid();

    const tokenInvitation = jwt.sign(
      {
        email: invitationData.email,
        idInvitation,
      },
      SECRET_KEY_INVITATION as string,
      { expiresIn: EXPIRED_TOKEN_INVITATION as string },
    );

    // sendEmail
    const link = `${process.env.FRONT_END}/invitation/${tokenInvitation}`;

    await sendMailActivation(invitationData.email, link);
    // if (!envoi) throw new HttpException(400, "Erreur lors de l'invitation");

    return link;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser: User = await this.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        pseudo: `user${userData.idInvitation}`,
        idInvitation: userData.idInvitation,
        role: 'user',
      },
    });

    return newUser;
  }

  public async connectionUser(userData: { identifiant: string; password: string }): Promise<User> {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regexEmail.test(userData.identifiant)) {
      const findEmail: User = await this.user.findUnique({ where: { email: userData.identifiant } });
      if (!findEmail) throw new HttpException(409, `Identifiants incorrects !`);

      const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findEmail.password);
      if (!isPasswordMatching) throw new HttpException(409, `Identifiants incorrects !`);

      // const updateUser = await this.user.update({
      //   where: {
      //     email: findEmail.email,
      //   },
      //   data: {
      //     last_connection: localDate(),
      //   },
      // });
      return findEmail;
    } else {
      const findPseudo: User = await this.user.findUnique({ where: { pseudo: userData.identifiant } });
      if (!findPseudo) throw new HttpException(409, `Identifiants incorrects !`);

      const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findPseudo.password);
      if (!isPasswordMatching) throw new HttpException(409, `Identifiants incorrects !`);

      // const updateUser = await this.user.update({
      //   where: {
      //     pseudo: findPseudo.pseudo,
      //   },
      //   data: {
      //     last_connection: localDate(),
      //   },
      // });
      return findPseudo;
    }
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const updateUserData = await this.user.update({ where: { id: userId }, data: { ...userData } });
    return updateUserData;
  }

  public async deleteUser(userId: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.user.delete({ where: { id: userId } });
    return deleteUserData;
  }

  public async updateUserAvatar(userId: string, userData: CreateUserDto, authUser: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    if (userId !== authUser) throw new HttpException(409, 'Opération non authorisé !');

    const file = findUser.avatar.split('/public/avatar')[1];
    if (file) {
      fs.unlink(`/public/avatar/${file}`, error => {
        if (error) console.log(error);
        else console.log(`${file} is deleted !`);
      });
    }

    const updateUserData = await this.user.update({ where: { id: authUser }, data: { ...userData } });
    return updateUserData;
  }
}
