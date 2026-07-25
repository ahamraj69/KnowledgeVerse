# 🗺️ KnowledgeVerse Production Performance & Optimization Plan

This strategy document establishes the core engineering constraints, threshold rules, and architectural guidelines required to bring KnowledgeVerse's interface render cycles down to a fluid 60 Frames Per Second (FPS).

---

## 🏛️ 1. CORE PERFORMANCE OPTIMIZATION OBJECTIVES

### ⚛️ Component Rendering Optimization Rules
*   **Zero-Inline References (ZIR):** Ban the decoration of inline arrow functions and inline object allocations within JSX element tags. These parameters create reference inequalities that bypass `React.memo` gates.
*   **Virtualised Node Recycling:** Force all lists rendering more than 10 array items to implement `FlatList` structures with aggressive window sizing constraints to ensure off-screen views are aggressively unmounted.
*   **Strict Render Budgets:** Keep individual component processing loops under 8ms per cycle to ensure the main thread can render frames smoothly without dropping below the 16.6ms frame budget.

### 🔥 Database Query Optimization Rules
*   **Cursor-Driven Pagination:** Limit initial queries across `/courses`, `/reports`, and `/users` collections to a size of exactly 20 items. Fetch additional records only when users scroll past the pagination threshold.
*   **Data Serialization Cache Layers:** Use a standardized client-side caching wrapper to save master system settings and static profiles on disk, cutting out repetitive, expensive read operations on the server.

---

## 🧭 2. PROFILING TARGET DOMAINS & EXTRAS

[ Active Component Render ]│(Ref Inequality Detected)▼[ Forced Re-render Cascades ] ──► (Drops FPS / Main Thread Lag)│(Memoized Selectors Applied)▼[ Stable Cached Node Return ]
### 🧠 High-Load Area Strategies
*   **AI Tutor Session Control:** Keep active conversation arrays under a maximum of 30 nodes. Archive older items into historical logs to protect the list layout from sluggish scroll performance.
*   **Analytics Calculation Optimization:** Wrap heavy analytical aggregations and sorting arrays inside `useMemo` blocks to prevent heavy data sorting routines from running on every single render pass.