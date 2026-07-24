import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

interface LifecycleCallbacks {
  onForeground: () => void;
  onBackground: () => void;
}

/**
 * Controls clean hardware backgrounding transitions to eliminate memory leaks [INDEX].
 */
export function useAppLifecycle({ onForeground, onBackground }: LifecycleCallbacks) {
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const handleStateMutationChange = (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("📱 Application transitioned successfully to the active foreground.");
        onForeground();
      } else if (nextAppState.match(/inactive|background/)) {
        console.log("⏳ Application minimized to internal background task layers.");
        onBackground();
      }

      appStateRef.current = nextAppState;
    };

    // ✅ Step 1 FIXED: Explicitly register app state runtime event subscriptions
    const subscription = AppState.addEventListener("change", handleStateMutationChange);

    return () => {
      // ✅ Step 1 FIXED: Unsubscribe to guarantee absolute cleanup and zero loose memory flags
      subscription.remove();
    };
  }, [onForeground, onBackground]);
}
