import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useAppState } from '@/context/AppState';
import { money } from '@/data/market';
import { useColors } from '@/hooks/useColors';
import { AssetMark, DemoBadge, MiniChart, Page, Panel, PrimaryButton, SectionHeading, Txt, marketFor } from '@/components/ui';

type TradeSide = 'Buy' | 'Sell';
type OrderType = 'Market' | 'Pending';

export default function TradeScreen() {
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ symbol?: string }>();
  const state = useAppState();
  const symbol = typeof params.symbol === 'string' ? params.symbol : state.selectedSymbol;
  const market = marketFor(symbol);
  const [side, setSide] = useState<TradeSide>('Buy');
  const [orderType, setOrderType] = useState<OrderType>('Market');
  const [size, setSize] = useState(0.1);
  const [leverage, setLeverage] = useState(10);
  const [working, setWorking] = useState(false);

  const submitOrder = () => {
    setWorking(true);
    state.setSelectedSymbol(market.symbol);
    state.openPosition(market.symbol, side, size);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setWorking(false);
      router.replace('/(tabs)/portfolio');
      Alert.alert('Demo order opened', `${side} ${size.toFixed(2)} ${market.symbol} was added to simulated open positions.`);
    }, 250);
  };

  return (
    <Page>
      <View style={styles.header}>
        <View><Txt size={25} weight="semibold">Trade</Txt><Txt size={13} color={colors.mutedForeground}>Practice with simulated orders</Txt></View>
        <DemoBadge label="PRACTICE" />
      </View>
      <Pressable
        onPress={() => router.push({ pathname: '/asset/[symbol]', params: { symbol: market.symbol } })}
        style={[styles.assetSelect, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <AssetMark market={market} size={43} />
        <View style={{ flex: 1, gap: 3 }}><Txt size={15} weight="semibold">{market.symbol}</Txt><Txt size={12} color={colors.mutedForeground}>{market.name} · Demo market</Txt></View>
        <Txt size={14} weight="semibold">{money(market.price)}</Txt>
        <Feather name="chevron-down" size={16} color={colors.mutedForeground} />
      </Pressable>
      <Panel style={styles.chartPanel}>
        <View style={styles.chartHeader}>
          <View><Txt size={12} color={colors.mutedForeground}>Simulated price</Txt><Txt size={24} weight="semibold">{money(market.price)}</Txt></View>
          <Txt size={12} weight="medium" color={market.change >= 0 ? colors.primary : colors.destructive}>{market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}%</Txt>
        </View>
        <MiniChart height={112} color={market.change >= 0 ? colors.primary : colors.destructive} />
        <View style={styles.periods}>{['1H', '4H', '1D', '1W', '1M'].map((period, index) => <Txt key={period} size={11} weight={index === 2 ? 'semibold' : 'regular'} color={index === 2 ? colors.primary : colors.mutedForeground}>{period}</Txt>)}</View>
      </Panel>

      <View style={[styles.segment, { backgroundColor: colors.card }]}>
        {(['Market', 'Pending'] as OrderType[]).map((item) => (
          <Pressable key={item} onPress={() => setOrderType(item)} style={[styles.segmentItem, orderType === item && { backgroundColor: colors.secondary }]}>
            <Txt size={13} weight={orderType === item ? 'semibold' : 'regular'} color={orderType === item ? colors.foreground : colors.mutedForeground}>{item}</Txt>
          </Pressable>
        ))}
      </View>
      <SectionHeading title={orderType === 'Market' ? 'Market order' : 'Pending order'} />
      <View style={styles.tradeButtons}>
        {(['Sell', 'Buy'] as TradeSide[]).map((item) => {
          const selected = side === item;
          const color = item === 'Buy' ? colors.primary : colors.destructive;
          return (
            <Pressable key={item} onPress={() => setSide(item)} style={[styles.sideButton, { borderColor: selected ? color : colors.border, backgroundColor: selected ? `${color}18` : colors.card }]}>
              <Feather name={item === 'Buy' ? 'trending-up' : 'trending-down'} size={17} color={color} />
              <Txt size={15} weight="semibold" color={color}>{item}</Txt>
            </Pressable>
          );
        })}
      </View>
      {orderType === 'Pending' ? (
        <Panel style={{ gap: 7 }}>
          <Txt size={13} weight="semibold">Pending order preview</Txt>
          <Txt size={12} color={colors.mutedForeground}>This demo ticket records your order as a simulated open position at the displayed price.</Txt>
        </Panel>
      ) : null}
      <Panel style={{ gap: 15 }}>
        <View style={styles.rowBetween}><Txt size={14} weight="medium">Trade size</Txt><Txt size={13} color={colors.mutedForeground}>Lots</Txt></View>
        <View style={styles.stepper}>
          <Pressable onPress={() => setSize((value) => Math.max(0.01, Math.round((value - 0.01) * 100) / 100))} style={[styles.stepperButton, { backgroundColor: colors.secondary }]} accessibilityLabel="Decrease trade size"><Feather name="minus" size={19} color={colors.foreground} /></Pressable>
          <Txt size={23} weight="semibold">{size.toFixed(2)}</Txt>
          <Pressable onPress={() => setSize((value) => Math.min(5, Math.round((value + 0.01) * 100) / 100))} style={[styles.stepperButton, { backgroundColor: colors.secondary }]} accessibilityLabel="Increase trade size"><Feather name="plus" size={19} color={colors.foreground} /></Pressable>
        </View>
        <View style={styles.rowBetween}><Txt size={14} weight="medium">Leverage</Txt><Txt size={13} color={colors.mutedForeground}>Demo only</Txt></View>
        <View style={styles.leverageRow}>{[1, 5, 10, 20].map((item) => (
          <Pressable key={item} onPress={() => setLeverage(item)} style={[styles.leverage, { backgroundColor: leverage === item ? colors.primary : colors.secondary }]}>
            <Txt size={12} weight="semibold" color={leverage === item ? colors.primaryForeground : colors.foreground}>{item}×</Txt>
          </Pressable>
        ))}</View>
        <View style={[styles.rowBetween, styles.marginRow, { borderTopColor: colors.border }]}>
          <Txt size={12} color={colors.mutedForeground}>Estimated demo margin</Txt>
          <Txt size={13} weight="semibold">{money((market.price * size) / leverage)}</Txt>
        </View>
      </Panel>
      <PrimaryButton
        testID="submit-demo-order"
        title={working ? 'Opening demo order…' : `Open demo ${side.toLowerCase()}`}
        icon={side === 'Buy' ? 'arrow-up-right' : 'arrow-down-right'}
        onPress={submitOrder}
        disabled={working}
      />
      <Txt size={11} color={colors.mutedForeground} style={{ textAlign: 'center' }}>
        Practice only. No order is sent to a broker.
      </Txt>
    </Page>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  assetSelect: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 19, borderWidth: 1 },
  chartPanel: { padding: 14, gap: 8 },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  periods: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 7 },
  segment: { flexDirection: 'row', padding: 4, borderRadius: 16, gap: 4 },
  segmentItem: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 13 },
  tradeButtons: { flexDirection: 'row', gap: 10 },
  sideButton: { flex: 1, height: 50, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepperButton: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  leverageRow: { flexDirection: 'row', gap: 9 },
  leverage: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 12 },
  marginRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 13, marginTop: 1 },
});
