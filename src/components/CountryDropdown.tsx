import React from 'react';
import { View } from 'react-native';
import { useLegalStore } from '../store/useLegalStore';
import { Dropdown } from './Dropdown';

const COUNTRIES = ['India', 'USA', 'UK', 'Canada'];

export const CountryDropdown = () => {
  const { jurisdiction, countries, setCountries } = useLegalStore();

  // 🔥 HIDE for universal
  if (jurisdiction === 'global') return null;

  const handleSelect = (c: string) => {
    // SINGLE → only one
    if (jurisdiction === 'specific country') {
      setCountries([c]);
      return;
    }

    // COMPARISON → max 2
    if (jurisdiction === 'comparison') {
      if (countries.includes(c)) {
        setCountries(countries.filter(x => x !== c));
        return;
      }

      if (countries.length >= 2) {
        // replace last
        setCountries([countries[1], c]);
        return;
      }

      setCountries([...countries, c]);
    }
  };

  return (
    <View style={{ paddingHorizontal: 10, marginBottom: 6 }}>
      <Dropdown
        options={COUNTRIES}
        selected={countries.join(', ') || 'country'}
        onSelect={handleSelect}
      />
    </View>
  );
};