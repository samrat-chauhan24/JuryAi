import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { HomeScreen } from './screens/HomeScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ChatListScreen } from './screens/ChatListScreen';
import { initDB } from './database/db';
import { LegalControls } from './components/LegalControls';

import { TouchableOpacity, Text } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await initDB();
      setDbReady(true);
    };
    setup();
  }, []);

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>

        {/* Home (entry only) */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Chat */}
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ navigation }) => ({
            title: 'Chat',

            // 👈 THIS replaces the back arrow
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Chats')}
                style={{ marginLeft: 15 }}
              >
                <Text style={{ fontSize: 20 }}>☰</Text>
              </TouchableOpacity>
            ),

            headerRight: () => <LegalControls />,
          })}
        />

        {/* Chat List */}
        <Stack.Screen
          name="Chats"
          component={ChatListScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_left',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}