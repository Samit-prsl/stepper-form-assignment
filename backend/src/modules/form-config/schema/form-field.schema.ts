import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class FieldOption {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  value: string;
}

export const FieldOptionSchema = SchemaFactory.createForClass(FieldOption);

@Schema({ _id: false })
export class FormField {
  @Prop({
    required: true,
  })
  id: string;

  @Prop({
    required: true,
  })
  label: string;

  @Prop({
    required: true,
  })
  type: string;

  @Prop({
    default: false,
  })
  required: boolean;

  @Prop()
  placeholder?: string;

  @Prop({
    type: [FieldOptionSchema],
    default: [],
  })
  options?: FieldOption[];

  @Prop({
    default: 255,
  })
  maxLength?: number;

  @Prop({
    default: 1,
  })
  minLength?: number;
}

export const FormFieldSchema = SchemaFactory.createForClass(FormField);
