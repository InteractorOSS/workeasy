**`01_API_REFERENCE.md`**

```markdown
# Frontend API Module

All calls go to your Express backend at `REACT_APP_API_BASE_URL` (default `http://localhost:4000`).

```js
import { listEmails, getEmail, getAuthUrl } from './api';

listEmails(service, account, query)
	•	service: 'gmail'
	•	account: prototype constant, e.g. 'john'
	•	query (optional): Gmail filter string with newlines, e.g.

is:starred
in:inbox
after:today


	•	Returns: Promise resolving to { messages: [{id,threadId},…], nextPageToken? }
	•	Throws: Error with err.authRequired = true if authentication is needed

⸻

getEmail(service, account, message_id)
	•	message_id: one of the IDs returned by listEmails
	•	Returns: Promise resolving to the full message object

⸻

getAuthUrl(service, account)
	•	service: 'gmail'
	•	account: same prototype constant
	•	Returns: Promise resolving to the OAuth URL string

---