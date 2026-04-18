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
  Text,
} from 'react-native';

import { Message } from '../types/message';
import { ChatBubble } from '../components/ChatBubble';
import { MessageInput } from '../components/MessageInput';

import { sendMessageToAI } from '../services/chatService';
import { saveMessage, getMessages } from '../database/chatQueries';

import { useRoute, useFocusEffect } from '@react-navigation/native';


import { useLegalStore } from '../store/useLegalStore';


import { StructuredResponse } from '../components/StructuredResponse';
import { ComparisonTable } from '../components/ComparisonTable';

import { MessageRenderer } from '../components/MessageRender';

import { LegalControls } from '../components/LegalControls';
import { CountryDropdown } from '../components/CountryDropdown';
import { ScopeDropdown } from '../components/ScopeDropdown';

export const ChatScreen = () => {
  const route = useRoute<any>();

  const chatId = route.params?.chatId;
  const initialMessage = route.params?.initialMessage;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [hasSentInitial, setHasSentInitial] = useState(false);

  

  const flatListRef = useRef<FlatList>(null);

  // 🔥 Zustand
  const {
    jurisdiction,
    countries,
    mode,
    isValid,
  } = useLegalStore();

  // 🔥 Load messages
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

  // 🔥 Auto scroll
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // 🔥 Send
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
        data, // 🔥 structured
      };

      setMessages(prev => [...prev, botMessage]);

      try {
        saveMessage?.({
          id: botMessage.id,
          text: JSON.stringify(data), // fallback save
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

  // 🔥 initial message
  useEffect(() => {
    if (!initialMessage || hasSentInitial) return;

    handleSend(initialMessage);
    setHasSentInitial(true);
  }, [initialMessage, hasSentInitial]);


  return (
  <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: '#fff' }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  >

    {/* CHAT */}
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MessageRenderer item={item} />}
      contentContainerStyle={{ padding: 10, flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    />

    {sending && (
      <ActivityIndicator style={{ marginBottom: 6 }} />
    )}

    {/* Scope + Country (NO wrapper block) */}
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 10,
        marginBottom: 6,
      }}
    >
      <ScopeDropdown />
      <CountryDropdown />
    </View>

    {/* INPUT (directly below like HomeScreen) */}
    <MessageInput
      input={input}
      setInput={setInput}
      onSend={handleSend}
      disabled={!isValid() || sending}
    />
  </KeyboardAvoidingView>
);
};