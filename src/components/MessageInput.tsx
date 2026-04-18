import React from 'react';

import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';

// ✅ THEME
import { colors, spacing, radius, typography } from '../theme';

type Props = {
  input: string;
  setInput: (text: string) => void;
  onSend: (text?: string) => void;
  disabled?: boolean;
};

export const MessageInput = ({
  input,
  setInput,
  onSend,
  disabled = false,
}: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: spacing.md,
        borderTopWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.bg,
      }}
    >
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Ask legal question..."
        placeholderTextColor={colors.subtext}
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          color: colors.text,
          backgroundColor: colors.surface,
        }}
        returnKeyType="send"
        onSubmitEditing={() => {
          if (!disabled) onSend(input);
        }}
        blurOnSubmit={false}
      />

      <TouchableOpacity
        onPress={() => onSend(input)}
        disabled={disabled}
        style={{
          marginLeft: spacing.sm,
          justifyContent: 'center',
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <Text
          style={[
            typography.subtitle,
            { color: colors.primary },
          ]}
        >
          Send
        </Text>
      </TouchableOpacity>
    </View>
  );
};