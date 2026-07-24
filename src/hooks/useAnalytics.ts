import { useState, useEffect, useCallback } from "react";
import { getOverview } from "@/lib/analyticsService";
import { AnalyticsSummary } from "@/types/analytics";

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const syncTelemetryData = useCallback(async () => {
    try {
      setLoading(true);
      const analyticsOverview = await getOverview();
      setData(analyticsOverview);
    } catch (e) {
      console.log("Error inside administrative analytics sync driver hook:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncTelemetryData();
  }, [syncTelemetryData]);

  return {
    data,
    loading,
    refresh: syncTelemetryData
  };
}
