# Inbox Screen

- **Display**: HTML `<table>`  
- **Columns**:  
  1. **Subject**  
  2. **From**  
  3. **Labels** (e.g. `INBOX,STARRED`)  
  4. **Snippet** (truncate body/snippet to ~100 chars + `…`)

- **States**:  
  - **Auth required** → show **Connect Gmail** button  
  - **Loading** → show `Loading…` text  
  - **Error** → show message + **Retry** button  
  - **Empty** → show “No starred emails today.”  