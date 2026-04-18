import React from 'react';
import { View } from 'react-native';
import { useLegalStore } from '../store/useLegalStore';
import { Dropdown } from './Dropdown';

// ✅ THEME
import { spacing } from '../theme';

const COUNTRIES = ['India', 'USA', 'UK', 'Canada'];

export const CountryDropdown = () => {
  const { jurisdiction, countries, setCountries } = useLegalStore();

  if (jurisdiction === 'global') return null;

  const handleSelect = (c: string) => {
    if (jurisdiction === 'specific country') {
      setCountries([c]);
      return;
    }

    if (jurisdiction === 'comparison') {
      if (countries.includes(c)) {
        setCountries(countries.filter(x => x !== c));
        return;
      }

      if (countries.length >= 2) {
        setCountries([countries[1], c]);
        return;
      }

      setCountries([...countries, c]);
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
      }}
    >
      <Dropdown
        options={COUNTRIES}
        selected={countries.join(', ') || 'country'}
        onSelect={handleSelect}
      />
    </View>
  );
};