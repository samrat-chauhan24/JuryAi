import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import FirestoreService from '../services/firestoreService';
import { signUp } from '../services/authService';

import { colors, spacing, typography } from '../theme';

export const SignUpScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isDisabled =
    loading ||
    !email ||
    !password ||
    !confirmPassword ||
    password !== confirmPassword;

  const handleSignUp = async () => {
    if (isDisabled) return;

    try {
      setLoading(true);

      await signUp(email, password);

      await FirestoreService.createUser('', email);

      navigation.replace('Home');
    } catch (e: any) {
      console.log('SIGN UP ERROR:', e);
      console.log('CODE:', e?.code);
      console.log('MESSAGE:', e?.message);

      if (e.code === 'auth/email-already-in-use') {
        Alert.alert('Error', 'Email already registered');
      } else if (e.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email');
      } else if (e.code === 'auth/weak-password') {
        Alert.alert(
          'Error',
          'Password must be at least 6 characters'
        );
      } else {
        Alert.alert('Error', 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              returnKeyType="next"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.subtext}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              returnKeyType="next"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor={colors.subtext}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />

            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                disabled={isDisabled}
                onPress={handleSignUp}
                style={[
                  styles.button,
                  {
                    opacity: isDisabled ? 0.4 : 1,
                  },
                ]}
              >
                <Text style={styles.placeholder}>
                  {loading
                    ? 'Creating...'
                    : 'Create Account'}
                </Text>

                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.linkRow}>
              <Text style={styles.linkText}>
                Already have an account?{' '}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SignIn')
                }
              >
                <Text style={styles.linkHighlight}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  inner: {
    padding: spacing.lg,
  },

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

  buttonWrapper: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
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

  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },

  linkText: {
    color: colors.subtext,
  },

  linkHighlight: {
    color: colors.primary,
    fontWeight: '600',
  },
});