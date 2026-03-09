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

    expect(screen.getByRole('button', { name: /clap/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /good/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /love/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /funny/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /party/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /wow/i })).toBeInTheDocument();
  });

  it('calls onClap when Clap button is clicked', async () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    await userEvent.click(screen.getByRole('button', { name: /clap/i }));
    expect(props.onClap).toHaveBeenCalledTimes(1);
  });

  it('calls onThumbsUp when Good button is clicked', async () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    await userEvent.click(screen.getByRole('button', { name: /good/i }));
    expect(props.onThumbsUp).toHaveBeenCalledTimes(1);
  });

  it('calls onHeart when Love button is clicked', async () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    await userEvent.click(screen.getByRole('button', { name: /love/i }));
    expect(props.onHeart).toHaveBeenCalledTimes(1);
  });

  it('calls onParty when Party button is clicked', async () => {
    const props = makeProps();
    render(<EmojiPanel {...props} />);

    await userEvent.click(screen.getByRole('button', { name: /party/i }));
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

    const clapBtn = screen.getByRole('button', { name: /clap/i });
    clapBtn.focus();
    expect(clapBtn).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    expect(props.onClap).toHaveBeenCalledTimes(1);
  });
});
