
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatCard from './StatCard';

describe('StatCard component', () => {
  it('displays the statistic title', () => {
    render(<StatCard title="Total Medicines" value={15} />);

    expect(screen.getByText('Total Medicines')).toBeInTheDocument();
  });

  it('displays the statistic value', () => {
    render(<StatCard title="Total Medicines" value={15} />);

    expect(screen.getByText('15')).toBeInTheDocument();
  });
});
