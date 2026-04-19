import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import { IntroScreen } from './screens/IntroScreen';
import { SignInScreen } from './screens/SignInScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ChatListScreen } from './screens/ChatListScreen';

import { initDB } from './database/db';
import { LegalControls } from './components/LegalControls';

// THEME
import { colors, spacing, typography } from './theme';

const Stack = createStackNavigator();

export default function App() {
  // ✅ ALL HOOKS FIRST (IMPORTANT)
  const [dbReady, setDbReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // DB INIT
  useEffect(() => {
    const setup = async () => {
      await initDB();
      setDbReady(true);
    };
    setup();
  }, []);

  // AUTH LISTENER
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  // ✅ NOW SAFE TO RETURN CONDITIONALLY
  if (!dbReady || checkingAuth) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.bg,
        }}
      >
        <Image
          source={require('./assets/logo3.png')}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            marginBottom: 20,
          }}
        />
        <ActivityIndicator size="small" color={colors.subtext} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
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
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />

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

            <Stack.Screen
              name="Chats"
              component={ChatListScreen}
              options={{
                headerShown: false,
                animation: 'slide_from_left',
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Intro"
              component={IntroScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}