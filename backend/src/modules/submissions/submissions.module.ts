import { Module } from '@nestjs/common';
import { SubmissionController } from './submissions.controller';
import { SubmissionService } from './submissions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FormConfig, FormConfigSchema } from '../form-config/schema/form-config.schema';
import { Submission, SubmissionSchema } from './schema/submission.schema';
import { FormValidatorService } from 'src/common/validator.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
      { name: FormConfig.name, schema: FormConfigSchema },
    ]),
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService, FormValidatorService],
})
export class SubmissionsModule {}
