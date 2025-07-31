**`01_ARCHITECTURE.md`**

```markdown
# System Architecture

## Frontend (React)

- **Context** (`AppContext.jsx`):  
  - Holds state:  
    - `account` (string)  
    - `emails` (array)  
    - `isLoading` (bool)  
    - `error` (string|null)  
    - `authRequired` (bool)  
  - Exposes:  
    - `fetchEmails()`: memoized via `useCallback`  
    - `handleAuthSuccess()`: clears auth flag + re-fetch  
  - Auto-runs `fetchEmails` on mount via `useEffect([fetchEmails])`

- **Components**:  
  1. **`InnerApp`**: decides whether to show  
     - **Connect Gmail** (when `authRequired`)  
     - **Loading** spinner  
     - **Error + Retry**  
     - **EmailList**  
  2. **`AuthButton`**: opens OAuth popup and calls `onSuccess`  
  3. **`EmailList`**: renders `<table>` of messages

---

## Backend (Express)

- Single `server.js` with:  
  - CORS & JSON body parsing  
  - **GET** `/connector/:service/auth-url`  
  - **POST** `/connector/gmail/email.list` & `/email.get`  
  - Shared proxy logic that:  
    - Forwards to Interactor.com with `x-api-key`  
    - Maps `"Account has no tokens"` → `401 { authRequired: true }`


⸻