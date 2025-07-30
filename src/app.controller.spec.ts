import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    const expectedOutputStr =
      "Billboard server is up and running perfectly fine.";
    it(`should return ${expectedOutputStr}`, () => {
      expect(appController.getHello()).toBe(expectedOutputStr);
    });
  });
});
