import { RiskResponseSchema } from './risk.dto';

describe('RiskResponseSchema', () => {
  it('should parse a valid risk response', () => {
    const risk = {
      score: 72,
      topReasons: ['debt-to-income', 'short credit history'],
      allReasons: ['debt-to-income', 'short credit history', 'low savings'],
    };

    const result = RiskResponseSchema.safeParse(risk);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(risk);
    }
  });

  it('should reject score above 100', () => {
    const risk = {
      score: 150,
      topReasons: ['high utilization'],
    };

    const result = RiskResponseSchema.safeParse(risk);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe('score');
    }
  });

  it('should reject missing topReasons', () => {
    const risk = {
      score: 45,
    } as unknown;

    const result = RiskResponseSchema.safeParse(risk);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe('topReasons');
    }
  });
});
