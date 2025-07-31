03_GUIDELINES.md

# Coding & UX Guidelines

1. **Stable Callbacks**  
   - Wrap side-effect functions (`fetchEmails`) in `useCallback`  
   - List them in `useEffect` dependencies to satisfy `react-hooks/exhaustive-deps`

2. **Error Handling**  
   - Distinguish authentication errors (`err.authRequired`) from other network/parsing errors  
   - Surface clear UI states: Connect → Loading → Error(+Retry) → Data

3. **Multi-line Gmail Queries**  
   - Use ES6 template literals for `q` filters:
     ```js
     const query = `is:starred
     in:inbox
     after:today`;
     ```
   - Or `['is:starred','in:inbox','after:today'].join('\\n')`

4. **UI Table Layout**  
   - Inbox rendered as `<table>` with columns:  
     - **Subject**  
     - **From**  
     - **Labels** (comma-separated)  
     - **Snippet** (first 100 chars + ellipsis)

5. **Authentication UX**  
   - On “no tokens,” render only **Connect Gmail**  
   - After OAuth success, re-invoke `fetchEmails` automatically  


⸻