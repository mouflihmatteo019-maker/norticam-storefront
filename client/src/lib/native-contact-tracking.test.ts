import { describe, expect, it, vi } from 'vitest';
import { attachNativeContactTracking } from './native-contact-tracking';

function fixture() {
  const listeners = new Map<string, EventListener>();
  const marker = {};
  const form = { closest: () => form, querySelector: vi.fn(() => marker) };
  const link = { closest: () => link, getAttribute: vi.fn(() => 'mailto:contact@norticam.com') };
  const container = {
    contains: vi.fn(node => node === form || node === link),
    addEventListener: vi.fn((name, fn) => listeners.set(name, fn)),
    removeEventListener: vi.fn((name, fn) => { if (listeners.get(name) === fn) listeners.delete(name); }),
  };
  const emit = vi.fn();
  const cleanup = attachNativeContactTracking(container as unknown as Element, emit);
  const submit = () => {
    const event = { target: form, preventDefault: vi.fn(), stopPropagation: vi.fn() };
    listeners.get('submit')?.(event as unknown as Event);
    return event;
  };
  const click = () => listeners.get('click')?.({ target: link } as unknown as Event);
  return { listeners, form, link, container, emit, cleanup, submit, click };
}

describe('native contact interaction observation', () => {
  it('observes a Shopify contact submission once without reading customer values or preventing the request', () => {
    const f = fixture(), event = f.submit();
    expect(f.emit).toHaveBeenCalledTimes(1); expect(f.emit).toHaveBeenCalledWith('contact_form_submit');
    expect(f.form.querySelector).toHaveBeenCalledWith('input[name="form_type"][value="contact"]');
    expect(event.preventDefault).not.toHaveBeenCalled(); expect(event.stopPropagation).not.toHaveBeenCalled();
  });
  it('observes only mailto clicks inside the contact zone, not the customer address', () => {
    const f = fixture(); f.click();
    expect(f.emit).toHaveBeenCalledTimes(1); expect(f.emit).toHaveBeenCalledWith('contact_email_opened');
    f.link.getAttribute.mockReturnValue('https://norticam.com/pages/suivi-colis'); f.click();
    expect(f.emit).toHaveBeenCalledTimes(1);
  });
  it('ignores other forms, outside elements and non-element targets', () => {
    const f = fixture(); f.form.querySelector.mockReturnValue(null as any); f.submit();
    f.container.contains.mockReturnValue(false); f.click();
    f.listeners.get('click')?.({ target: null } as unknown as Event);
    expect(f.emit).not.toHaveBeenCalled();
  });
  it('cleans up exact listeners and does not attach another React submission handler', () => {
    const f = fixture(); expect(f.container.addEventListener).toHaveBeenCalledTimes(2);
    f.cleanup(); expect(f.container.removeEventListener).toHaveBeenCalledTimes(2); expect(f.listeners.size).toBe(0);
    f.submit(); f.click(); expect(f.emit).not.toHaveBeenCalled();
  });
  it('does not interfere with a native interaction if analytics throws or the native zone is absent', () => {
    expect(() => attachNativeContactTracking(null, () => { throw new Error('No API'); })()).not.toThrow();
    const f = fixture(); f.emit.mockImplementation(() => { throw new Error('No API'); });
    expect(() => f.submit()).not.toThrow(); expect(() => f.click()).not.toThrow();
  });
});
