/* eslint-disable prettier/prettier */
import { Request } from 'express';

export interface myReq extends Request {
  userId: number;
}
