import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { CreateUserDto, InvitationUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { sendMailActivation } from '@/mails/user/user.mail';
const cuid = require('cuid');
import jwt from 'jsonwebtoken';
import { EXPIRED_TOKEN_INVITATION, SECRET_KEY_INVITATION } from '@/config';
import bcrypt from 'bcrypt';

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
      },
    });

    return newUser;
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    const updateUserData = await this.user.update({ where: { id: userId }, data: { ...userData, password: hashedPassword } });
    return updateUserData;
  }

  public async deleteUser(userId: string): Promise<User> {
    const findUser: User = await this.user.findUnique({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const deleteUserData = await this.user.delete({ where: { id: userId } });
    return deleteUserData;
  }
}
