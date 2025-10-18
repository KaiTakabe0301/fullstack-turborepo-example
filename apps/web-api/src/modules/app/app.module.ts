import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { HelloModule } from '@/modules/hello/hello.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { AppService } from './app.service';
import { validate } from '@/config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
    PrismaModule,
    AuthModule,
    HelloModule,
  ],
  providers: [AppService],
})
export class AppModule {}
