import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";

import EarningCard from "../../components/EarningCard";
import RevenueChart from "../../components/RevenueChart";

import {
    calculateEarnings,
    getTeacherPayments,
    Payment,
} from "../../services/earningService";

export default function TeacherEarnings() {
  const teacherId = "teacher_123";

  const [loading, setLoading] = useState(true);

  const [payments, setPayments] = useState<Payment[]>([]);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    teacherRevenue: 0,
    platformRevenue: 0,
    totalSales: 0,
  });

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await getTeacherPayments(teacherId);

      setPayments(data);

      setStats(calculateEarnings(data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2563EB"
        />

        <Text style={styles.loading}>
          Loading Earnings...
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={payments}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>
            💰 Earnings Dashboard
          </Text>

          <EarningCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue}`}
            icon="💳"
            color="#2563EB"
          />

          <EarningCard
            title="Your Earnings"
            value={`₹${stats.teacherRevenue}`}
            icon="💰"
            color="#10B981"
          />

          <EarningCard
            title="Platform Fee"
            value={`₹${stats.platformRevenue}`}
            icon="🏢"
            color="#F59E0B"
          />

          <EarningCard
            title="Course Sales"
            value={stats.totalSales}
            icon="📚"
            color="#7C3AED"
          />

          <RevenueChart
            values={payments.map(
              (item) => item.teacherAmount
            )}
          />

          <Text style={styles.section}>
            Recent Payments
          </Text>
        </>
      }
      renderItem={({ item }) => (
        <View style={styles.paymentCard}>
          <Text style={styles.amount}>
            ₹{item.teacherAmount}
          </Text>

          <Text style={styles.course}>
            Course: {item.courseId}
          </Text>

          <Text style={styles.student}>
            Student: {item.studentId}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.empty}>
          No payments received yet.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 16,
  },

  header: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  section: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  paymentCard: {
    backgroundColor: "#1F2937",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  amount: {
    color: "#10B981",
    fontSize: 22,
    fontWeight: "bold",
  },

  course: {
    color: "#FFFFFF",
    marginTop: 8,
    fontSize: 15,
  },

  student: {
    color: "#9CA3AF",
    marginTop: 4,
    fontSize: 14,
  },

  empty: {
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});