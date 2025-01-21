import { Request } from 'express';

export interface myReq extends Request {
  userId: string;
}
