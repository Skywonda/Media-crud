import { Prisma, Status } from '@prisma/client';

export class Media implements Prisma.MediaUncheckedCreateInput {
  id?: string;
  type: string;
  name: string;
  originalname: string;
  description: string;
  url: string;
  status?: Status;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
