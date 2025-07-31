# Product Requirements Document

## 1. Overview

**Project Name:** Gmail Today Inbox Prototype  
**Date:** July 2025  
**Version:** 1.1  

This prototype enables users to connect their Gmail account via OAuth, fetch the today's messages received today onward, and display them in a simple, responsive table.  

## 2. Purpose & Scope

- **Purpose:**  
  Validate the core end-to-end flow of authenticating with Gmail, applying a Gmail search filter (`after:today`), and rendering a minimal table UI.

- **Scope:**  
  - Gmail only (no Outlook integration in this prototype)  
  - “today” timeframe  
  - Last 10 messages only  
  - Authentication via popup and Interactor.com proxy  
  - Error handling and retry  

## 3. Stakeholders

- **Product Owner:** Peter  
- **Engineering Lead:** Peter  
- **UX Designer:** Peter  
- **QA:** Peter  

## 4. Functional Requirements

| ID   | Requirement                                                                                               |
|------|-----------------------------------------------------------------------------------------------------------|
| FR1  | **Connect Gmail**  
        - User sees a **Connect Gmail** button if no OAuth tokens are present.  
        - Clicking opens a centered OAuth popup.  
        - On success, proxy returns tokens and UI re-fetches emails. |
| FR2  | **Email Listing**  
        - On mount (and after auth), app calls `listEmails('gmail', 'john', query)` where `query` =  
          ```  
          is:starred  
          in:inbox  
          after:today  
          ```  
        - Proxy endpoint:  
          `POST /connector/gmail/email.list?account=john` with body `{ q: query }`. |
| FR3  | **Fetch Full Messages**  
        - Extract first 10 message IDs from `list` response.  
        - In parallel, call `POST /connector/gmail/email.get?account=john` with `{ message_id }`.  
        - Store resulting array as `emails` in React Context. |
| FR4  | **Table UI**  
        - Displays columns:  
          - **Subject**  
          - **From** (email address or display name)  
          - **Labels** (comma-separated array from `labelIds`)  
          - **Snippet** (first 100 chars of snippet/body + `…`)  
        - Renders as responsive HTML `<table>`. |
| FR5  | **Loading & Error States**  
        - **Loading**: show “Loading…” text/spinner.  
        - **Error** (network or parsing): show error message + **Retry** button.  
        - **Auth error** (“Account has no tokens”): show **Connect Gmail** button. |
| FR6  | **Re-Fetch on Auth**  
        - After successful OAuth popup, automatically re-run the fetch flow. |

## 5. User Flow

1. **Page Load**  
   - AppContext auto-runs `fetchEmails()`.  
   - If Interactor responds with auth-required → UI shows **Connect Gmail**.  
2. **Authenticate**  
   - User clicks **Connect Gmail** → OAuth popup → Interactor → redirect back.  
   - On popup close, `handleAuthSuccess()` clears `authRequired` and calls `fetchEmails()`.  
3. **Display Inbox**  
   - If fetch succeeds: display `<EmailList>` table with up to 10 rows.  
4. **Retry & Errors**  
   - On any non-auth error: show error message and **Retry** button, which re-invokes `fetchEmails()`.  

## 6. Non-Functional Requirements

- **Performance:**  
  - Total fetch + render under 2 seconds with 10 parallel calls.  
- **Security:**  
  - API keys and endpoints stored in server-side `.env`.  
  - HTTP-only CORS restricted to `http://localhost:3000`.  
- **Maintainability:**  
  - All side-effect hooks wrapped in `useCallback` + proper dependency arrays.  
  - Centralized Axios instance for interceptors.  

## 7. Technical Constraints

- **Tech Stack:** React 18 (hooks), Express.js, Axios  
- **OAuth Flow:** Popup-based, via Interactor.com connector  
- **Hosting:** Local prototype on macOS (Node v16+)  

## 8. Future Enhancements

- Support Outlook and additional connectors  
- Pagination or infinite scroll for more than 10 messages  
- In-app email detail view with HTML body and attachments  
- Sorting and filtering controls in the UI  
- Production-grade deployment (Docker, CI/CD)  

---

**End of PRD**  