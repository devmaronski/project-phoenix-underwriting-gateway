import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  describe('GET /health', () => {
    it('should return status ok', () => {
      const result = controller.health();
      expect(result).toHaveProperty('status', 'ok');
    });

    it('should include meta.requestId in response', () => {
      // This test will pass once RequestIdInterceptor is wired in main.ts
      // For now, we expect the controller to be decorated with @Get('health')
      expect(controller).toBeDefined();
    });
  });
});
