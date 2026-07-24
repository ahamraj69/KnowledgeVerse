# 🔬 KnowledgeVerse Functional Test Cases

This document details the precise, step-by-step validation scripts required to verify data flow, boundary limits, and system stability across all runtime environments [INDEX].

---

## 🔐 1. AUTHENTICATION & SESSION PERSISTENCE (AUTH)

### TC-AUTH-001: Standard Email & Password Authentication Login Flow
*   **Module:** Authentication
*   **Feature:** User Sign-In
*   **Preconditions:** User profile must already exist inside the `/users` collection with matching encryption strings. Device network state: Online.
*   **Steps to Execute:**
    1. Launch the application and navigate directly to the `/login` screen.
    2. Input a valid, registered email address string into the designated field.
    3. Input the matching secure password string.
    4. Tap the primary action button labeled "Login".
*   **Expected Behavioral Result:** The client resolves the token session via Firebase Auth, hydrates local state, and smoothly pushes the viewport straight to the `/feed` workspace screen.
*   **Status Indicators:** `[ Pass | Fail | Blocked ]`

### TC-AUTH-002: Session Persistence Validation on Cold Boot
*   **Module:** Authentication
*   **Feature:** Token Persistence
*   **Preconditions:** A user session was authenticated during a previous execution loop.
*   **Steps to Execute:**
    1. Terminate the application process completely from the device task switcher.
    2. Turn off the screen, wait 5 seconds, then turn it on and cold-launch the application.
    3. Observe the loading state and initial screen routing intercept.
*   **Expected Behavioral Result:** The client reads the valid persistent credential cache, bypasses onboarding/login scripts, and lands immediately on the active `/feed` screen within 1200ms.
*   **Status Indicators:** `[ Pass | Fail | Blocked ]`

---

## 🤖 2. COGNITIVE SUBSYSTEMS ARRAYS (AI)

### TC-AI-001: Context-Aware Multi-Turn AI Conversation Loop
*   **Module:** AI Tutor (AI Tutor 2.0)
*   **Feature:** Conversation Memory Persistence
*   **Preconditions:** Active student session token.
*   **Steps to Execute:**
    1. Open the `/ai` console and initialize a new thread by tapping "New Chat".
    2. Submit prompt string 1: "I am building a React Native application."
    3. Wait for the response payload to settle.
    4. Submit prompt string 2: "What programming language am I using for this?"
*   **Expected Behavioral Result:** The AI response correctly reads history parameters via `chatMemory.ts` and answers "TypeScript" or "JavaScript", verifying cross-message state retention.
*   **Status Indicators:** `[ Pass | Fail | Blocked ]`

### TC-AI-002: AI PDF Multimodal Summarization Boundary Check
*   **Module:** AI PDF Analyzer
*   **Feature:** Document Processing
*   **Preconditions:** A multi-page document file ready for device file system picker selection.
*   **Steps to Execute:**
    1. Navigate to `/ai-pdf` and tap the "Upload Document" attachment card.
    2. Select a valid multi-page PDF document.
    3. Wait for parsing compilation, then submit the question: "Summarize this file."
*   **Expected Behavioral Result:** The client extracts text chunks via `pdfService.ts`, pushes payload schemas safely, and displays a clean text overview summary item.
*   **Status Indicators:** `[ Pass | Fail | Blocked ]`

---

## 👨‍🏫 3. INSTRUCTOR LIFECYCLE PATHS (TEACH)

### TC-TEACH-001: Unverified Course Creation Publishing Block
*   **Module:** Teacher Studio
*   **Feature:** Course State Mutations Guard
*   **Preconditions:** User profile is assigned `role = "teacher"` but holds a `verifiedTeacher = false` boolean attribute value.
*   **Steps to Execute:**
    1. Open the `/teacher` workspace console dashboard screen.
    2. Tap the action tile labeled "Create New Course".
*   **Expected Behavioral Result:** The system intercepts the tap, detects the missing boolean attribute value, triggers a native modal blocking message saying "Teacher verification is strictly required before publishing new courses," and disables publishing buttons.
*   **Status Indicators:** `[ Pass | Fail | Blocked ]`
