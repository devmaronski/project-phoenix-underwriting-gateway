import type { RiskDto } from '../../risk/dto/risk.dto';

export interface LoanDto {
  id: string;
  borrower_name: string;
  loan_amount_dollars: number;
  issued_date: string;
  interest_rate_percent: number;
  term_months: number;
}

export interface LoanResponseDto {
  loan: LoanDto;
  risk: RiskDto;
}
