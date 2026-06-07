import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { FormConfigModule } from './modules/form-config/form-config.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri =
          configService.get<string>('DEPLOYED_MONGO_URI') ||
          configService.get<string>('MONGO_URI');
        return { uri };
      },
    }),
    FormConfigModule,
    SubmissionsModule,
  ],
})
export class AppModule {}
