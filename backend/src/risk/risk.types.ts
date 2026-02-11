import { z } from 'zod';
import { RiskResponseSchema } from './dto/risk.dto';

/**
 * Risk scoring response from external AI service
 */
export type RiskResponse = z.infer<typeof RiskResponseSchema>;
