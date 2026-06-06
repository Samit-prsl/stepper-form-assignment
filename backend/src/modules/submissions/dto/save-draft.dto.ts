import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsString } from "class-validator";

export class SaveDraftDto {
  @ApiProperty({
    example: 'formConfigStepId(step_1/step_2/step_3)',
    description:
      'value of stepId must exactly match the id of a step in your saved FormConfig',
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
