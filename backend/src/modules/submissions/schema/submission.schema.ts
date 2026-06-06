import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { FormConfig } from "src/modules/form-config/schema/form-config.schema";

@Schema({
  timestamps: true,
})
export class Submission {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: FormConfig.name,
    required:true
  })
  formConfigId: string;

  @Prop({
    default: 'DRAFT',
  })
  status: string;

  @Prop({
    default: 1,
  })
  currentStep: number;

  @Prop({
    type: Object,
    default: {},
  })
  answers: Record<string, any>;

  @Prop({
    type: [String],
    default: [],
  })
  completedSteps: string[];

  @Prop({
    default: 0,
  })
  progress: number;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
