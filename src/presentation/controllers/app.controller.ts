import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Élevé')
@Controller()
export class AppController {
  @Get()
  @ApiResponse({ status: 200, description: 'Says "Hello World!".' })
  getHello(): string {
    return 'Hello World!';
  }
}
