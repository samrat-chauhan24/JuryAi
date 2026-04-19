import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';

import { IntroScreen } from './screens/IntroScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ChatListScreen } from './screens/ChatListScreen';
import { initDB } from './database/db';
import { LegalControls } from './components/LegalControls';

import { TouchableOpacity, Text } from 'react-native';

// ✅ THEME
import { colors, spacing, typography } from './theme';

import { Image } from 'react-native';

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
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg, // or colors.bg
      }}
    >
      <Image
        source={require('./assets/logo3.png')}
        style={{
          width: 80,
          height: 80,
          borderRadius: 40, // 👈 makes it round
          marginBottom: 20,
          resizeMode: 'cover', // 👈 important
        }}
      />

      {/* Optional subtle loader */}
      <ActivityIndicator size="small" color="#888" />
    </View>
  );
}

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Intro"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.bg,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            ...typography.subtitle,
          },
          headerTintColor: colors.text,
        }}
      >

        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{ headerShown: false }}
        />

        {/* Home */}
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

            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Chats')}
                style={{ marginLeft: spacing.md }}
              >
                <Text style={{ fontSize: 20, color: colors.text }}>
                  ☰
                </Text>
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