import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsObject, IsString } from 'class-validator';


 export class CreateSubmissionDto {
   @ApiProperty({
     example: '[formConfigId]',
   })
   @IsMongoId()
   @IsNotEmpty()
   formConfigId: string;

   @ApiProperty({
     example: 'step_1/step_2/step_3',
   })
   @IsString()
   stepId: string;

   @ApiProperty({
     description: 'Dynamic answers for the current step',
     example: {
       name: 'Samit Bhattacharjee',
       age: '25',
       gender: 'male',
     },
   })
   @IsObject()
   answers: Record<string, unknown>;
 }
