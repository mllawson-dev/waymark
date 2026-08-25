import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Drawer } from './Drawer';

function renderDrawer(props: Partial<React.ComponentProps<typeof Drawer>> = {}) {
  const onClose = props.onClose ?? vi.fn();
  const utils = render(
    <Drawer isOpen={props.isOpen ?? true} onClose={onClose} title={props.title ?? 'Cart'}>
      {props.children ?? (
        <>
          <button>First</button>
          <button>Last</button>
        </>
      )}
    </Drawer>
  );
  return { ...utils, onClose };
}

describe('Drawer', () => {
  it('renders nothing when closed', () => {
    renderDrawer({ isOpen: false });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders a labelled modal dialog when open', () => {
    renderDrawer({ title: 'Your cart' });

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(screen.getByRole('heading', { name: 'Your cart' }).id).toBe(dialog.getAttribute('aria-labelledby'));
  });

  it('moves focus to the close button and locks page scrolling while open', () => {
    renderDrawer();

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' }));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores page scrolling once unmounted', () => {
    const { unmount } = renderDrawer();

    unmount();

    expect(document.body.style.overflow).toBe('');
  });

  it('closes on the close button, the overlay, and Escape', () => {
    const onClose = vi.fn();
    renderDrawer({ onClose });

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('does not close when the dialog itself is clicked', () => {
    const onClose = vi.fn();
    renderDrawer({ onClose });

    fireEvent.click(screen.getByRole('dialog'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('ignores other keys', () => {
    const onClose = vi.fn();
    renderDrawer({ onClose });

    fireEvent.keyDown(window, { key: 'a' });

    expect(onClose).not.toHaveBeenCalled();
  });

  it('wraps focus from the last focusable element back to the first on Tab', () => {
    renderDrawer();
    const last = screen.getByRole('button', { name: 'Last' });
    last.focus();

    fireEvent.keyDown(window, { key: 'Tab' });

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close' }));
  });

  it('wraps focus from the first focusable element to the last on Shift+Tab', () => {
    renderDrawer();
    screen.getByRole('button', { name: 'Close' }).focus();

    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Last' }));
  });

  it('leaves Tab alone in the middle of the focus order', () => {
    renderDrawer();
    const first = screen.getByRole('button', { name: 'First' });
    first.focus();

    fireEvent.keyDown(window, { key: 'Tab' });

    expect(document.activeElement).toBe(first);
  });

  it('returns focus to the trigger when it closes', () => {
    const trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();

    const { rerender } = render(
      <Drawer isOpen onClose={vi.fn()} title="Cart">
        <button>Only</button>
      </Drawer>
    );
    rerender(
      <Drawer isOpen={false} onClose={vi.fn()} title="Cart">
        <button>Only</button>
      </Drawer>
    );

    expect(document.activeElement).toBe(trigger);
  });
});
