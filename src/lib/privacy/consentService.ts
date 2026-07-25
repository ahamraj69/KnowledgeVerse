import { useState, useEffect, useCallback } from "react";

export interface UserConsentPreferences {
  analyticsCollection: boolean;
  aiPersonalization: boolean;
  marketingNotifications: boolean;
  crashReporting: boolean;
}

const CONST_CONSENT_CACHE_KEY = "knowledgeverse_consent_prefs";

const defaultConsent: UserConsentPreferences = {
  analyticsCollection: true,
  aiPersonalization: true,
  marketingNotifications: false,
  crashReporting: true
};

/**
 * Saves and updates user privacy consent choices on the device [INDEX].
 */
export function useConsentManagement() {
  const [consent, setConsent] = useState<UserConsentPreferences>(defaultConsent);

  const updateConsentPreference = useCallback((key: keyof UserConsentPreferences, val: boolean) => {
    setConsent(prev => {
      const updated = { ...prev, [key]: val };
      console.log(`[PRIVACY CONSENT] Token mutation: ${key} set to ${val}`);
      return updated;
    });
  }, []);

  return {
    consent,
    updateConsentPreference
  };
}
