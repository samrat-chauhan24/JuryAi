import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLegalStore } from '../store/useLegalStore';

export const ModeSelector = () => {
  const { mode, setMode } = useLegalStore();

  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {['basic', 'advanced'].map((m) => (
        <TouchableOpacity key={m} onPress={() => setMode(m as any)}>
          <Text style={{ color: mode === m ? 'blue' : 'black' }}>
            {m}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};