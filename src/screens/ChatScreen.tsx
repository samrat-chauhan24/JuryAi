import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';

import { Message } from '../types/message';

import { sendMessageToAI } from '../services/chatService';
import { saveMessage, getMessages } from '../database/chatQueries';

import { useRoute, useFocusEffect } from '@react-navigation/native';

import { useLegalStore } from '../store/useLegalStore';

import { MessageRenderer } from '../components/MessageRender';
import { CountryDropdown } from '../components/CountryDropdown';
import { ScopeDropdown } from '../components/ScopeDropdown';

// ✅ THEME
import { colors, spacing } from '../theme';

import LinearGradient from 'react-native-linear-gradient';

import { Keyboard } from 'react-native';

export const ChatScreen = () => {
  const route = useRoute<any>();

  const chatId = route.params?.chatId;
  const initialMessage = route.params?.initialMessage;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [hasSentInitial, setHasSentInitial] = useState(false);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const flatListRef = useRef<FlatList>(null);

  const jurisdiction = useLegalStore((s) => s.jurisdiction);
  const countries = useLegalStore((s) => s.countries);
  const mode = useLegalStore((s) => s.mode);
  const isValid = useLegalStore((s) => s.isValid);

  const isDisabled =
  !input.trim() ||
  !isValid() ||
  sending;

  const loadMessages = useCallback(() => {
    if (!chatId) return;
    const data = getMessages(chatId) || [];
    setMessages([...data]);
  }, [chatId]);

  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [loadMessages])
  );

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
  const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
    setKeyboardHeight(e.endCoordinates.height);
  });

  const hideSub = Keyboard.addListener('keyboardDidHide', () => {
    setKeyboardHeight(0);
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);

  const handleSend = async (textOverride?: string) => {
    const text = textOverride ?? input;

    if (!text?.trim() || sending || !chatId || !isValid()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      chatId,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      saveMessage?.(userMessage);
    } catch {}

    try {
      const data = await sendMessageToAI({
        query: text,
        jurisdiction,
        countries,
        mode,
      });

      const botMessage = {
        id: Date.now().toString() + '_bot',
        sender: 'bot',
        chatId,
        data,
        mode
      };

      setMessages(prev => [...prev, botMessage]);

      try {
        saveMessage?.({
          id: botMessage.id,
          text: JSON.stringify({
            data,
            mode, // 👈 THIS is the fix
          }),
          sender: 'bot',
          chatId,
        });
      } catch {}
    } catch {
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        text: '⚠️ Failed to connect. Try again.',
        sender: 'bot',
        chatId,
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!initialMessage || hasSentInitial) return;

    handleSend(initialMessage);
    setHasSentInitial(true);
  }, [initialMessage, hasSentInitial]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* CHAT */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageRenderer item={item} />}
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: 140, // 👈 prevent overlap
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      />

      {sending && (
        <ActivityIndicator
          style={{ marginBottom: spacing.sm }}
          color={colors.primary}
        />
      )}

      {/* FADE OVERLAY
      <LinearGradient
        colors={['transparent', colors.bg]}
        style={{
          position: 'absolute',
          bottom: spacing.lg + 60, // 👈 KEY: just above floating area
          left: 0,
          right: 0,
          height: 60,
          zIndex: 5,
        }}
        pointerEvents="none"
      /> */}

      {/* FLOATING AREA */}
      <View
        style={{
          position: 'absolute',
          bottom: keyboardHeight > 0 ? keyboardHeight -275  : spacing.lg,

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

        {/* Input */}
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
            placeholder="Ask legal question..."
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
              if (!isDisabled) handleSend(input);
            }}
          />

          <TouchableOpacity
            onPress={() => handleSend(input)}
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

    </KeyboardAvoidingView>
  );
};