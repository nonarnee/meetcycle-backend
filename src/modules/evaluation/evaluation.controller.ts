import { Controller, Post, Body } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationDocument } from './evaluation.schema';
import { CreateEvaluationRequest } from './dto/request/create-evaluation.request';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async create(
    @Body() createEvaluationRequest: CreateEvaluationRequest,
  ): Promise<EvaluationDocument> {
    return this.evaluationService.create(createEvaluationRequest);
  }
}
