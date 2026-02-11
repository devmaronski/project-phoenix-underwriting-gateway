import { Controller, Get, Param } from '@nestjs/common';
import { LoansService } from './loans.service';
import type { LoanResponseDto } from './dto/loan-response.dto';

/**
 * LoansController - Handles loan-related HTTP endpoints
 */
@Controller('loans')
export class LoansController {
  constructor(private loansService: LoansService) {}

  /**
   * Get a loan by ID with risk scoring
   * @param id - The loan ID
   * @returns Loan with risk assessment
   */
  @Get(':id')
  async getLoan(@Param('id') id: string): Promise<LoanResponseDto> {
    return this.loansService.getLoan(id);
  }
}
