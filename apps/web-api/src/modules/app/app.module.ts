import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validate } from '@/config/env.validation';
import { ApiImplementations } from '@/generated/api-implementations';
import { ApiModule } from '@/generated/api.module';
import { AppService } from '@/modules/app/app.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { HelloService } from '@/modules/hello/hello.service';
import { PrismaModule } from '@/modules/prisma/prisma.module';

/**
 * Configure API implementations for the generated ApiModule
 * This maps the abstract API classes to concrete service implementations
 */
const apiImplementations: ApiImplementations = {
  helloApi: HelloService,
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
    PrismaModule,
    AuthModule,
    ApiModule.forRoot(apiImplementations),
  ],
  providers: [AppService],
})
export class AppModule {}
