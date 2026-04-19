import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { createChat } from '../database/chatQueries';
import { LegalControls } from '../components/LegalControls';
import { CountryDropdown } from '../components/CountryDropdown';
import { ScopeDropdown } from '../components/ScopeDropdown';

import { Platform } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ THEME
import { colors, spacing, typography } from '../theme';

// ✅ FIX: selector-based Zustand usage
import { useLegalStore } from '../store/useLegalStore';

export const HomeScreen = ({ navigation }: any) => {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  // ✅ SAFE STORE ACCESS (same pattern as ChatScreen)
  const jurisdiction = useLegalStore((s) => s.jurisdiction);
  const countries = useLegalStore((s) => s.countries);

  // ✅ SAME VALIDATION LOGIC AS CHATSCREEN
  const isDisabled =
    sending ||
    !input.trim() ||
    (jurisdiction === 'specific country' && countries.length !== 1) ||
    (jurisdiction === 'comparison' && countries.length !== 2);

  const handleSend = useCallback(() => {
    if (isDisabled) return;

    setSending(true);

    const chatId = Date.now().toString();

    createChat(chatId);

    navigation.replace('Chat', {
      chatId,
      initialMessage: input,
    });

    setInput('');
    setSending(false);
  }, [isDisabled, input, navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          
          {/* HEADER */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.sm,
              paddingBottom: spacing.sm,
              paddingRight: 0,
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
              <Text style={{ fontSize: 22, color: colors.text }}>☰</Text>
            </TouchableOpacity>

            <LegalControls />
          </View>

          {/* CENTER TEXT */}
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: spacing.xl,
            }}
          >
            <Text
              style={[
                typography.title,
                {
                  textAlign: 'center',
                  lineHeight: 30,
                },
              ]}
            >
              “Ask about laws, rights, or regulations”
            </Text>
          </View>

          {/* FLOATING AREA */}
          <View
            style={{
              position: 'absolute',
              bottom: spacing.lg,
              alignSelf: 'center',
              width: '90%',
            }}
          >
            {/* Dropdowns */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: spacing.sm,
                marginBottom: spacing.xs,
              }}
            >
              <ScopeDropdown />
              <CountryDropdown />
            </View>

            {/* INPUT */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: spacing.sm,
                paddingVertical: 4,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask LawGPT..."
                placeholderTextColor={colors.subtext}
                style={{
                  flex: 1,
                  color: colors.text,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 6,
                  fontSize: 15,
                }}
                returnKeyType="send"
                onSubmitEditing={() => {
                  if (!isDisabled) handleSend();
                }}
              />

              <TouchableOpacity
                onPress={handleSend}
                disabled={isDisabled}
                style={{
                  marginLeft: spacing.xs,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 4,
                  opacity: isDisabled ? 0.4 : 1,
                }}
              >
                <Text
                  style={{
                    color: isDisabled ? colors.subtext : colors.primary,
                    fontWeight: '600',
                    fontSize: 14,
                  }}
                >
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};