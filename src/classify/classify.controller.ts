import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ClassifyService } from './classify.service';

@Controller('api')
export class ClassifyController {
  constructor(private readonly classifyService: ClassifyService) {}

  @Get('classify')
  async classify(
    @Query('name') name: any,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // 422 – name param is present but not a plain string (e.g. ?name[]=foo → array)
    if (name !== undefined && typeof name !== 'string') {
      res.status(422).json({
        status: 'error',
        message: 'Query parameter "name" must be a string',
      });
      return;
    }

    // 400 – missing entirely OR empty string OR whitespace only
    if (!name || name.trim() === '') {
      res.status(400).json({
        status: 'error',
        message: 'Query parameter "name" is required and must not be empty',
      });
      return;
    }

    const trimmed = name.trim();

    try {
      const result = await this.classifyService.classify(trimmed);
      res.status(200).json(result);
    } catch (err: any) {
      const httpStatus: number =
        typeof err?.status === 'number' ? err.status : 500;
      const body =
        err?.response && typeof err.response === 'object'
          ? err.response
          : { status: 'error', message: 'Internal server error' };
      res.status(httpStatus).json(body);
    }
  }
}
