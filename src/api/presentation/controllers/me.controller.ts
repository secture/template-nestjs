import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../../shared/domain/entities/user.entity';
import { GetMeHandler } from '../../application/get-me-user/get-me-user.handler';
import { GetMeQuery } from '../../application/get-me-user/get-me-user.query';
import { UserResponse } from '../dto/response/user-me.response';

@ApiTags('User')
@Controller('me')
@UseGuards(AuthGuard('jwt'))
export class GetMeController {
  constructor(private readonly getMeHandler: GetMeHandler) {}
  @Get()
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user data',
    type: UserResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async getMeUser(@Req() req: any): Promise<UserResponse> {
    const userId = req.user.userId;

    const getMeQuery = new GetMeQuery(userId);
    const user: User = await this.getMeHandler.handler(getMeQuery);

    return UserResponse.createFromUser(user);
  }
}
