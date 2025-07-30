import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  constructor() {}

  getHello() {
    return "Billboard server is up and running perfectly fine.";
  }
}
