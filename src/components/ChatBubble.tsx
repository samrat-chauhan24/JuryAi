import React from 'react';
import { View, Text } from 'react-native';
import { parseMessage } from '../utils/parser';

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
        backgroundColor: isUser ? '#007AFF' : '#E5E5EA',
        padding: 12,
        borderRadius: 12,
        marginVertical: 4,
        maxWidth: '80%',
      }}
    >
      {parsed.map(line => (
        <Text
          key={line.key}
          style={{
            color: isUser ? '#fff' : '#000',
            marginBottom: 4,
          }}
        >
          {line.isList ? '\n' : ''}

          {line.segments.map(seg => (
            <Text
              key={seg.key}
              style={{
                fontWeight: seg.isBold ? 'bold' : 'normal',
                color: isUser ? '#fff' : '#000',
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