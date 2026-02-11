import { LoansController } from './loans.controller';
import { LoansService } from './loans.service';
import { AppError } from '../common/errors/app-error';
import { LoanSanitized } from './transform/loan.schema';
import type { LoanResponseDto } from './dto/loan-response.dto';

describe('LoansController', () => {
  let controller: LoansController;
  let service: LoansService;

  const mockLoan: LoanSanitized = {
    id: 'loan-1',
    borrower_name: 'John Doe',
    loan_amount_dollars: 5000,
    issued_date: '2023-01-01T00:00:00.000Z',
    interest_rate_percent: 5.5,
    term_months: 60,
  };

  beforeEach(() => {
    service = {
      getLoan: jest.fn(),
    } as unknown as LoansService;

    controller = new LoansController(service);
  });

  describe('getLoan', () => {
    it('should call service and return result', async () => {
      const mockResult: LoanResponseDto = {
        loan: mockLoan,
        risk: {
          score: 65,
          topReasons: ['High amount'],
          allReasons: ['High amount', 'Standard review'],
        },
      };

      const getLoanSpy = jest
        .spyOn(service, 'getLoan')
        .mockResolvedValue(mockResult);

      const result = await controller.getLoan('loan-1');

      expect(getLoanSpy).toHaveBeenCalledWith('loan-1');
      expect(result).toEqual(mockResult);
    });

    it('should propagate service errors', async () => {
      jest
        .spyOn(service, 'getLoan')
        .mockRejectedValueOnce(new AppError('NOT_FOUND', 'Loan not found'));

      await expect(controller.getLoan('non-existent')).rejects.toThrow(
        AppError,
      );
    });

    it('should propagate LEGACY_DATA_CORRUPT errors', async () => {
      jest
        .spyOn(service, 'getLoan')
        .mockRejectedValueOnce(
          new AppError('LEGACY_DATA_CORRUPT', 'Invalid data'),
        );

      await expect(controller.getLoan('corrupt-id')).rejects.toThrow(AppError);
    });

    it('should propagate AI_TIMEOUT errors', async () => {
      jest
        .spyOn(service, 'getLoan')
        .mockRejectedValueOnce(new AppError('AI_TIMEOUT', 'Timeout'));

      await expect(controller.getLoan('loan-1')).rejects.toThrow(AppError);
    });

    it('should propagate AI_UNAVAILABLE errors', async () => {
      jest
        .spyOn(service, 'getLoan')
        .mockRejectedValueOnce(
          new AppError('AI_UNAVAILABLE', 'Service unavailable'),
        );

      await expect(controller.getLoan('loan-1')).rejects.toThrow(AppError);
    });
  });
});
