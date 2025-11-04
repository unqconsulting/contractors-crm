import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../components/modal';

// Clean up between tests (recommended best practice)
afterEach(() => {
  jest.clearAllMocks();
});

describe('Modal', () => {
  it('renders when isOpen is true', () => {
    render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        onDelete={jest.fn()}
        title="My Modal"
      >
        <p>Content</p>
      </Modal>
    );

    expect(screen.getByTestId('modal')).toBeTruthy();
    expect(screen.getByText('My Modal')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal
        isOpen={false}
        onClose={jest.fn()}
        onDelete={jest.fn()}
        title="Hidden"
      >
        <p>Hidden content</p>
      </Modal>
    );

    expect(screen.queryByTestId('modal')).toBeNull();
  });

  it('calls onClose when clicking the overlay', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(
      <Modal
        isOpen={true}
        onClose={onClose}
        onDelete={jest.fn()}
        title="Overlay Test"
      >
        <p>Click overlay</p>
      </Modal>
    );

    // The overlay is the first child of the modal container
    const overlay = screen.getByTestId('modal').firstChild as HTMLElement;
    await user.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when clicking inside modal content', () => {
    const onClose = jest.fn();
    render(
      <Modal
        isOpen={true}
        onClose={onClose}
        onDelete={jest.fn()}
        title="Click Inside"
      >
        <p>Inner content</p>
      </Modal>
    );

    // Click inside modal (the title or content)
    fireEvent.click(screen.getByText('Click Inside'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when pressing Escape key', () => {
    const onClose = jest.fn();
    render(
      <Modal
        isOpen={true}
        onClose={onClose}
        onDelete={jest.fn()}
        title="Escape Test"
      >
        <p>Inner content</p>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows/hides primary and secondary buttons correctly', () => {
    const { rerender } = render(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        onDelete={jest.fn()}
        title="Buttons Test"
        showPrimaryButton={true}
        showSecondaryButton={false}
      >
        <p>Inner content</p>
      </Modal>
    );

    expect(screen.queryByText('Cancel')).toBeNull();
    expect(screen.getByText('Confirm')).toBeTruthy();

    // Rerender with both buttons
    rerender(
      <Modal
        isOpen={true}
        onClose={jest.fn()}
        onDelete={jest.fn()}
        title="Buttons Test"
        showPrimaryButton={true}
        showSecondaryButton={true}
      >
        <p>Inner content</p>
      </Modal>
    );

    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Confirm')).toBeTruthy();
  });
});
