import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLegalStore } from '../store/useLegalStore';

export const JurisdictionSelector = () => {
  const { jurisdiction, setJurisdiction } = useLegalStore();

  const options = ['universal', 'single', 'comparison'];

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {options.map((opt) => (
        <TouchableOpacity key={opt} onPress={() => setJurisdiction(opt as any)}>
          <Text style={{ color: jurisdiction === opt ? 'blue' : 'black' }}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};