import Request from "express";
import { Session } from "src/app/auth/entities";
import { User } from "src/app/auth/entities/user.entity";

export interface IAuthenticatedRequest extends Request {
  user: User & { session: Session };
}
