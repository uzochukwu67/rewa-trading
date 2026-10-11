import React from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppState } from '@/context/AppState';
import { money } from '@/data/market';
import { useColors } from '@/hooks/useColors';
import { DemoBadge, Page, Panel, PrimaryButton, SectionHeading, Txt } from '@/components/ui';

function ProfileItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.item, pressed && { opacity: 0.72 }]}>
      <View style={[styles.itemIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={18} color={colors.foreground} /></View>
      <View style={{ flex: 1, gap: 3 }}><Txt size={14} weight="medium">{title}</Txt><Txt size={11} color={colors.mutedForeground}>{subtitle}</Txt></View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const router = useRouter();
  const state = useAppState();
  const showInfo = (title: string, detail: string) => Alert.alert(title, detail);
  const signOut = () => Alert.alert('Leave the demo?', 'Your sample trades and preferences stay saved on this device.', [
    { text: 'Stay here', style: 'cancel' },
    { text: 'Sign out', style: 'destructive', onPress: () => { state.signOut(); router.replace('/'); } },
  ]);

  return (
    <Page>
      <View style={styles.header}>
        <View><Txt size={25} weight="semibold">Profile</Txt><Txt size={13} color={colors.mutedForeground}>Your demo account</Txt></View>
        <DemoBadge label="DEMO" />
      </View>
      <Panel style={styles.userCard}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Txt size={23} weight="bold" color={colors.primaryForeground}>{state.userName.charAt(0).toUpperCase()}</Txt>
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          <Txt size={17} weight="semibold">{state.userName}</Txt>
          <Txt size={12} color={colors.mutedForeground}>Demo trader · Sample profile</Txt>
        </View>
        <Pressable onPress={() => showInfo('Profile', 'This profile is stored locally for the demo.')} accessibilityLabel="Edit profile">
          <Feather name="edit-2" size={18} color={colors.mutedForeground} />
        </Pressable>
      </Panel>
      <View style={styles.statGrid}>
        {[
          { label: 'Wallet', value: money(state.walletBalance) },
          { label: 'Favorites', value: String(state.favorites.length) },
          { label: 'Trades', value: String(state.positions.length) },
        ].map((item) => (
          <Panel key={item.label} style={styles.statCard}>
            <Txt size={11} color={colors.mutedForeground}>{item.label}</Txt>
            <Txt size={15} weight="semibold" numberOfLines={1}>{item.value}</Txt>
          </Panel>
        ))}
      </View>
      <SectionHeading title="Account" />
      <Panel style={{ paddingVertical: 2, paddingHorizontal: 13, gap: 0 }}>
        <ProfileItem icon="user" title="Personal details" subtitle="Name and contact information" onPress={() => showInfo('Personal details', 'Your profile details are sample data for this demo.')} />
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
        <ProfileItem icon="shield" title="Verification" subtitle="Demo profile · Not verified" onPress={() => showInfo('Verification', 'Identity verification is not available in this mock app.')} />
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
        <ProfileItem icon="credit-card" title="My wallet" subtitle={`Demo balance ${money(state.walletBalance)}`} onPress={() => showInfo('Demo wallet', 'Use Add money or Withdraw on Home to adjust sample funds. No real payment methods are connected.')} />
      </Panel>
      <SectionHeading title="Help and information" />
      <Panel style={{ paddingVertical: 2, paddingHorizontal: 13, gap: 0 }}>
        <ProfileItem icon="message-circle" title="Chat with support" subtitle="Support is not connected in the demo" onPress={() => showInfo('Support', 'This sample app does not send messages to a support team.')} />
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
        <ProfileItem icon="file-text" title="Risk disclosure" subtitle="Trading involves risk" onPress={() => showInfo('Risk disclosure', 'This is a UI prototype with simulated prices and orders. It is not an investment service or financial advice.')} />
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: colors.border }} />
        <ProfileItem icon="settings" title="App preferences" subtitle="Notifications, language and security" onPress={() => showInfo('Preferences', 'App preferences are not connected in this demo.')} />
      </Panel>
      <PrimaryButton title="Sign out of demo" icon="log-out" variant="outline" onPress={signOut} />
      <Txt size={11} color={colors.mutedForeground} style={{ textAlign: 'center' }}>Doto visual prototype · No real account access</Txt>
    </Page>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  avatar: { width: 54, height: 54, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  statGrid: { flexDirection: 'row', gap: 9 },
  statCard: { flex: 1, paddingHorizontal: 12, paddingVertical: 13, gap: 7 },
  item: { minHeight: 65, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  itemIcon: { width: 37, height: 37, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
