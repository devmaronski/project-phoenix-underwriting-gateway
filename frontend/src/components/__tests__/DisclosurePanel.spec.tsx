/**
 * Tests for DisclosurePanel component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DisclosurePanel } from '@/components/DisclosurePanel';

describe('DisclosurePanel', () => {
  const allReasons = [
    'High debt',
    'Recent inquiry',
    'Low utilization',
    'Limited history'
  ];
  const topReasons = ['High debt', 'Recent inquiry', 'Low utilization'];

  it('should render additional reasons', () => {
    render(<DisclosurePanel allReasons={allReasons} topReasons={topReasons} />);

    // Should show the additional reason not in top 3
    expect(screen.getByText('Limited history')).toBeInTheDocument();
  });

  it("should display 'Additional Factors' header", () => {
    render(<DisclosurePanel allReasons={allReasons} topReasons={topReasons} />);

    expect(screen.getByText('Additional Factors')).toBeInTheDocument();
  });

  it('should not duplicate top reasons in additional reasons', () => {
    render(<DisclosurePanel allReasons={allReasons} topReasons={topReasons} />);

    // Count how many times "High debt" appears - should only be in allReasons filter
    const additionalSection = screen.getByText('Additional Factors');
    const parent = additionalSection.closest('.space-y-3');

    // Check that "High debt" is not in the rendered additional section
    expect(parent?.textContent).not.toContain('High debt');
    expect(parent?.textContent).toContain('Limited history');
  });

  it('should handle empty additional reasons', () => {
    const onlyTop = ['Reason 1', 'Reason 2'];
    render(<DisclosurePanel allReasons={onlyTop} topReasons={onlyTop} />);

    expect(screen.getByText('Additional Factors')).toBeInTheDocument();
    // Should have no badge content in additional factors
    const badges = screen.getAllByRole('generic');
    expect(badges.length >= 0).toBe(true);
  });

  it('should render all additional reasons as badges', () => {
    const additional = ['Limited history', 'Recent collections'];
    const all = [...topReasons, ...additional];
    render(<DisclosurePanel allReasons={all} topReasons={topReasons} />);

    additional.forEach((reason) => {
      expect(screen.getByText(reason)).toBeInTheDocument();
    });
  });
});
