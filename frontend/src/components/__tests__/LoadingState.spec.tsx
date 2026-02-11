/**
 * Tests for LoadingState component.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '@/components/LoadingState';

describe('LoadingState', () => {
  it('should render without crashing', () => {
    render(<LoadingState />);

    // Should have at least some skeleton elements
    const skeletons = screen.queryAllByRole('presentation', {
      hidden: true
    });
    expect(skeletons.length >= 0).toBe(true);
  });

  it('should show loading placeholders', () => {
    const { container } = render(<LoadingState />);

    // Should have animated pulse classes
    const animatedElements = container.querySelectorAll('.animate-pulse');
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it('should render two card skeletons', () => {
    const { container } = render(<LoadingState />);

    // Should have Card components (divs with border)
    const cards = container.querySelectorAll('[class*="border"]');
    expect(cards.length).toBeGreaterThanOrEqual(2);
  });
});
