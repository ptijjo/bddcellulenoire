/* eslint-disable prettier/prettier */
import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { SECRET_KEY } from '@config';

export const auth = (req: any, res: Response, next: NextFunction) => {
  try {
    const header = req.header('Authorization');

    if (!header) {
      return res.status(403).json({ error: 'Authorization header is missing' });
    }

    const token = header.split(' ')[1];
    const decodedToken = jwt.verify(token, SECRET_KEY as string) as {
      userId: string;
      userEmail: string;
      userRole: string;
      userPseudo: string;
      userFirstName: string;
      userLastName: string;
      userPhoto: string;
      userLastConnection: string;
    };
    const { userId, userEmail, userRole, userFirstName, userLastName, userPhoto, userLastConnection, userPseudo } = decodedToken;
    req.auth = {
      userId: userId,
      userPseudo: userPseudo,
      userEmail: userEmail,
      userFistName: userFirstName,
      userLastName: userLastName,
      userPhoto: userPhoto,
      userRole: userRole,
      userLastConnection: userLastConnection,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
