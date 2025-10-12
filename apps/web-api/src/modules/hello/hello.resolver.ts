import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { HelloService } from './hello.service';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';

@Resolver()
export class HelloResolver {
  constructor(private readonly helloService: HelloService) {}

  @Query(() => String)
  @UseGuards(JwtAuthGuard)
  hello(): string {
    return this.helloService.getHello();
  }
}