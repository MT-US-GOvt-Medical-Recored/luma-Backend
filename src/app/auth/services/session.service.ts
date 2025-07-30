import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BaseService } from "src/shared/classes/base.service";
import { Session } from "../entities";

@Injectable()
export class SessionService extends BaseService<Session> {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>
  ) {
    super(sessionRepository); 
  }

  async deleteSession(id: string) {
    return await this.sessionRepository.delete(id);
  }
}
