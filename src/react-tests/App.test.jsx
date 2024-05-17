import { render, getByRole } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('app component', () => {
  it('renders app', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  it('responds to user click', async () => {
    const user = userEvent.setup();

    const { container } = render(<App />);
    const button = getByRole(container, 'button', { name: /click me/i });

    await user.click(button);

    expect(getByRole(container, 'heading').textContent).toMatch(
      /radical rhinos/i,
    );
  });
});
