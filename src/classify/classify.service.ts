import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class ClassifyService {
  private readonly logger = new Logger(ClassifyService.name);
  private readonly GENDERIZE_URL = 'https://api.genderize.io';

  constructor(private readonly httpService: HttpService) {}

  async classify(name: string) {
    let raw: any;

    // ── Call Genderize ─────────────────────────────────────────────────────
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.GENDERIZE_URL, {
          params: { name },
          timeout: 8000,
        }),
      );
      raw = response.data;
      this.logger.log(`Genderize raw response: ${JSON.stringify(raw)}`);
    } catch (err: any) {
      this.logger.error('Genderize API error:', err?.message);
      throw new HttpException(
        { status: 'error', message: 'Failed to reach the Genderize API' },
        HttpStatus.BAD_GATEWAY,
      );
    }

    // ── Edge case: no prediction available ─────────────────────────────────
    if (raw.gender === null || raw.gender === undefined || raw.count === 0) {
      throw new HttpException(
        {
          status: 'error',
          message: 'No prediction available for the provided name',
        },
        HttpStatus.OK,
      );
    }

    // ── Extract & rename ───────────────────────────────────────────────────
    const gender: string      = raw.gender;
    const probability: number = Number(raw.probability);
    const sample_size: number = Number(raw.count);       // count → sample_size

    // ── Confidence logic ───────────────────────────────────────────────────
    const is_confident: boolean = probability >= 0.7 && sample_size >= 100;

    // ── Fresh UTC timestamp every request ──────────────────────────────────
    const processed_at: string = new Date().toISOString();

    return {
      status: 'success',
      data: {
        name,
        gender,
        probability,
        sample_size,
        is_confident,
        processed_at,
      },
    };
  }
}