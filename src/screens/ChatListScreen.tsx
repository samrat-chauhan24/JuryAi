import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";

import {
  getChats,
  deleteChat,
  renameChat,
} from "../database/chatQueries";

import ChatSyncService from "../services/chatSyncService";
import { RenameModal } from "../components/RenameModal";

import {
  colors,
  spacing,
  radius,
  typography,
} from "../theme";

type Chat = {
  id: string;
  title: string;
  updatedAt?: number;
};

export const ChatListScreen = ({ navigation }: any) => {
  const [chats, setChats] = useState<Chat[]>([]);

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const [renameVisible, setRenameVisible] =
    useState(false);

  const [currentTitle, setCurrentTitle] =
    useState("");

  const loadChats = useCallback(async () => {
    try {
      await ChatSyncService.syncChats();

      const data = getChats() || [];
      setChats([...data]);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [loadChats])
  );

  const handleDelete = (chatId: string) => {
    Alert.alert(
      "Delete Chat?",
      "This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteChat(chatId);

              setSelectedId(null);
              loadChats();
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

  const handleRename = (
    chatId: string,
    title: string
  ) => {
    setCurrentTitle(title);
    setSelectedId(chatId);
    setRenameVisible(true);
  };

  const handleSaveRename = async (
    newTitle: string
  ) => {
    if (!selectedId || !newTitle.trim()) {
      return;
    }

    try {
      await renameChat(
        selectedId,
        newTitle.trim()
      );

      setRenameVisible(false);
      setSelectedId(null);

      loadChats();
    } catch (e) {
      console.log(e);
    }
  };

  const logout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await auth().signOut();
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({
    item,
  }: {
    item: Chat;
  }) => {
    const isSelected =
      selectedId === item.id;

    return (
      <Pressable
        onPress={() => {
          if (isSelected) {
            setSelectedId(null);
          } else {
            navigation.navigate("Chat", {
              chatId: item.id,
            });
          }
        }}
        onLongPress={() =>
          setSelectedId(item.id)
        }
        style={{
          backgroundColor: isSelected
            ? colors.surfaceLight
            : colors.surface,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.lg,
          marginBottom: spacing.md,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 24,
              marginRight: spacing.md,
            }}
          >
            💬
          </Text>

          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                color: colors.text,
                fontSize: 17,
                fontWeight: "600",
              }}
            >
              {item.title || "New Chat"}
            </Text>

            <Text
              style={{
                color: colors.subtext,
                marginTop: 4,
                fontSize: 13,
              }}
            >
              Tap to continue conversation
            </Text>
          </View>
        </View>

        {isSelected && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: spacing.md,
              gap: spacing.xl,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                handleRename(
                  item.id,
                  item.title
                )
              }
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                ✏️
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                handleDelete(item.id)
              }
            >
              <Text
                style={{
                  fontSize: 20,
                }}
              >
                🗑️
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    );
  };

  return (
  <>
    <Pressable
      style={{
        flex: 1,
        backgroundColor: colors.bg,
      }}
      onPress={() => setSelectedId(null)}
    >
      {/* Header */}
      <View
        style={{
          marginTop: spacing.md,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.xl,
          paddingBottom: spacing.lg,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View>
          <Text
            style={{
              color: colors.text,
              fontSize: 30,
              fontWeight: "700",
            }}
          >
            Recent Chats
          </Text>

          <Text
            style={{
              color: colors.subtext,
              marginTop: 4,
              fontSize: 14,
            }}
          >
            {chats.length} conversation
            {chats.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <TouchableOpacity
          onPress={logout}
          activeOpacity={0.8}
          style={{
            marginTop: spacing.md,
            paddingHorizontal: 16,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* Chats */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: 120,
          flexGrow: 1,
        }}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 120,
            }}
          >
            <Text
              style={{
                fontSize: 60,
              }}
            >
              💬
            </Text>

            <Text
              style={{
                color: colors.text,
                fontSize: 20,
                fontWeight: "600",
                marginTop: spacing.md,
              }}
            >
              No conversations yet
            </Text>

            <Text
              style={{
                color: colors.subtext,
                textAlign: "center",
                marginTop: spacing.sm,
                paddingHorizontal: spacing.xl,
              }}
            >
              Start asking legal questions to create
              your first chat.
            </Text>
          </View>
        )}
      />

      {/* Floating New Chat Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        activeOpacity={0.85}
        style={{
          position: "absolute",
          bottom: 35,
          right: 25,
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
          elevation: 8,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 34,
            fontWeight: "300",
            marginTop: -2,
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    </Pressable>

    <RenameModal
      visible={renameVisible}
      currentTitle={currentTitle}
      onClose={() => setRenameVisible(false)}
      onSave={handleSaveRename}
    />
  </>
);
};