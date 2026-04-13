export interface ClassifyResult {
  status: 'success';
  data: {
    name: string;
    gender: string;
    probability: number;
    sample_size: number;
    is_confident: boolean;
    processed_at: string;
  };
}
