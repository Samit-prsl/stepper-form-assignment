import { Injectable } from '@nestjs/common';

@Injectable()
export class FormValidatorService {
  validateStep(step: any, answers: Record<string, unknown>): string[] {
    const errors: string[] = [];

    for (const field of step.fields) {
      const value = answers[field.id];

      if (
        field.required &&
        (value === undefined || value === null || value === '')
      ) {
        errors.push(`${field.label} is required`);
        continue;
      }

      if (!value && !field.required) {
        continue;
      }

      if (['SELECT', 'RADIO'].includes(field.type)) {
        const validOption = field.options?.some(
          (option) => option.value === value,
        );

        if (!validOption) {
          errors.push(`${field.label} contains invalid value`);
        }
      }

      if (
        ['TEXT', 'TEXTAREA'].includes(field.type) &&
        typeof value === 'string'
      ) {
        if (field.minLength && value.length < field.minLength) {
          errors.push(
            `${field.label} must be at least ${field.minLength} characters`,
          );
        }

        if (field.maxLength && value.length > field.maxLength) {
          errors.push(
            `${field.label} cannot exceed ${field.maxLength} characters`,
          );
        }
      }
    }

    return errors;
  }
}
