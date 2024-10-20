export interface User {
  id?: string;
  email: string;
  password: string;
  pseudo: string;
  avatar?: string;
  role?: string;
  createdAt: Date;
  idInvitation: string;
}
