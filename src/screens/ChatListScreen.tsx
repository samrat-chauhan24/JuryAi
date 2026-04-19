import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';

import {
  getChats,
  deleteChat,
  renameChat,
} from '../database/chatQueries';

import { RenameModal } from '../components/RenameModal';

// ✅ THEME
import { colors, spacing, radius, typography } from '../theme';

type Chat = {
  id: string;
  title: string;
};

export const ChatListScreen = ({ navigation }: any) => {
  const [chats, setChats] = useState<Chat[]>([]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [renameVisible, setRenameVisible] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');

  const loadChats = useCallback(() => {
    const data = getChats() || [];
    setChats([...data]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadChats();
    }, [loadChats])
  );

  const handleDelete = (chatId: string) => {
    Alert.alert(
      'Delete Chat?',
      'This cannot be undone',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteChat(chatId);
            setSelectedId(null);
            loadChats();
          },
        },
      ]
    );
  };

  const handleRename = (chatId: string, title: string) => {
    setCurrentTitle(title);
    setSelectedId(chatId);
    setRenameVisible(true);
  };

  const handleSaveRename = (newTitle: string) => {
    if (!selectedId || !newTitle.trim()) return;

    renameChat(selectedId, newTitle.trim());
    setRenameVisible(false);
    setSelectedId(null);
    loadChats();
  };

  const renderItem = ({ item }: { item: Chat }) => {
    const isSelected = selectedId === item.id;

    return (
      <Pressable
        onPress={() => {
          if (isSelected) {
            setSelectedId(null);
          } else {
            navigation.navigate('Chat', { chatId: item.id });
          }
        }}
        onLongPress={() => setSelectedId(item.id)}
        style={{
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.sm,
          backgroundColor: isSelected ? colors.surfaceLight : colors.bg,
          borderRadius: radius.md,
          marginBottom: spacing.sm,
        }}
      >
        <Text
          numberOfLines={1}
          style={[
            typography.body,
            { fontSize: 16 },
          ]}
        >
          {item.title || 'New Chat'}
        </Text>

        {/* Inline Actions */}
        {isSelected && (
          <View
            style={{
              flexDirection: 'row',
              marginTop: spacing.sm,
              gap: spacing.lg,
            }}
          >
            <TouchableOpacity
              onPress={() => handleRename(item.id, item.title)}
            >
              <Text style={{ color: colors.primary }}>
                Rename
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
            >
              <Text style={{ color: colors.error }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <Pressable
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
      }}
      onPress={() => setSelectedId(null)}
    >
      <Text
        style={[
          typography.title,
          {
            marginBottom: spacing.md,
          },
        ]}
      >
        Recent Chats
      </Text>

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
      />

      {/* + Chat */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={{
          position: 'absolute',
          bottom: spacing.xl,
          right: spacing.lg,
          backgroundColor: colors.primary,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.pill,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontWeight: '600',
          }}
        >
          + New Chat
        </Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        onPress={() => {
        Alert.alert(
          'Sign Out',
          'Are you sure you want to sign out?',
          [
            {
              text: 'No',
              style: 'cancel',
            },
            {
              text: 'Yes',
              style: 'destructive',
              onPress: async () => {
                try {
                  await auth().signOut();
                } catch (e) {
                  console.log('Logout error', e);
                }
              },
            },
          ]
        );
      }}
        style={{
          position: 'absolute',
          bottom: spacing.xl,
          left: spacing.xl,
          backgroundColor: colors.primary,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: radius.pill,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontWeight: '600',
          }}
        >
          Sign Out
        </Text>
      </TouchableOpacity>

      {/* Rename Modal */}
      <RenameModal
        visible={renameVisible}
        currentTitle={currentTitle}
        onClose={() => setRenameVisible(false)}
        onSave={handleSaveRename}
      />
    </Pressable>
  );
};