import { LoanResponseSchema } from './loan-response.dto';

describe('LoanResponseSchema', () => {
  it('should parse a valid loan response', () => {
    const response = {
      loan: {
        id: 'LOAN-200',
        borrower_name: 'Katherine Johnson',
        loan_amount_dollars: 3200,
        issued_date: '2024-05-01T00:00:00.000Z',
        interest_rate_percent: 4.9,
        term_months: 72,
      },
      risk: {
        score: 80,
        topReasons: ['stable income', 'low utilization'],
      },
    };

    const result = LoanResponseSchema.safeParse(response);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(response);
    }
  });

  it('should reject missing loan', () => {
    const response = {
      risk: {
        score: 80,
        topReasons: ['stable income'],
      },
    } as unknown;

    const result = LoanResponseSchema.safeParse(response);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe('loan');
    }
  });

  it('should reject invalid risk score', () => {
    const response = {
      loan: {
        id: 'LOAN-201',
        borrower_name: 'Margaret Hamilton',
        loan_amount_dollars: 2200,
        issued_date: '2024-06-15T00:00:00.000Z',
        interest_rate_percent: 5.1,
        term_months: 36,
      },
      risk: {
        score: -5,
        topReasons: ['insufficient history'],
      },
    };

    const result = LoanResponseSchema.safeParse(response);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe('risk');
    }
  });
});
