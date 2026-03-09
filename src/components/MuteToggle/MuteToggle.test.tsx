import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MuteToggle } from './MuteToggle';

describe('MuteToggle', () => {
  it('renders unmuted state correctly', () => {
    render(<MuteToggle isMuted={false} onToggle={jest.fn()} />);
    expect(screen.getByRole('button', { name: /mute your microphone/i })).toBeInTheDocument();
    expect(screen.getByText('I can talk')).toBeInTheDocument();
  });

  it('renders muted state correctly', () => {
    render(<MuteToggle isMuted={true} onToggle={jest.fn()} />);
    expect(screen.getByRole('button', { name: /unmute your microphone/i })).toBeInTheDocument();
    expect(screen.getByText("I'm quiet")).toBeInTheDocument();
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
    expect(screen.getByText('tap to mute')).toBeInTheDocument();

    rerender(<MuteToggle isMuted={true} onToggle={jest.fn()} />);
    expect(screen.getByText('tap to speak')).toBeInTheDocument();
  });

  it('is keyboard accessible via Space', async () => {
    const onToggle = jest.fn();
    render(<MuteToggle isMuted={false} onToggle={onToggle} />);

    screen.getByRole('button').focus();
    await userEvent.keyboard(' ');
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
