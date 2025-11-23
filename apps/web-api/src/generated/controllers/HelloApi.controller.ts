import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { HelloApi } from '../api';
import { HelloResponse } from '../models';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';

@Controller()
export class HelloApiController {
  constructor(private readonly helloApi: HelloApi) {}

  @Get('/v1/hello')
  @UseGuards(JwtAuthGuard)
  helloGetHello(
    @Req() request: Request
  ): HelloResponse | Promise<HelloResponse> | Observable<HelloResponse> {
    return this.helloApi.helloGetHello(request);
  }
}
