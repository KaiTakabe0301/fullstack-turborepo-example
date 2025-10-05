import { Module } from '@nestjs/common';
import { HelloService } from './hello.service';
import { HelloResolver } from './hello.resolver';

@Module({
  providers: [HelloService, HelloResolver],
  exports: [HelloService],
})
export class HelloModule {}
