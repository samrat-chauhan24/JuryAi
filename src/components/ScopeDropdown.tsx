import React from 'react';
import { View } from 'react-native';
import { useLegalStore, Jurisdiction } from '../store/useLegalStore';
import { Dropdown } from './Dropdown';

// ✅ THEME
import { spacing } from '../theme';

export const ScopeDropdown = () => {
  const { jurisdiction, setJurisdiction, setCountries } = useLegalStore();

  const handleSelect = (value: Jurisdiction) => {
    setJurisdiction(value);
    setCountries([]); // reset always
  };

  return (
    <View
      style={{
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
      }}
    >
      <Dropdown
        options={['global', 'specific country', 'comparison']}
        selected={jurisdiction}
        onSelect={handleSelect}
      />
    </View>
  );
};