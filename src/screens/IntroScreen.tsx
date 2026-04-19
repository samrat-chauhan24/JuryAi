import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ THEME
import { colors, spacing, typography } from '../theme';

export const IntroScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: spacing.xl,
        }}
      >
        {/* CENTER CONTENT */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing.xl,
          }}
        >
          {/* ✅ LOGO */}
          <Image
            source={require('../assets/logo3.png')}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40, // 👈 makes it round
              marginBottom: 20,
              resizeMode: 'cover', // 👈 important
            }}
            />

          {/* ✅ TITLE */}
          <Text
            style={[
              typography.title,
              {
                textAlign: 'center',
                fontSize: 28,
                fontWeight: '700',
              },
            ]}
          >
            LawGPT
          </Text>

          {/* ✅ SUBTEXT */}
          <Text
            style={{
              color: colors.subtext,
              marginTop: spacing.sm,
              textAlign: 'center',
            }}
          >
            Ask about laws, rights, or regulations
          </Text>
        </View>

        {/* ✅ INPUT-STYLE BUTTON */}
        <View
          style={{
            width: '90%',
            marginBottom: spacing.lg,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.replace('Home')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              backgroundColor: colors.surface,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: colors.border,

              paddingHorizontal: spacing.md,
              paddingVertical: 10,

              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Text
              style={{
                color: colors.subtext,
                flex: 1,
                fontSize: 15,
              }}
            >
              Get Started...
            </Text>

            <Text
              style={{
                color: colors.primary,
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};