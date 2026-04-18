import React from 'react';
import { View } from 'react-native';
import { useLegalStore, Jurisdiction } from '../store/useLegalStore';
import { Dropdown } from './Dropdown';

export const ScopeDropdown = () => {
  const { jurisdiction, setJurisdiction, setCountries } = useLegalStore();

  const handleSelect = (value: Jurisdiction) => {
    setJurisdiction(value);
    setCountries([]); // reset always
  };

  return (
    <View style={{ paddingHorizontal: 10, marginBottom: 6 }}>
      <Dropdown
        options={['global', 'specific country', 'comparison']}
        selected={jurisdiction}
        onSelect={handleSelect}
      />
    </View>
  );
};