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

import {
  getChats,
  deleteChat,
  renameChat,
} from '../database/chatQueries';

import { RenameModal } from '../components/RenameModal';

type Chat = {
  id: string;
  title: string;
};

export const ChatListScreen = ({ navigation }: any) => {
  const [chats, setChats] = useState<Chat[]>([]);

  // 🔥 selection state
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 🔥 rename modal
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

  // 🗑 Delete
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

  // ✏️ Rename
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
            setSelectedId(null); // 👈 deselect
          } else {
            navigation.navigate('Chat', { chatId: item.id });
          }
        }}
        onLongPress={() => setSelectedId(item.id)}
        style={{
          paddingVertical: 14,
          backgroundColor: isSelected ? '#f2f2f2' : '#fff',
        }}
      >
        <Text numberOfLines={1} style={{ fontSize: 16 }}>
          {item.title || 'New Chat'}
        </Text>

        {/* 🔥 Inline Actions */}
        {isSelected && (
          <View
            style={{
              flexDirection: 'row',
              marginTop: 8,
              gap: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => handleRename(item.id, item.title)}
            >
              <Text style={{ color: '#007AFF' }}>Rename</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
            >
              <Text style={{ color: 'red' }}>Delete</Text>
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
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 20,
      }}
      onPress={() => setSelectedId(null)} // 👈 tap outside clears selection
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: '600',
          marginBottom: 10,
        }}
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
          bottom: 30,
          right: 20,
          backgroundColor: '#000',
          paddingVertical: 12,
          paddingHorizontal: 18,
          borderRadius: 30,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>
          + Chat
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