import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ THEME
import { colors, spacing, typography } from '../theme';

export const IntroScreen = ({ navigation }: any) => {
  // ✅ HARD CODED FOR TESTING
  const isLoggedIn = false;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>

        {/* CENTER */}
        <View style={styles.center}>
          <Image
            source={require('../assets/logo3.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>LawGPT</Text>

          <Text style={styles.subtitle}>
            Ask about laws, rights, or regulations
          </Text>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
  {isLoggedIn ? (
    <TouchableOpacity
      onPress={() => navigation.replace('Home')}
      style={styles.button}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>Get Started</Text>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  ) : (
    <View style={styles.row}>
      {/* SIGN IN */}
      <TouchableOpacity
        onPress={() => navigation.navigate('SignIn')}
        style={[styles.button, styles.halfButton]}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>Sign In</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      {/* SIGN UP */}
      <TouchableOpacity
        onPress={() => navigation.navigate('SignUp')}
        style={[styles.button, styles.halfButton]}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>Sign Up</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>
    </View>
  )}
</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.md,
    resizeMode: 'cover',
  },
  title: {
    ...typography.title,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.subtext,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  actions: {
    width: '90%',
    marginBottom: spacing.lg,
  },

  // ✅ ADD THESE (fix)
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfButton: {
    flex: 1,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    color: colors.subtext,
    flex: 1,
    fontSize: 15,
  },
  arrow: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});