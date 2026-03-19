import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HandRaiseButton } from './HandRaiseButton';

describe('HandRaiseButton', () => {
  it('renders with "הָרֵם יָד" label when hand is not raised', () => {
    render(<HandRaiseButton isHandRaised={false} onRaise={jest.fn()} onLower={jest.fn()} />);
    expect(screen.getByRole('button', { name: /הָרֵם יָד/i })).toBeInTheDocument();
  });

  it('renders with "הוֹרֵד יָד" label when hand is raised', () => {
    render(<HandRaiseButton isHandRaised={true} onRaise={jest.fn()} onLower={jest.fn()} />);
    expect(screen.getByRole('button', { name: /הוֹרֵד יָד/i })).toBeInTheDocument();
  });

  it('shows "הוֹרֵד יָד" text when raised', () => {
    render(<HandRaiseButton isHandRaised={true} onRaise={jest.fn()} onLower={jest.fn()} />);
    expect(screen.getByText('הוֹרֵד יָד')).toBeInTheDocument();
  });

  it('shows "הָרֵם יָד" text when not raised', () => {
    render(<HandRaiseButton isHandRaised={false} onRaise={jest.fn()} onLower={jest.fn()} />);
    expect(screen.getByText('הָרֵם יָד')).toBeInTheDocument();
  });

  it('calls onRaise when clicked and hand is not raised', async () => {
    const onRaise = jest.fn();
    render(<HandRaiseButton isHandRaised={false} onRaise={onRaise} onLower={jest.fn()} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onRaise).toHaveBeenCalledTimes(1);
  });

  it('calls onLower when clicked and hand is raised', async () => {
    const onLower = jest.fn();
    render(<HandRaiseButton isHandRaised={true} onRaise={jest.fn()} onLower={onLower} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onLower).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-pressed attribute', () => {
    const { rerender } = render(
      <HandRaiseButton isHandRaised={false} onRaise={jest.fn()} onLower={jest.fn()} />,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

    rerender(<HandRaiseButton isHandRaised={true} onRaise={jest.fn()} onLower={jest.fn()} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('is keyboard accessible via Enter', async () => {
    const onRaise = jest.fn();
    render(<HandRaiseButton isHandRaised={false} onRaise={onRaise} onLower={jest.fn()} />);

    screen.getByRole('button').focus();
    await userEvent.keyboard('{Enter}');
    expect(onRaise).toHaveBeenCalledTimes(1);
  });
});
