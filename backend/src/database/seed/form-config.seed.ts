import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const FormConfigModel = app.get(getModelToken('FormConfig'));

  const exists = await FormConfigModel.findOne({
    title: 'Wellness Intake Form',
  });

  if (exists) {
    Logger.log('Already seeded');
    process.exit();
  }

  await FormConfigModel.create({
    title: 'Wellness Intake Form',
    steps: [
      {
        id: 'step_1',
        title: 'Personal Details',
        fields: [
          {
            id: 'name',
            label: 'Full Name',
            type: 'TEXT',
            required: true,
            placeholder: 'Enter your full name',
            minLength: 2,
            maxLength: 100,
          },
          {
            id: 'age',
            label: 'Age',
            type: 'TEXT',
            required: true,
            placeholder: 'Enter age',
          },
          {
            id: 'gender',
            label: 'Gender',
            type: 'SELECT',
            required: true,
            options: [
              {
                label: 'Male',
                value: 'male',
              },
              {
                label: 'Female',
                value: 'female',
              },
              {
                label: 'Other',
                value: 'other',
              },
              {
                label: 'Prefer Not Say',
                value: 'prefer-not-say',
              },
            ],
          },
        ],
      },
      {
        id: 'step_2',
        title: 'Wellness Preferences',
        fields: [
          {
            id: 'primary_goal',
            label: 'Primary Goal',
            type: 'SELECT',
            required: true,
            options: [
              {
                label: 'Sleep better',
                value: 'sleep_better',
              },
              {
                label: 'Improve focus',
                value: 'improve_focus',
              },
              {
                label: 'Reduce stress',
                value: 'reduce_stress',
              },
              {
                label: 'Build strength',
                value: 'build_strength',
              },
            ],
          },
          {
            id: 'support_type',
            label: 'Preferred Support Type',
            type: 'RADIO',
            required: true,
            options: [
              {
                label: 'Self Guided',
                value: 'self_guided',
              },
              {
                label: 'Coach Support',
                value: 'coach_support',
              },
              {
                label: 'Not Sure',
                value: 'not_sure',
              },
            ],
          },
          {
            id: 'notes',
            label: 'Notes',
            type: 'TEXTAREA',
            required: false,
            placeholder: 'Additional notes',
            maxLength: 500,
          },
        ],
      },
      {
        id: 'step_3',
        title: 'Availability',
        fields: [
          {
            id: 'preferred_time',
            label: 'Preferred Time',
            type: 'SELECT',
            required: false,
            options: [
              { label: 'Morning (8:00 AM - 12:00 PM)', value: 'morning' },
              { label: 'Afternoon (12:00 PM - 5:00 PM)', value: 'afternoon' },
              { label: 'Evening (5:00 PM - 9:00 PM)', value: 'evening' },
            ],
          },
          {
            id: 'preferred_contact_method',
            label: 'Preferred Contact Method',
            type: 'RADIO',
            required: true,
            options: [
              {
                label: 'Email',
                value: 'email',
              },
              {
                label: 'Phone',
                value: 'phone',
              },
              {
                label: 'SMS',
                value: 'sms',
              },
            ],
          },
          {
            id: 'additional_details',
            label: 'Additional Details',
            type: 'TEXTAREA',
            required: false,
          },
        ],
      },
    ],
  });

  Logger.log('Seeded');

  process.exit();
}

bootstrap();
