**`00_BACKEND_README.md`**

```markdown
# Backend API Reference

This Express service proxies your frontend to the Interactor.com Gmail connector.

## Endpoints

### GET `/connector/:service/auth-url?account=<account>`

- **service**: `gmail`  
- **Query**: `account` (string)  
- **Response**:  
  ```json
  { "authUrl": "<OAuth URL>" }

	•	Error: HTTP 502 { error: 'Failed to fetch auth URL.' }

⸻

POST /connector/gmail/email.list?account=<account>
	•	Query: account (string)
	•	Body (optional):

{ "q": "is:starred\nafter:today" }


	•	Response:

{
  "messages": [
    { "id": "...", "threadId": "..." },
    …
  ],
  "nextPageToken?": "..."
}


	•	Errors:
	•	401 { "authRequired": true } when no tokens
	•	502 { error: "Failed to email.list from gmail." } on other failures

⸻

POST /connector/gmail/email.get?account=<account>
	•	Query: account (string)
	•	Body:

{ "message_id": "<message-id>" }


	•	Response: Full Gmail message payload with fields like:

{
  "id": "...",
  "threadId": "...",
  "labelIds": [...],
  "snippet": "...",
  "payload": { … },
  // etc.
}


	•	Errors: same as above (401 for auth, 502 otherwise)

---
