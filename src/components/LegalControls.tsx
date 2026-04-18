import React from 'react';
import { View } from 'react-native';
import { useLegalStore } from '../store/useLegalStore';
import { Dropdown } from './Dropdown';

// ✅ THEME
import { spacing } from '../theme';

export const LegalControls = () => {
  const { mode, setMode } = useLegalStore();

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 0,
        marginRight: spacing.sm,
      }}
    >
      <Dropdown
        options={['basic', 'advanced']}
        selected={mode}
        onSelect={setMode}
        openDown
      />
    </View>
  );
};