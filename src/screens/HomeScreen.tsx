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

import { Platform } from 'react-native'
import { KeyboardAvoidingView } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = ({ navigation }: any) => {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = useCallback(() => {
    if (!input.trim() || sending) return;

    setSending(true);

    const chatId = Date.now().toString();

    createChat(chatId);

    // 🔥 Replace Home → Chat (removes Home)
    navigation.replace('Chat', {
      chatId,
      initialMessage: input,
    });

    setInput('');
    setSending(false);
  }, [input, sending, navigation]);

  return (
     <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
  <View style={{ flex: 1, backgroundColor: '#fff' }}>

    {/* HEADER */}
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 6,
        paddingRight: 0,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
        <Text style={{ fontSize: 22 }}>☰</Text>
      </TouchableOpacity>

      <LegalControls />
    </View>

    {/* CENTER TEXT */}
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          textAlign: 'center',
          fontWeight: '500',
          lineHeight: 30,
        }}
      >
        “Ask about laws, rights, or regulations”
      </Text>
    </View>

    {/* FOOTER */}
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      {/* Scope + Country */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center', // 👈 center both
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
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
          paddingHorizontal: 12,
          paddingBottom: 12,
        }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask JuryAI..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />

        <TouchableOpacity
          onPress={handleSend}
          style={{ marginLeft: 10 }}
        >
          <Text style={{ color: '#007AFF', fontWeight: '600' }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>

  </View></SafeAreaView>
);
};