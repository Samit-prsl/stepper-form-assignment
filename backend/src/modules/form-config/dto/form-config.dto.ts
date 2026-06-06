import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FieldType } from 'enums/field-type.enum';

export class FieldOptionDto {
  @ApiProperty({
    example: 'Male',
    description: 'Display label for option',
  })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    example: 'male',
    description: 'Actual value stored in DB',
  })
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class CreateFieldDto {
  @ApiProperty({
    example: 'gender',
    description: 'Unique field identifier',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'Gender',
  })
  @IsString()
  label: string;

  @ApiProperty({
    enum: FieldType,
    example: FieldType.SELECT,
  })
  @IsEnum(FieldType)
  type: FieldType;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  required: boolean;

  @ApiPropertyOptional({
    example: 'Select your gender',
  })
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiPropertyOptional({
    type: [FieldOptionDto],
    example: [
      {
        label: 'Male',
        value: 'male',
      },
      {
        label: 'Female',
        value: 'female',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldOptionDto)
  options?: FieldOptionDto[];

  @ApiPropertyOptional({
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  minLength?: number;

  @ApiPropertyOptional({
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  maxLength?: number;
}

export class CreateStepDto {
  @ApiProperty({
    example: 'step_1',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'Personal Information',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: [CreateFieldDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFieldDto)
  fields: CreateFieldDto[];
}

export class CreateFormConfigDto {
  @ApiProperty({
    example: 'Health Assessment Form',
  })
  @IsString()
  title: string;

  @ApiProperty({
    type: [CreateStepDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStepDto)
  steps: CreateStepDto[];
}
