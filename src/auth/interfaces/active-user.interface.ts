import { UserRole } from '@prisma/client';

export interface ActiveUserInterface {
  id: string;
  email: string;
  role: UserRole;
}
