import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ THEME
import { colors, spacing, typography } from '../theme';

export const SignUpScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>

        {/* ✅ CENTERED TITLE */}
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.subtext}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={colors.subtext}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={colors.subtext}
          secureTextEntry
        />

        {/* ✅ HALF WIDTH BUTTON CENTERED */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={() => navigation.replace('Home')}
            style={styles.button}
          >
            <Text style={styles.placeholder}>Create Account</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ CENTERED LINK WITH HIGHLIGHT */}
        <View style={styles.linkRow}>
          <Text style={styles.linkText}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.linkHighlight}>Sign in</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

// ✅ STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },

  // ✅ centered title
  title: {
    ...typography.title,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  input: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginTop: spacing.md,
    color: colors.text,
  },

  // ✅ wrapper for centering half button
  buttonWrapper: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  // ✅ half width button
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: '60%', // 👈 half size pill

    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,

    paddingHorizontal: spacing.md,
    paddingVertical: 12,
  },

  placeholder: {
    color: colors.subtext,
  },

  arrow: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },

  // ✅ centered link row
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },

  linkText: {
    color: colors.subtext,
  },

  // ✅ highlighted clickable text
  linkHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
});