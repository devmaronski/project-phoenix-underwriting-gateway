import { z } from 'zod';

export const RiskResponseSchema = z.object({
  score: z.number().min(0).max(100),
  topReasons: z.array(z.string()),
  allReasons: z.array(z.string()).optional(),
});

export type RiskDto = z.infer<typeof RiskResponseSchema>;
