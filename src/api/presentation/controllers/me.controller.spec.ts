import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../../shared/domain/entities/user.entity';
import { GetMeHandler } from '../../application/get-me-user/get-me-user.handler';
import { GetMeQuery } from '../../application/get-me-user/get-me-user.query';
import { UserResponse } from '../dto/response/user-me.response';
import { GetMeController } from './me.controller';

describe('GetMeController', () => {
  let controller: GetMeController;
  let getMeHandler: GetMeHandler;

  const mockUser = new User(
    '123',
    new Date(),
    new Date(),
    'Test',
    'User',
    'test@example.com',
  );

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GetMeController],
      providers: [
        {
          provide: GetMeHandler,
          useValue: {
            handler: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<GetMeController>(GetMeController);
    getMeHandler = app.get<GetMeHandler>(GetMeHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('should return authenticated user data', async () => {
      jest.spyOn(getMeHandler, 'handler').mockResolvedValue(mockUser);
      const mockRequest = { user: { userId: mockUser.id } } as any;
      const query: GetMeQuery = new GetMeQuery(mockUser.id);

      const result = await controller.getMeUser(mockRequest);

      expect(getMeHandler.handler).toHaveBeenCalledWith(query);
      expect(result).toEqual(UserResponse.createFromUser(mockUser));
    });
  });
});
