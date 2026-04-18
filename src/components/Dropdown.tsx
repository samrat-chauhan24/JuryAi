import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';

// ✅ THEME
import { colors, spacing, radius, typography } from '../theme';

export const Dropdown = ({
  label,
  options,
  selected,
  onSelect,
  openDown = false,
}: any) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginRight: spacing.sm }}>
      
      {/* Button */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.pill,
          backgroundColor: colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={[
            typography.body,
            { color: colors.text },
          ]}
        >
          {label && label.trim() !== '' ? `${label}: ` : ''}
          {selected || 'Select'} {openDown ? '▼' : '▲'}
        </Text>
      </TouchableOpacity>

      {/* Overlay */}
      {open && (
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            position: 'absolute',
            top: -1000,
            bottom: -1000,
            left: -1000,
            right: -1000,
            zIndex: 999,
          }}
        />
      )}

      {/* Dropdown Menu */}
      {open && (
        <View
          style={{
            position: 'absolute',

            ...(openDown
              ? { right: 0 }
              : { left: 0 }),

            minWidth: 120,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.md,
            backgroundColor: colors.surface,
            zIndex: 1000,
            elevation: 6,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 5,

            ...(openDown
              ? { top: 45 }
              : { bottom: 45 }),
          }}
        >
          {options.map((opt: string) => (
            <TouchableOpacity
              key={opt}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
              style={{
                padding: spacing.md,
                borderBottomWidth: 0.5,
                borderColor: colors.divider,
              }}
            >
              <Text style={{ color: colors.text }}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};