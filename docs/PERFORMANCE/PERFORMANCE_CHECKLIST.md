# 📋 KnowledgeVerse Performance Optimization Quality Checklist

This register defines the validation metrics that components and services must meet to ensure lightweight operations before deployment.

---

## ⚙️ 1. REACT COMPONENT INTEGRITY CHECKS
- [ ] **Memoization Validation:** Wrap static cards (`CourseCard`, `LessonCard`, `MessageBubble`) in `React.memo` to block unnecessary rendering cascades.
- [ ] **Stable Key Extractors:** Verify that all `FlatList` nodes implement distinct, un-changing identification keys (`item.id`). Using loop index values is strictly forbidden.
- [ ] **Window Layout Constraints:** Confirm heavy lists define optimized virtualization configurations (`initialNumToRender={10}`, `maxToRenderPerBatch={5}`, `windowSize={3}`).

---

## 🗄️ 2. CLOUD DATABASE & NETWORK METRICS
- [ ] **Collection Read Caps:** Enforce strict item count limits (`limit(20)`) on all exploration queries.
- [ ] **Stream Cleanup Check:** Verify that every real-time listener subscription returns a clean `unsubscribe()` cleanup function inside its resource block.
- [ ] **Media Compression Check:** Verify image and thumbnail uploads use WebP formatting options to stay comfortably below 250KB.

---

## 🛠️ TECHNICAL VERIFICATION RUN DETAILS
*   **Target Assessment Scope:** Client Workspace Render Integrity
*   **Status Checklist Evaluation:** 100% Comprehensive Mapping
*   **Next Milestone:** Code Refactoring Phase Activation
