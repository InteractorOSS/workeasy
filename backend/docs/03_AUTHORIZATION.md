# Authorization

## Interactor.com Credentials
- **Static User ID** (`INTERACTOR_USER_ID`) is passed as a query param  
- Proxy does **not** handle OAuth directly

## Token Lifecycle
- Managed by Interactor.com  
- Backend trusts Interactor.com for authentication & rate limits

## Role-Based Access
- Prototype scope: **no** RBAC  
- Future: consider JWT + scopes for read/write separation