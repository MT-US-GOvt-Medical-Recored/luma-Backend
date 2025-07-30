import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE } from "src/constants";
import { IAuthenticatedRequest } from "src/shared/interfaces";
import { User } from "src/app/auth/entities/user.entity";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private validateRole() {
    return true;
  }

  canActivate(context: ExecutionContext): boolean {
    return this.validateRole();
  }
}
