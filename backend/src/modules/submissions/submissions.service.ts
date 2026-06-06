import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission } from './schema/submission.schema';
import { FormConfig } from '../form-config/schema/form-config.schema';
import {
  FormConfigDocument,
  SubmissionDocument,
} from 'src/database/types/mongoose.type';
import { FormValidatorService } from 'src/common/validator.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SaveDraftDto } from './dto/save-draft.dto';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectModel(Submission.name)
    private readonly submissionModel: Model<SubmissionDocument>,

    @InjectModel(FormConfig.name)
    private readonly formConfigModel: Model<FormConfigDocument>,

    private readonly formValidatorService: FormValidatorService,
  ) {}

  async create(dto: CreateSubmissionDto) {
    const formConfig = await this.formConfigModel.findById(dto.formConfigId);

    if (!formConfig) {
      throw new NotFoundException('Form configuration not found');
    }

    const hasAnswer = Object.values(dto.answers ?? {}).some(
      (value) => value !== undefined && value !== null && value !== '',
    );

    if (!hasAnswer) {
      throw new BadRequestException('At least one answer is required');
    }

    const step = formConfig.steps.find((step) => step.id === dto.stepId);

    if (!step) {
      throw new BadRequestException('Invalid step');
    }

    const errors = this.formValidatorService.validateStep(step, dto.answers);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return this.submissionModel.create({
      formConfigId: dto.formConfigId,
      status: 'DRAFT',
      answers: dto.answers,
      completedSteps: [dto.stepId],
      progress: 1,
    });
  }

  async findAll() {
    return this.submissionModel.find().sort({ updatedAt: -1 });
  }

  async findOne(id: string) {
    const submission = await this.submissionModel.findById(id);

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }

  async getSubmissionList() {
    const submissions = await this.submissionModel
      .find()
      .populate('formConfigId', 'title steps')
      .sort({ updatedAt: -1 })
      .lean();

    return submissions.map((submission) => ({
      _id: submission._id,
      title: (submission.formConfigId as any)?.title,
      status: submission.status,
      progress: `${submission.completedSteps.length}/${(submission.formConfigId as any)?.steps.length}`,
    }));
  }

  async update(id: string, dto: SaveDraftDto) {
    const submission = await this.findOne(id);

    const formConfig = await this.formConfigModel.findById(
      submission.formConfigId,
    );

    if (!formConfig) {
      throw new NotFoundException('Form configuration not found');
    }

    const step = formConfig.steps.find((step) => step.id === dto.stepId);

    if (!step) {
      throw new BadRequestException('Invalid step');
    }

    const hasAnswer = Object.values(dto.answers ?? {}).some(
      (value) => value !== undefined && value !== null && value !== '',
    );

    if (!hasAnswer) {
      throw new BadRequestException('At least one answer is required');
    }

    const errors = this.formValidatorService.validateStep(step, dto.answers);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    submission.answers = {
      ...submission.answers,
      ...dto.answers,
    };

    const completedSteps = new Set(submission.completedSteps);

    completedSteps.add(dto.stepId);

    submission.completedSteps = [...completedSteps];

    submission.progress = completedSteps.size;

    submission.currentStep = Math.min(
      completedSteps.size,
      formConfig.steps.length - 1,
    );

    await submission.save();

    return submission;
  }

  async complete(id: string) {
    const submission = await this.findOne(id);

    if (submission.status === 'COMPLETED') {
      throw new BadRequestException('Submission already completed');
    }

    const formConfig = await this.formConfigModel.findById(
      submission.formConfigId,
    );

    if (!formConfig) {
      throw new NotFoundException('Form configuration not found');
    }

    const allErrors: string[] = [];

    for (const step of formConfig.steps) {
      const errors = this.formValidatorService.validateStep(
        step,
        submission.answers,
      );

      allErrors.push(...errors);
    }

    if (allErrors.length > 0) {
      throw new BadRequestException(allErrors);
    }

    submission.status = 'COMPLETED';

    submission.completedSteps = formConfig.steps.map((step) => step.id);

    submission.progress = formConfig.steps.length;

    submission.currentStep = formConfig.steps.length - 1;

    await submission.save();

    return submission;
  }

  async remove(id: string) {
    const submission = await this.submissionModel.findByIdAndDelete(id);

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return {
      message: 'Submission deleted successfully',
    };
  }
}
