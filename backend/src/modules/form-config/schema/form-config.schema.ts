import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FormStep, FormStepSchema } from './step.schema';

@Schema({
  timestamps: true,
})
export class FormConfig {
  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    type: [FormStepSchema],
    required: true,
  })
  steps: FormStep[];
}

export const FormConfigSchema = SchemaFactory.createForClass(FormConfig);
