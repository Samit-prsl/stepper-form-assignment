import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { FormField, FormFieldSchema } from "./form-field.schema";

@Schema({ _id: false })
export class FormStep {
  @Prop({
    required: true,
  })
  id: string;

  @Prop({
    required: true,
  })
  title: string;

  @Prop({
    type: [FormFieldSchema],
    required: true,
  })
  fields: FormField[];
}

export const FormStepSchema = SchemaFactory.createForClass(FormStep);
