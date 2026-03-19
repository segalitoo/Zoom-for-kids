import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuteToggle } from './MuteToggle';

describe('MuteToggle', () => {
  it('renders unmuted state correctly', () => {
    render(<MuteToggle isMuted={false} onToggle={jest.fn()} />);
    expect(screen.getByRole('button', { name: /השתק מיקרופון/i })).toBeInTheDocument();
    expect(screen.getByText('אֲנִי מְדַבֵּר')).toBeInTheDocument();
  });

  it('renders muted state correctly', () => {
    render(<MuteToggle isMuted={true} onToggle={jest.fn()} />);
    expect(screen.getByRole('button', { name: /הפעל מיקרופון/i })).toBeInTheDocument();
    expect(screen.getByText('אֲנִי בְּשֶׁקֶט')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = jest.fn();
    render(<MuteToggle isMuted={false} onToggle={onToggle} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onToggle when muted and clicked', async () => {
    const onToggle = jest.fn();
    render(<MuteToggle isMuted={true} onToggle={onToggle} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-pressed attribute', () => {
    const { rerender } = render(<MuteToggle isMuted={false} onToggle={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

    rerender(<MuteToggle isMuted={true} onToggle={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows action hint text', () => {
    const { rerender } = render(<MuteToggle isMuted={false} onToggle={jest.fn()} />);
    expect(screen.getByText('לְחַץ לְהַשְׁתִּיק')).toBeInTheDocument();

    rerender(<MuteToggle isMuted={true} onToggle={jest.fn()} />);
    expect(screen.getByText('לְחַץ לְדַבֵּר')).toBeInTheDocument();
  });

  it('is keyboard accessible via Space', async () => {
    const onToggle = jest.fn();
    render(<MuteToggle isMuted={false} onToggle={onToggle} />);

    screen.getByRole('button').focus();
    await userEvent.keyboard(' ');
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
