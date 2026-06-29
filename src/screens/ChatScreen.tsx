import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
  Keyboard,
  StyleSheet,
} from "react-native";

import {
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

import type { Message } from "../types/message";

import { sendMessageToAI } from "../services/chatService";
import ChatSyncService from "../services/chatSyncService";

import {
  saveMessage,
  getMessages,
} from "../database/chatQueries";

import { useLegalStore } from "../store/useLegalStore";

import { MessageRenderer } from "../components/MessageRender";
import { CountryDropdown } from "../components/CountryDropdown";
import { ScopeDropdown } from "../components/ScopeDropdown";

import {
  colors,
  spacing,
} from "../theme";

export const ChatScreen = () => {
  // All hooks must stay at the top and always run in this exact order.
  const route = useRoute<any>();

  const chatId = route.params?.chatId;
  const initialMessage = route.params?.initialMessage;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [hasSentInitial, setHasSentInitial] =
    useState(false);

  const [keyboardHeight, setKeyboardHeight] =
    useState(0);

  const flatListRef = useRef<FlatList<any>>(null);

  const jurisdiction = useLegalStore(
    (state) => state.jurisdiction
  );

  const countries = useLegalStore(
    (state) => state.countries
  );

  const mode = useLegalStore(
    (state) => state.mode
  );

  const isValid = useLegalStore(
    (state) => state.isValid
  );

  const isDisabled =
    !input.trim() ||
    !isValid() ||
    sending;

  const loadMessages = useCallback(async () => {
    if (!chatId) {
      return;
    }

    await ChatSyncService.syncMessages(chatId);

    const storedMessages =
      getMessages(chatId) || [];

    setMessages([...storedMessages]);
  }, [chatId]);

  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [loadMessages])
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToEnd({
        animated: true,
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages, sending]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setKeyboardHeight(
          event.endCoordinates.height
        );
      }
    );

    const hideSubscription = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleSend = async (
    textOverride?: string
  ) => {
    const text = textOverride ?? input;

    if (
      !text?.trim() ||
      sending ||
      !chatId ||
      !isValid()
    ) {
      return;
    }

    const cleanText = text.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: cleanText,
      sender: "user",
      chatId,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setInput("");
    setSending(true);

    try {
      await saveMessage(userMessage);
    } catch {}

    try {
      const data = await sendMessageToAI({
        query: cleanText,
        jurisdiction,
        countries,
        mode,
      });

      const botMessage = {
        id: `${Date.now()}_bot`,
        sender: "bot",
        chatId,
        data,
        mode,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        botMessage,
      ]);

      try {
        await saveMessage({
          id: botMessage.id,
          text: JSON.stringify({
            data,
            mode,
          }),
          sender: "bot",
          chatId,
        });
      } catch {}
    } catch {
      const errorMessage: Message = {
        id: `${Date.now()}_error`,
        text: "⚠️ Failed to connect. Try again.",
        sender: "bot",
        chatId,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (
      !initialMessage ||
      hasSentInitial
    ) {
      return;
    }

    handleSend(initialMessage);
    setHasSentInitial(true);
  }, [
    initialMessage,
    hasSentInitial,
  ]);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const isLastMessage =
            index === messages.length - 1;

          const showLoader =
            sending &&
            isLastMessage &&
            item.sender === "user";

          return (
            <View
              style={
                index === 0
                  ? styles.firstMessage
                  : undefined
              }
            >
              <MessageRenderer item={item} />

              {showLoader && (
                <View style={styles.loaderRow}>
                  <View style={styles.loaderBubble}>
                    <Text style={styles.loaderDots}>
                      •••
                    </Text>

                    <Text style={styles.loaderText}>
                      JuryAI is analyzing...
                    </Text>
                  </View>
                </View>
              )}
            </View>
          );
        }}
        contentContainerStyle={{
          paddingHorizontal: spacing.md,
          paddingTop: spacing.lg,
          paddingBottom: keyboardHeight + 180,
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />

      <View
        style={[
          styles.composerWrapper,
          {
            bottom:
              Platform.OS === "android"
                ? keyboardHeight + 12
                : keyboardHeight + spacing.lg,
          },
        ]}
      >
        <View style={styles.dropdownRow}>
          <ScopeDropdown />
          <CountryDropdown />
        </View>

        <View style={styles.inputBar}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask legal question..."
            placeholderTextColor={colors.subtext}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={() => {
              if (!isDisabled) {
                handleSend(input);
              }
            }}
          />

          <TouchableOpacity
            onPress={() => handleSend(input)}
            disabled={isDisabled}
            activeOpacity={0.75}
            style={[
              styles.sendButton,
              isDisabled &&
                styles.sendButtonDisabled,
            ]}
          >
            <Text style={styles.sendIcon}>
              ➜
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  messageList: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: 220,
    flexGrow: 1,
  },

  firstMessage: {
    marginTop: spacing.md,
  },

  loaderRow: {
    alignItems: "flex-start",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },

  loaderBubble: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  loaderDots: {
    color: colors.primary,
    fontWeight: "700",
    letterSpacing: 2,
    marginRight: 7,
  },

  loaderText: {
    color: colors.text,
    fontSize: 14,
  },

  composerWrapper: {
    position: "absolute",
    alignSelf: "center",
    width: "90%",
  },

  dropdownRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },

  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginLeft: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  sendButtonDisabled: {
    backgroundColor: colors.surfaceLight,
  },

  sendIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});