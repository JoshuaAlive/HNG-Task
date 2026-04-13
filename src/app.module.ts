import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassifyModule } from './classify/classify.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ClassifyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
