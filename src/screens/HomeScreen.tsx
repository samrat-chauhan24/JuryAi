import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";


import { SafeAreaView } from "react-native-safe-area-context";

import { createChat } from "../database/chatQueries";
import { LegalControls } from "../components/LegalControls";
import { CountryDropdown } from "../components/CountryDropdown";
import { ScopeDropdown } from "../components/ScopeDropdown";

import {
  colors,
  spacing,
  typography,
} from "../theme";

import { useLegalStore } from "../store/useLegalStore";

export const HomeScreen = ({ navigation }: any) => {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

const mode = useLegalStore(state => state.mode);

  const jurisdiction = useLegalStore(
    (s) => s.jurisdiction
  );

  const countries = useLegalStore(
    (s) => s.countries
  );
  
  const isDisabled =
    sending ||
    !input.trim() ||
    (jurisdiction === "specific country" &&
      countries.length !== 1) ||
    (jurisdiction === "comparison" &&
      countries.length !== 2);

  const handleSend = useCallback(async () => {
    if (isDisabled) return;

    setSending(true);

    const chatId = Date.now().toString();

    await createChat(
      chatId,
      mode,
      jurisdiction,
      countries
    );

    navigation.replace("Chat", {
      chatId,
      initialMessage: input.trim(),
    });

    setInput("");
    setSending(false);
  }, [input, isDisabled, navigation]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      "keyboardDidShow",
      event => {
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.bg,
          }}
        >
          {/* HEADER */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.sm,
              paddingBottom: spacing.sm,
              paddingRight: 0,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Chats")}
              activeOpacity={0.75}
            >
              <Text
                style={{
                  fontSize: 22,
                  color: colors.text,
                }}
              >
                ☰
              </Text>
            </TouchableOpacity>

            <LegalControls />
          </View>

          {/* CENTER TEXT */}
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: spacing.xl,
              paddingBottom: keyboardHeight,
            }}
          >
            <Text
              style={[
                typography.title,
                {
                  textAlign: "center",
                  lineHeight: 30,
                },
              ]}
            >
              “Ask about laws, rights, or regulations”
            </Text>
          </View>

          {/* FLOATING INPUT AREA */}
          <View
            style={{
              position: "absolute",
              alignSelf: "center",
              width: "90%",
              bottom:
                Platform.OS === "android"
                  ? keyboardHeight + 12
                  : keyboardHeight + spacing.lg,
            }}
          >
            {/* DROPDOWNS */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: spacing.sm,
                marginBottom: spacing.xs,
              }}
            >
              <ScopeDropdown />
              <CountryDropdown />
            </View>

            {/* INPUT BAR */}
            <View
              style={{
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
              }}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Ask JuryAI..."
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
                  if (!isDisabled) {
                    handleSend();
                  }
                }}
              />

              <TouchableOpacity
                onPress={handleSend}
                disabled={isDisabled}
                activeOpacity={0.75}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  marginLeft: spacing.sm,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isDisabled
                    ? colors.surfaceLight
                    : colors.primary,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  ➜
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};