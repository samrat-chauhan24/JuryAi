import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLegalStore } from '../store/useLegalStore';

const ALL_COUNTRIES = ['India', 'USA', 'UK', 'Canada'];

export const CountrySelector = () => {
  const { jurisdiction, countries, setCountries } = useLegalStore();

  if (jurisdiction === 'universal') return null;

  const toggleCountry = (country: string) => {
    if (jurisdiction === 'single') {
      setCountries([country]);
    } else {
      if (countries.includes(country)) {
        setCountries(countries.filter((c) => c !== country));
      } else {
        setCountries([...countries, country]);
      }
    }
  };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {ALL_COUNTRIES.map((c) => (
        <TouchableOpacity key={c} onPress={() => toggleCountry(c)}>
          <Text style={{ color: countries.includes(c) ? 'blue' : 'black' }}>
            {c}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};