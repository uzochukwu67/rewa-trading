import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useAppState } from '@/context/AppState';
import { useColors } from '@/hooks/useColors';
import { Brand, DemoBadge, MiniChart, PrimaryButton, Txt } from '@/components/ui';

type Flow = 'splash' | 'welcome' | 'email' | 'phone' | 'passcode';

function OnboardingChart() {
  const colors = useColors();
  return (
    <View style={styles.illustration}>
      <MiniChart height={218} color={colors.primary} />
      <View style={[styles.coin, { backgroundColor: colors.bitcoin }]}>
        <Txt size={53} weight="bold" color={colors.foreground}>₿</Txt>
      </View>
      <View style={[styles.upBadge, { backgroundColor: colors.primary }]}>
        <Feather name="arrow-up-right" size={22} color={colors.primaryForeground} />
      </View>
      <View style={[styles.gainBadge, { backgroundColor: colors.primary }]}>
        <Txt size={22} weight="bold" color={colors.primaryForeground}>+$500</Txt>
      </View>
    </View>
  );
}

function Splash({ analyzing }: { analyzing: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.splash, { backgroundColor: colors.background }]}>
      {analyzing ? (
        <>
          <View style={[styles.pulseOuter, { borderColor: colors.primary }]} />
          <View style={[styles.pulse, { backgroundColor: colors.primary }]} />
          <Txt size={18} color={colors.foreground}>Analyzing trends with AI</Txt>
        </>
      ) : <Brand />}
    </View>
  );
}

