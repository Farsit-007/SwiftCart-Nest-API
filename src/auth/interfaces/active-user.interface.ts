import { UserRole } from '@prisma/client';

export interface ActiveUserInterface {
  id: number;
  email: string;
  role: UserRole;
}
