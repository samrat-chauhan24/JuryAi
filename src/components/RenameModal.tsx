import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  currentTitle: string;
};

export const RenameModal = ({
  visible,
  onClose,
  onSave,
  currentTitle,
}: Props) => {
  const [text, setText] = useState(currentTitle);

  useEffect(() => {
    setText(currentTitle);
  }, [currentTitle]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      >
        <View
          style={{
            margin: 20,
            padding: 20,
            backgroundColor: '#fff',
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 18, marginBottom: 10 }}>
            Rename Chat
          </Text>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Enter new name"
            returnKeyType="done"
            onSubmitEditing={() => {
                if (!text.trim()) return;
                onSave(text);
                onClose();
            }}
            style={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                padding: 10,
                marginBottom: 15,
            }}
           />

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ marginRight: 15 }}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!text.trim()) return;
                onSave(text);
                onClose();
              }}
            >
              <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};