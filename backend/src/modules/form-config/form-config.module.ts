import { Module } from '@nestjs/common';
import { FormConfigController } from './form-config.controller';
import { FormConfigService } from './form-config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FormConfig, FormConfigSchema } from './schema/form-config.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FormConfig.name, schema: FormConfigSchema },
    ]),
  ],
  controllers: [FormConfigController],
  providers: [FormConfigService],
})
export class FormConfigModule {}
