import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';

type Props = {
  input: string;
  setInput: (text: string) => void;
  onSend: (text?: string) => void; // 👈 important
  disabled?: boolean; // 👈 THIS was missing
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
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
      }}
    >
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Ask legal question..."
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 20,
          paddingHorizontal: 15,
          paddingVertical: 8,
        }}
        returnKeyType="send"
        onSubmitEditing={() => {
          if (!disabled) onSend(input); // 👈 FIX
        }}
        blurOnSubmit={false}
      />

      <TouchableOpacity
        onPress={() => onSend(input)} // 👈 FIX
        disabled={disabled}
        style={{
          marginLeft: 10,
          justifyContent: 'center',
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <Text style={{ color: '#007AFF', fontSize: 16 }}>
          Send
        </Text>
      </TouchableOpacity>
    </View>
  );
};