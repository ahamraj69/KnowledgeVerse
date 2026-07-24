# 🔐 Platform Role Permission Separation Matrix

| Interface Path Route | Student Sessions | Instructor Sessions | Administrator Sessions | Server-Side Firestore Rule Safeguard |
| :--- | :---: | :---: | :---: | :--- |
| `/feed`, `/explore` | ✅ Read | ✅ Read | ✅ Read | `allow read: if isAuthenticated();` |
| `/profile/edit` | ✅ Own Only | ✅ Own Only | ✅ Own Only | `allow write: if request.auth.uid == userId;` |
| `/teacher-verification` | 🆕 Create | 🔒 Blocked | 👁️ Audit Read | `allow update: if isAdmin();` |
| `/teacher/*` (Studio Workspace) | ❌ Denied | ✅ Write (If Verified) | 👁️ Audit Read | `get(/.../users/$(request.auth.uid)).data.role == "teacher"` |
| `/admin/*` (Moderation Control) | ❌ Denied | ❌ Denied | ✅ Full Root Access | `allow read, write: if isAdmin();` |

### 🚨 Operational Breach Interception Verification Cases
*   **TC-SEC-001 (Cross-Tenant Modification):** Try to push an update packet directly to a course document belonging to another teacher. The update must fail on the server side with a standard `FirebaseError: Missing or insufficient permissions` exception block.
*   **TC-SEC-002 (Anonymous Write Infiltration):** Clear all active device session tokens and try to create a report log. The database firewall must reject the document write attempt, ensuring anonymous users cannot submit data.
