import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmojiPanel } from './EmojiPanel';

function makeProps() {
  return {
    onClap: jest.fn(),
    onThumbsUp: jest.fn(),
    onHeart: jest.fn(),
    onLaugh: jest.fn(),
    onParty: jest.fn(),
    onWow: jest.fn(),
  };
}

describe('EmojiPanel', () => {
  it('renders all 6 reaction buttons', () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    expect(screen.getByRole('button', { name: /כל הכבוד/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /סבבה/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /אהבה/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /מצחיק/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /יאללה/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /וואו/i })).toBeInTheDocument();
  });

  it('calls onClap when כל הכבוד button is clicked', async () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    await userEvent.click(screen.getByRole('button', { name: /כל הכבוד/i }));
    expect(props.onClap).toHaveBeenCalledTimes(1);
  });

  it('calls onThumbsUp when סבבה button is clicked', async () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    await userEvent.click(screen.getByRole('button', { name: /סבבה/i }));
    expect(props.onThumbsUp).toHaveBeenCalledTimes(1);
  });

  it('calls onHeart when אהבה button is clicked', async () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    await userEvent.click(screen.getByRole('button', { name: /אהבה/i }));
    expect(props.onHeart).toHaveBeenCalledTimes(1);
  });

  it('calls onParty when יאללה button is clicked', async () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    await userEvent.click(screen.getByRole('button', { name: /יאללה/i }));
    expect(props.onParty).toHaveBeenCalledTimes(1);
  });

  it('all buttons have accessible aria-labels', () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('aria-label');
    });
  });

  it('buttons are keyboard accessible', async () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    const clapBtn = screen.getByRole('button', { name: /כל הכבוד/i });
    clapBtn.focus();
    expect(clapBtn).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(props.onClap).toHaveBeenCalledTimes(1);
  });
});
