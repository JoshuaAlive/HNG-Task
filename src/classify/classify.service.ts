import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ClassifyResult } from 'src/classifize/classifyResult';


@Injectable()
export class ClassifyService {
  private readonly logger = new Logger(ClassifyService.name);
  private readonly GENDERIZE_URL = 'https://api.genderize.io';

  constructor(private readonly httpService: HttpService) {}

  async classify(name: string): Promise<ClassifyResult> {
    let raw: any;

    // ── 1. Call Genderize API 
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(this.GENDERIZE_URL, { params: { name } }),
      );
      raw = data;
    } catch (error) {
      this.logger.error('Genderize upstream error', error);
      throw new HttpException(
        { status: 'error', message: 'Failed to reach the Genderize API' },
        HttpStatus.BAD_GATEWAY,
      );
    }

    // ── 2. Edge-case: no prediction 
    if (!raw.gender || raw.count === 0) {
      throw new HttpException(
        {
          status: 'error',
          message: 'No prediction available for the provided name',
        },
        HttpStatus.OK, // spec doesn't mandate a 4xx here, return 200 with error body
      );
    }

    // ── 3. Extract & transform 
    const gender: string       = raw.gender;
    const probability: number  = raw.probability;
    const sample_size: number  = raw.count;           // rename: count → sample_size

    // ── 4. Confidence logic ────────────────────────────────────────────────
    const is_confident: boolean = probability >= 0.7 && sample_size >= 100;

    // ── 5. Timestamp – for each request, always UTC ISO 8601
    const processed_at: string = new Date().toISOString();

    return {
      status: 'success',
      data: { name, gender, probability, sample_size, is_confident, processed_at },
    };
  }
}