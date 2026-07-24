# 🗺️ KnowledgeVerse Master Quality Assurance Test Plan

This document governs the absolute release-readiness verification protocol for KnowledgeVerse across core clients, artificial intelligence cognitive subsystems, and administration cloud service directors.

---

## 🏛️ 1. ARCHITECTURAL TESTING SCOPE

### 🔐 Multi-Role Authentication Matrix
*   **TC-AUTH-01 (Account Creation):** Verify that submitting a unique email and valid password writes a baseline standard user object down to the `/users/{uid}` dataset shard with a fallback role of `student`.
*   **TC-AUTH-02 (Session Persistence):** Confirm that cold-starting the Expo application on real target devices successfully parses existing local credentials tokens, bypasses the onboarding screen, and lands on the `/feed` scene via native hooks.
*   **TC-AUTH-03 (Role Isolation Firewall):** Enforce that a session token lacking an explicit `admin` or `teacher` flag inside its user document is caught by the `ProtectedRoute` wrapper component and routed away from executive management routes.

### 📚 Curriculum Lifecycle Pipeline (Phase 49 & Part 4)
*   **TC-CURR-01 (Draft Immutability):** Verify that an instructor's course profile initializes with a `draft` status tag and is invisible inside standard student search feeds.
*   **TC-CURR-02 (Validation Interceptor):** Check that attempting to dispatch a course review without at least 1 compiled lesson sub-collection entity fails with a native warning block.
*   **TC-CURR-03 (Automated Sync Activation):** Confirm that an admin pressing the "Approve & Publish" button switches the target course object's parameters to `status = "approved"` and `published = true`, rendering it instantly visible inside search filters.

### 🤖 Cognitive AI Subsystem Health Matrix (AI Tutor 2.0)
*   **TC-AI-01 (Multi-Turn Context Persistence):** Send 3 sequential, context-dependent messages to the AI Tutor. Verify that the response payload successfully resolves cross-message properties from `chatMemory.ts`.
*   **TC-AI-02 (Polymorphic Media Ingestion):** Upload a mock PDF document inside the `ai-pdf` track. Enforce that parsing triggers a clean textual summary payload without dropping runtime context frames.
*   **TC-AI-03 (Voice AI Processing Latency):** Trigger a microphone audio byte-stream buffer block. Verify that speech recognition, model query execution, and text-to-speech rendering map safely underneath a 1500ms operational window.

---

## 🌐 2. ADAPTIVE NETWORK FAULT SIMULATION

[ Active Session Connection ]│(Network Cable Drop)▼[ OfflineBanner Activated ] ──► (Local Caches Switched On)│(Socket Handshake Restored)▼[ Real-Time Re-sync Committed ]
### 📶 Offline Resilience Protocols
*   **TC-NET-01 (Connection Loss Interception):** While actively monitoring a course page, drop the network interface link. Verify that the user interface mounts the `OfflineBanner` layout element instantly within 500ms without freezing the runtime context layer.
*   **TC-NET-02 (Offline Media Playback):** Enforce that previously downloaded lesson video files run directly out of internal sandbox cache parameters when offline.

---

## 📊 3. RISK DEFECT CLASSIFICATION SCHEME

| Index | Severity Level | Operational Impact Definition | Target Release Gate Rule |
| :--- | :--- | :--- | :--- |
| **P1** | **Blocker / Critical** | Total service disruption, data leak risk, broken auth workflows, or type compiler breaks. | Zero occurrences permitted. |
| **P2** | **Major Defect** | Key feature malfunctioning (e.g., AI quiz generation fails), but basic paths remain up. | Max 2 allowed with workaround. |
| **P3** | **Minor / Trivial** | Styling alignment issues, slow component lazy loading, or layout label typos. | Max 5 allowed before submission. |