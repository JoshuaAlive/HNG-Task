// import { Module } from '@nestjs/common';
// import { ClassifyService } from './classify.service';
// import { ClassifyController } from './classify.controller';
// import { HttpModule } from '@nestjs/axios';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     HttpModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         timeout: configService.get<number>('HTTP_TIMEOUT_MS', 4500),
//         maxRedirects: configService.get<number>('HTTP_MAX_REDIRECTS', 3),
//       }),
//     }),
//   ],
//   controllers: [ClassifyController],
//   providers: [ClassifyService],
// })
// export class ClassifyModule {}


import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClassifyController } from './classify.controller';
import { ClassifyService } from './classify.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 3,
    }),
  ],
  controllers: [ClassifyController],
  providers: [ClassifyService],
})
export class ClassifyModule {}