import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateSubmissionDto } from "./dto/create-submission.dto";
import { SaveDraftDto } from "./dto/save-draft.dto";
import { SubmissionService } from "./submissions.service";

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(
    @Body()
    dto: CreateSubmissionDto,
  ) {
    return this.submissionService.create(dto);
  }

  @Get()
  findAll() {
    return this.submissionService.findAll();
  }

  @Get('list')
  findAllList() {
    return this.submissionService.getSubmissionList();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.submissionService.findOne(id);
  }

  @Patch(':id/save')
  saveDraft(
    @Param('id') id: string,
    @Body()
    dto: SaveDraftDto,
  ) {
    return this.submissionService.update(id, dto);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.submissionService.complete(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.submissionService.remove(id);
  }
}
