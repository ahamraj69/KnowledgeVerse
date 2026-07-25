# 📅 KnowledgeVerse Systems Data Retention Policy

This document defines the retention windows for data metrics inside KnowledgeVerse collections.

## 📊 RETENTION TIME TIERS
*   **Active Progress Analytics:** Saved indefinitely inside the database until an account deletion workflow is triggered by the user.
*   **Administrative Security Logs:** Stored for a rolling 12-month period inside write-only containers for compliance auditing, then permanently scrubbed.
*   **Purged Account Data:** Instantly and permanently deleted upon confirmation of the account data purge request.
