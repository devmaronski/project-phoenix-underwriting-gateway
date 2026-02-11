import { z } from 'zod';
import { LoanSanitizedSchema } from '../transform/loan.schema';
import { RiskResponseSchema } from '../../risk/dto/risk.dto';

export const LoanResponseSchema = z.object({
  loan: LoanSanitizedSchema,
  risk: RiskResponseSchema,
});

export type LoanResponseDto = z.infer<typeof LoanResponseSchema>;
