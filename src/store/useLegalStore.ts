import { create } from 'zustand';

export type Jurisdiction = 'global' | 'specific country' | 'comparison';
export type Mode = 'basic' | 'advanced';

type LegalState = {
  jurisdiction: Jurisdiction;
  countries: string[];
  mode: Mode;

  setJurisdiction: (j: Jurisdiction) => void;
  setCountries: (c: string[]) => void;
  setMode: (m: Mode) => void;

  isValid: () => boolean;
};

export const useLegalStore = create<LegalState>((set, get) => ({
  jurisdiction: 'global',
  countries: [],
  mode: 'basic',

  setJurisdiction: (j) =>
    set({
      jurisdiction: j,
      countries: [],
    }),

  setCountries: (c) => set({ countries: c }),

  setMode: (m) => set({ mode: m }),

  isValid: () => {
    const { jurisdiction, countries } = get();

    if (jurisdiction === 'global') return true;

    if (jurisdiction === 'specific country') {
      return countries.length === 1;
    }

    if (jurisdiction === 'comparison') {
      return countries.length === 2;
    }

    return false;
  },
}));