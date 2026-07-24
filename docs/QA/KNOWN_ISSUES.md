# ⚠️ KnowledgeVerse Accepted Known Issues

This register contains non-critical, low-impact anomalies that are accepted for the current release window and do not compromise security or data integrity.

---

## 📋 ACTIVE TECHNICAL DEBT LOG

### 1. KI-001: Background Latency During Offline Network Reconnection Shifts
*   **Impact Module:** Network Caching / Progress Synchronization Sync Layer
*   **Priority Level:** 🟡 Medium
*   **Description:** Reconnecting after a long offline session causes a brief 800ms UI frame drop while resolving pending Firestore transaction logs.
*   **Mitigation Workaround:** The UI presents a "Syncing changes..." indicator box to block user touch inputs until data loops close safely.

### 2. KI-002: Layout Compression on 4-Inch Display Devices
*   **Impact Module:** UI / UX Responsive Viewport Layout
*   **Priority Level:** <span>🟢</span> Low
*   **Description:** Extremely narrow screens (e.g., iPhone SE v1 layout grids) show tight text grouping inside the advanced analytics sub-charts legend area.
*   **Mitigation Workaround:** Handled via horizontal scrolling wrappers inside the specific legend container element styles.
