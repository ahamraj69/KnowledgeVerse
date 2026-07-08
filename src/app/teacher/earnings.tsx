import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";

// ✅ PERMANENT PATH ALIAS CONFIGURATION (Matches your exact tsconfig compiler mappings)
import EmptyState from "@/components/EmptyState";
import SkeletonCard from "@/components/SkeletonCard";
import { useAuth } from "@/context/AuthContext";
import { useNetwork } from "@/context/NetworkContext";
import { EarningsLedger, getTeacherEarningsData, TransactionReceipt } from "@/services/earningsService";
import { Theme } from "@/theme/theme";

export default function TeacherEarningsScreen() {
  const { user } = useAuth();
  const { isConnected } = useNetwork();
  
  const [ledger, setLedger] = useState<EarningsLedger | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEarnings = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const data = await getTeacherEarningsData(user.uid);
      setLedger(data);
    } catch (e) {
      console.log("Error loading teacher financial nodes:", e);
        } finally { // ✅ FIXED: Replaced the typo 'military-finally' with the native 'finally' block key
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadEarnings();
    }, [loadEarnings])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadEarnings();
  }, [loadEarnings]);

  const renderTransactionItem = useCallback(({ item }: { item: TransactionReceipt }) => (
    <View style={styles.transactionCard}>
      <View style={styles.txInfo}>
        <Text style={[Theme.text, styles.txStudent]}>{item.studentName}</Text>
        <Text style={Theme.muted}>{item.courseTitle}</Text>
      </View>
      <Text style={styles.txAmount}>+₹{item.amount}</Text>
    </View>
  ), []);

  const listHeader = useMemo(() => {
    if (!ledger) return null;
    return (
      <View>
        <Text style={[Theme.text, styles.mainTitle]}>📊 Revenue Dashboard</Text>
        <Text style={[Theme.muted, styles.subtitle]}>Track course subscription metrics, payouts and creator splits.</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Gross Revenue</Text>
            <Text style={[Theme.text, styles.metricValue]}>₹{ledger.grossRevenue}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Creator Split (70%)</Text>
            <Text style={[Theme.text, styles.metricValue, { color: "#10B981" }]}>₹{ledger.payoutBalance}</Text>
          </View>
        </View>

        <View style={[styles.metricCard, styles.fullWidthCard]}>
          <Text style={styles.metricLabel}>Total Courses Sold</Text>
          <Text style={[Theme.text, styles.metricValue]}>{ledger.totalSalesCount} Licenses</Text>
        </View>

        <Text style={[Theme.text, styles.sectionTitle]}>⏱️ Recent Transactions</Text>
      </View>
    );
  }, [ledger]);

  if (loading && !refreshing) {
    return (
      <View style={[Theme.screen, styles.loadingPadding]}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </View>
    );
  }

  return (
    <View style={Theme.screen}>
      <FlatList
        data={ledger?.recentTransactions || []}
        keyExtractor={(item) => item.id}
        renderItem={renderTransactionItem}
        ListHeaderComponent={listHeader}
        removeClippedSubviews={true}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563EB" colors={["#2563EB"]} />
        }
        ListEmptyComponent={
          <EmptyState 
            icon="💰" 
            title="No Sales Tally Logs" 
            subtitle="Financial ledger statements will automatically format here once students purchase your course licenses." 
          />
        }
        contentContainerStyle={styles.container}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40, flexGrow: 1 },
  loadingPadding: { padding: 20 },
  mainTitle: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 24 },
  metricsGrid: { flexDirection: "row", justifyContent: "space-between", gap: 16, marginBottom: 16 },
  metricCard: { backgroundColor: "#111827", flex: 1, padding: 18, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" },
  fullWidthCard: { marginBottom: 28 },
  metricLabel: { color: "#9CA3AF", fontSize: 13, fontWeight: "600", textTransform: "uppercase", marginBottom: 6 },
  metricValue: { fontSize: 22, fontWeight: "bold" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 14 },
  transactionCard: { backgroundColor: "#1E293B", padding: 16, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  txInfo: { flex: 1, marginRight: 10 },
  txStudent: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  txAmount: { color: "#10B981", fontSize: 17, fontWeight: "bold" }
});
