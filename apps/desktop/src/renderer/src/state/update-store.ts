import { create } from 'zustand';
import type { StoreApi } from 'zustand';

export type UpdateStatus = 'idle' | 'available' | 'latest' | 'error';

export interface UpdateState {
  status: UpdateStatus;
  version: string;
  releaseUrl: string;
  errorMessage: string;
  dismissedVersion: string;
  setAvailable(info: { version: string; releaseUrl: string }): void;
  setLatest(): void;
  setError(message: string): void;
  dismiss(): void;
  shouldShowBanner(): boolean;
}

export function createUpdateStore(init: { dismissedVersion: string }): StoreApi<UpdateState> {
  return create<UpdateState>((set, get) => ({
    status: 'idle',
    version: '',
    releaseUrl: '',
    errorMessage: '',
    dismissedVersion: init.dismissedVersion,
    setAvailable: ({ version, releaseUrl }) =>
      set({ status: 'available', version, releaseUrl, errorMessage: '' }),
    setLatest: () => set({ status: 'latest', errorMessage: '' }),
    setError: (message) => set({ status: 'error', errorMessage: message }),
    dismiss: () => {
      const v = get().version;
      if (!v) return;
      set({ dismissedVersion: v });
    },
    shouldShowBanner: () => {
      const { status, version, dismissedVersion } = get();
      return status === 'available' && version !== '' && version !== dismissedVersion;
    },
  }));
}
