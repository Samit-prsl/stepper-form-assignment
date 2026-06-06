import { IsEnum, IsOptional } from 'class-validator';
import { SubmissionStatus } from 'enums/list-submission.enum';

export class ListSubmissionDto {
  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;

  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;
}
