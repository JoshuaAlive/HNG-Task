import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
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
    res.setHeader('Access-Control-Allow-Origin', '*'); // CORS header

    // Input Validation - 400(Missing or Empty)
    if (name === undefined || name === null || name === '') {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: "error",
        message: 'Query parameter "name" is required and must not be empty',
      });
      return;
    }

    // Input Validation - 422(Present but not a string)
    if (typeof name !== 'string') {
      res.status(422).json({
        status: 'error',
        message: 'Query parameter "name must be a string',
      });
      return;
    }

    // Input Validation - 400(whitespace-only string)
    const trimmed = name.trim();
    if (trimmed === '') {
      res.status(HttpStatus.BAD_REQUEST).json({
        status: 'error',
        message: 'Query parameter "name" is required andmust not be empty',
      });
      return;
    }

    // Service Call
    try {
      const result = await this.classifyService.classify(trimmed);
      res.status(HttpStatus.OK).json(result);
    } catch (err: any) {
      const httpStatus: number =
        typeof err?.status === 'number' ? err.status : HttpStatus.INTERNAL_SERVER_ERROR;

        const body = 
        err?.response && typeof err.response === 'object'
        ? err.response
        : { status: 'error', message: 'Internal server error' };
        res.status(httpStatus).json(body);
      
    }






  }
}
