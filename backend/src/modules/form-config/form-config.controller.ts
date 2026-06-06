import { Controller, Param,Get, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FormConfigService } from "./form-config.service";
import { CreateFormConfigDto } from "./dto/form-config.dto";

@ApiTags('Form Config')
@Controller('form-config')
export class FormConfigController {
  constructor(private readonly formConfigService: FormConfigService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.formConfigService.findById(id);
  }

  @Get(':title')
  getByTitle(@Param('title') title: string) {
    return this.formConfigService.findByTitle(title);
  }

  @Get()
  findAllTitles() {
    return this.formConfigService.findAllTitles();
  }

  @Post()
  create(@Body() dto: CreateFormConfigDto) {
    return this.formConfigService.create(dto);
  }
}
