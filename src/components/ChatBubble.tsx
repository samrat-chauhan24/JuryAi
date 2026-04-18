import React from 'react';
import { View, Text } from 'react-native';
import { parseMessage } from '../utils/parser';

// ✅ THEME
import { colors, spacing, radius, typography } from '../theme';

type Props = {
  text: string;
  isUser: boolean;
};

export const ChatBubble = ({ text, isUser }: Props) => {
  const parsed = parseMessage(text);

  return (
    <View
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        backgroundColor: isUser ? colors.primary : colors.surfaceLight,
        padding: spacing.md,
        borderRadius: radius.lg,
        marginVertical: spacing.xs,
        maxWidth: '80%',
      }}
    >
      {parsed.map(line => (
        <Text
          key={line.key}
          style={[
            typography.body,
            {
              color: isUser ? '#fff' : colors.text,
              marginBottom: spacing.xs,
            },
          ]}
        >
          {line.isList ? '\n' : ''}

          {line.segments.map(seg => (
            <Text
              key={seg.key}
              style={{
                fontWeight: seg.isBold ? 'bold' : 'normal',
                color: isUser ? '#fff' : colors.text,
              }}
            >
              {seg.text}
            </Text>
          ))}
        </Text>
      ))}
    </View>
  );
};