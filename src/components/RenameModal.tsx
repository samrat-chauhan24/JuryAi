import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

// ✅ THEME
import { colors, spacing, radius, typography } from '../theme';

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
            margin: spacing.lg,
            padding: spacing.lg,
            backgroundColor: colors.surface,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={[
              typography.subtitle,
              { marginBottom: spacing.md },
            ]}
          >
            Rename Chat
          </Text>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Enter new name"
            placeholderTextColor={colors.subtext}
            returnKeyType="done"
            onSubmitEditing={() => {
              if (!text.trim()) return;
              onSave(text);
              onClose();
            }}
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radius.md,
              padding: spacing.md,
              marginBottom: spacing.lg,
              color: colors.text,
              backgroundColor: colors.bg,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Text
                style={{
                  marginRight: spacing.lg,
                  color: colors.subtext,
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!text.trim()) return;
                onSave(text);
                onClose();
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: 'bold',
                }}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};