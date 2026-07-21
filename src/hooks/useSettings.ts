import { useState, useEffect, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { getSettings, updateSettings, resetSettings } from "@/lib/user/settingsService";
import { UserSettings } from "@/types/settings";

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSettingsData = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await getSettings(user.uid);
      setSettings(data);
    } catch (e) {
      console.log("Error loading layout configurations preferences:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettingsField = useCallback(async (updates: Partial<UserSettings>) => {
    const user = auth.currentUser;
    if (!user || !settings) return;
    try {
      const merged = { ...settings, ...updates };
      setSettings(merged);
      await updateSettings(user.uid, updates);
    } catch (e) {
      console.log("Error writing configuration settings update:", e);
    }
  }, [settings]);

  const resetToDefault = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;
    await resetSettings(user.uid);
    await loadSettingsData();
  }, [loadSettingsData]);

  useEffect(() => {
    loadSettingsData();
  }, [loadSettingsData]);

  return {
    settings,
    loading,
    save: saveSettingsField,
    reset: resetToDefault,
    refresh: loadSettingsData
  };
}
