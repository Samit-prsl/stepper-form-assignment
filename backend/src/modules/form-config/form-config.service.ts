import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FormConfig } from "./schema/form-config.schema";
import { Model } from "mongoose";
import { FormConfigDocument } from "src/database/types/mongoose.type";
import { CreateFormConfigDto } from "./dto/form-config.dto";

@Injectable()
export class FormConfigService {
  constructor(
    @InjectModel(FormConfig.name)
    private readonly formConfigModel: Model<FormConfigDocument>,
  ) {}

  async findById(id: string) {
    const config = await this.formConfigModel.findById(id);

    if (!config) {
      throw new NotFoundException('Form configuration not found');
    }

    return config;
  }

  async findByTitle(title: string) {
    const config = await this.formConfigModel.findOne({ title });

    if (!config) {
      throw new NotFoundException('Form configuration not found');
    }

    return config;
  }

  async create(dto: CreateFormConfigDto) {
    const formConfig = await this.formConfigModel.create(dto);

    return formConfig;
  }

  async findAllTitles() {
    return this.formConfigModel.find().select('_id title').lean();
  }
}



