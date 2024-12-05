import { Test, TestingModule } from '@nestjs/testing';
import { GetAppVersionsHandler } from '../../application/get-app-versions/get-app-versions.handler';
import { AppVersionsHttpDto } from '../dto/app-versions-http.dto';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: GetAppVersionsHandler,
          useValue: {
            handle: jest.fn().mockReturnValue({
              supportedVersion: '1.0.0',
              recommendedVersion: '1.2.3',
            }),
          },
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  describe('get hello', () => {
    it('should return "Hello World!"', () => {
      expect(controller.getHello()).toBe('Hello World!');
    });
  });

  describe('get app version', () => {
    it('should return the app versions', () => {
      const result = controller.getAppVersions();

      expect(result).toBeInstanceOf(AppVersionsHttpDto);
      expect(result.supportedVersion).toBe('1.0.0');
      expect(result.recommendedVersion).toBe('1.2.3');
    });
  });
});
