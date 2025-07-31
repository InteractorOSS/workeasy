**File: `docs/frontend/02_DATA_SCHEMA.md`**
```markdown
# Data Schema

## API Response Shape
**`GET /emails`** → `200 OK`
```json
{
  "emails": [
    {
      "id": "string",
      "subject": "string",
      "from": "string",
      "date": "ISO8601 timestamp",
      "snippet": "string",
      "source": "gmail" | "outlook"
    },
    …
  ]
}

Client-Side Models (TypeScript)

export interface Email {
  id: string;
  subject: string;
  from: string;
  date: string;       // ISO string
  snippet: string;
  source: 'gmail' | 'outlook';
}

Summarization Payload
	•	Input: snippet (string)
	•	Output: single-sentence summary (string)