export default function WelcomeScreen() {
  const colors = useColors();
  const router = useRouter();
  const session = useAppState();
  const [flow, setFlow] = useState<Flow>('splash');
  const [pin, setPin] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    if (!session.ready) return;
    if (session.hasOnboarded) {
      router.replace('/(tabs)');
      return;
    }
    const timer = setTimeout(() => setFlow('welcome'), 850);
    return () => clearTimeout(timer);
  }, [session.ready, session.hasOnboarded, router]);

  const proceedToPasscode = () => {
    if ((flow === 'email' || flow === 'phone') && !contact.trim()) {
      Alert.alert('Enter your details', `Add a ${flow === 'email' ? 'sample email address' : 'sample phone number'} to continue.`);
      return;
    }
    setFlow('passcode');
  };

  const finish = () => session.finishOnboarding('Victor Ezeanor');
  const addDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const next = `${pin}${digit}`;
    setPin(next);
    if (next.length === 4) {
      setTimeout(finish, 180);
    }
  };

  if (!session.ready || flow === 'splash') {
    return <Splash analyzing={session.ready} />;
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.container, { backgroundColor: colors.background }]}>
      {flow === 'passcode' ? (
        <View style={styles.passcodePage}>
          <Pressable onPress={() => { setFlow('welcome'); setPin(''); }} style={styles.backButton} accessibilityLabel="Back">
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <View style={styles.passcodeHeading}>
            <Txt size={23} weight="semibold">Create your passcode</Txt>
            <Txt size={14} color={colors.mutedForeground}>Use any 4 digits for this demo</Txt>
            <View style={styles.pinDots}>
              {[0, 1, 2, 3].map((index) => (
                <View key={index} style={[
                  styles.pinDot,
                  { backgroundColor: pin.length > index ? colors.primary : colors.mutedForeground },
                ]} />
              ))}
            </View>
          </View>
          <View style={styles.keypad}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'].map((key, index) => (
              <Pressable
                key={`${key}-${index}`}
                testID={key ? `key-${key}` : `key-empty-${index}`}
                onPress={() => key === 'back' ? setPin((value) => value.slice(0, -1)) : key && addDigit(key)}
                style={styles.key}
                accessibilityRole={key ? 'button' : undefined}
                accessibilityLabel={key === 'back' ? 'Delete last digit' : key || undefined}
              >
                {key === 'back'
                  ? <Feather name="delete" size={23} color={colors.foreground} />
                  : key ? <Txt size={28} weight="medium">{key}</Txt> : null}
              </Pressable>
            ))}
          </View>
          <Pressable onPress={finish} style={styles.skipButton} accessibilityRole="button">
            <Txt size={15} weight="medium" color={colors.mutedForeground}>Skip this time</Txt>
          </Pressable>
          <DemoBadge label="NO REAL ACCOUNT OR ORDERS" />
        </View>
      ) : flow === 'welcome' ? (
        <ScrollView contentContainerStyle={styles.welcomePage} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeTop}>
            <Brand />
            <DemoBadge />
          </View>
          <OnboardingChart />
          <View style={styles.welcomeCopy}>
            <Txt size={32} weight="semibold" style={styles.welcomeTitle}>The market moves 1%.</Txt>
            <Txt size={32} weight="semibold" style={styles.welcomeTitle}>You profit $500.</Txt>
            <Txt size={16} color={colors.mutedForeground} style={styles.centerText}>
              Up or down — discover the next trend with simulated trading ideas.
            </Txt>
          </View>
          <View style={styles.authActions}>
            <PrimaryButton title="Continue with Google" icon="globe" variant="white" onPress={proceedToPasscode} />
            <View style={styles.orRow}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Txt size={13} color={colors.mutedForeground}>or continue with</Txt>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>
            <View style={styles.authOptions}>
              <Pressable onPress={() => { setContact(''); setFlow('phone'); }} style={[styles.authCircle, { backgroundColor: colors.secondary }]} accessibilityLabel="Continue with phone">
                <Feather name="smartphone" size={23} color={colors.foreground} />
              </Pressable>
              <Pressable onPress={() => { setContact(''); setFlow('email'); }} style={[styles.authCircle, { backgroundColor: colors.secondary }]} accessibilityLabel="Continue with email">
                <Feather name="mail" size={23} color={colors.foreground} />
              </Pressable>
            </View>
            <Txt size={11} color={colors.mutedForeground} style={styles.centerText}>
              Sign-in and market data are simulated. No brokerage is connected.
            </Txt>
            <Txt size={11} color={colors.mutedForeground} style={styles.legalText}>
              By continuing, you agree to the <Txt size={11} color={colors.foreground}>Risk Disclosure</Txt>, <Txt size={11} color={colors.foreground}>Client Agreement</Txt> and other documents.
            </Txt>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.contactPage}>
          <Pressable onPress={() => setFlow('welcome')} style={styles.backButton} accessibilityLabel="Back">
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <Brand small />
          <Txt size={27} weight="semibold">{flow === 'email' ? 'Enter your email' : 'Enter your phone'}</Txt>
          <Txt size={14} color={colors.mutedForeground}>
            This field is for the demo only. No message will be sent.
          </Txt>
          <TextInput
            testID="contact-input"
            value={contact}
            onChangeText={setContact}
            keyboardType={flow === 'email' ? 'email-address' : 'phone-pad'}
            autoCapitalize="none"
            placeholder={flow === 'email' ? 'name@example.com' : '+1 555 123 4567'}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.contactInput, { color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border }]}
          />
          <PrimaryButton title="Continue" onPress={proceedToPasscode} />
          <DemoBadge label="SIMULATED SIGN-IN" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  splash: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  pulseOuter: { width: 66, height: 66, borderRadius: 40, borderWidth: 8, opacity: 0.12, position: 'absolute' },
  pulse: { width: 22, height: 22, borderRadius: 15 },
  welcomePage: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, minHeight: '100%', justifyContent: 'space-between', gap: 16 },
  welcomeTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  illustration: { height: 214, justifyContent: 'center', overflow: 'visible' },
  coin: { position: 'absolute', width: 112, height: 112, borderRadius: 58, alignItems: 'center', justifyContent: 'center', right: 52, top: 12, elevation: 8 },
  upBadge: { position: 'absolute', right: 34, top: 7, width: 46, height: 46, borderRadius: 25, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
  gainBadge: { position: 'absolute', top: 133, left: 94, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  welcomeCopy: { gap: 5, alignItems: 'center' },
  welcomeTitle: { textAlign: 'center', lineHeight: 39 },
  centerText: { textAlign: 'center', lineHeight: 22 },
  authActions: { gap: 14, paddingBottom: 4 },
  orRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { height: StyleSheet.hairlineWidth, flex: 1 },
  authOptions: { flexDirection: 'row', justifyContent: 'center', gap: 18 },
  authCircle: { width: 58, height: 58, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  legalText: { textAlign: 'center', lineHeight: 17 },
  passcodePage: { flex: 1, paddingHorizontal: 22, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  backButton: { alignSelf: 'flex-start', padding: 8 },
  passcodeHeading: { alignItems: 'center', gap: 13, marginTop: 3 },
  pinDots: { flexDirection: 'row', gap: 22, marginTop: 18 },
  pinDot: { width: 13, height: 13, borderRadius: 8 },
  keypad: { width: '100%', maxWidth: 390, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  key: { width: '33.33%', height: 72, alignItems: 'center', justifyContent: 'center' },
  skipButton: { paddingVertical: 10, paddingHorizontal: 20 },
  contactPage: { flex: 1, padding: 22, paddingTop: 12, gap: 17 },
  contactInput: { height: 54, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Inter_500Medium', marginTop: 6 },
});
