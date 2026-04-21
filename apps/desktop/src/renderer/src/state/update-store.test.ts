import { describe, expect, it } from 'vitest';
import { createUpdateStore } from './update-store';

describe('update-store', () => {
  it('starts idle', () => {
    const store = createUpdateStore({ dismissedVersion: '' });
    expect(store.getState().status).toBe('idle');
  });

  it('transitions to available when update-available received', () => {
    const store = createUpdateStore({ dismissedVersion: '' });
    store.getState().setAvailable({ version: '0.2.0', releaseUrl: 'https://x/y' });
    expect(store.getState().status).toBe('available');
    expect(store.getState().version).toBe('0.2.0');
    expect(store.getState().shouldShowBanner()).toBe(true);
  });

  it('hides banner when the available version equals dismissedVersion', () => {
    const store = createUpdateStore({ dismissedVersion: '0.2.0' });
    store.getState().setAvailable({ version: '0.2.0', releaseUrl: 'https://x/y' });
    expect(store.getState().shouldShowBanner()).toBe(false);
  });

  it('shows banner again when a NEWER version arrives', () => {
    const store = createUpdateStore({ dismissedVersion: '0.2.0' });
    store.getState().setAvailable({ version: '0.2.1', releaseUrl: 'https://x/y' });
    expect(store.getState().shouldShowBanner()).toBe(true);
  });

  it('dismiss() updates dismissedVersion and hides banner', () => {
    const store = createUpdateStore({ dismissedVersion: '' });
    store.getState().setAvailable({ version: '0.2.0', releaseUrl: 'https://x/y' });
    store.getState().dismiss();
    expect(store.getState().dismissedVersion).toBe('0.2.0');
    expect(store.getState().shouldShowBanner()).toBe(false);
  });
});
