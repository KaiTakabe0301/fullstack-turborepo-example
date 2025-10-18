import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HelloService } from './hello.service';
import { HelloResponse, ErrorResponse } from '@/generated/api/model/models';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Hello')
@Controller('api')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get('hello')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get hello message',
    description: 'Get hello message',
    operationId: 'Hello_getHello',
  })
  @ApiOkResponse({
    description: 'Hello message',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
      required: ['statusCode', 'message'],
    },
  })
  getHello(): HelloResponse {
    return {
      message: this.helloService.getHello(),
    };
  }
}
