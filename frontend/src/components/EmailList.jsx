import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import AuthButton from './AuthButton';

export default function EmailList() {
  const { emails, loading, error, retry, authRequired, account } = useContext(AppContext);

  if (authRequired) {
    return <AuthButton service="gmail" account={account} onSuccess={retry} />;
  }

  if (loading) {
    return <p>Loading emails…</p>;
  }

  if (error) {
    return (
      <div>
        <p>Error loading emails: {error.message || 'Unknown error'}</p>
        <button onClick={retry}>Retry</button>
      </div>
    );
  }

  if (emails.length === 0) {
    return <p>No emails found.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Subject</th>
          <th>From</th>
          <th>Label</th>
          <th>Snippet</th>
        </tr>
      </thead>
      <tbody>
        {emails.map(email => (
          <tr key={email.id || email.message_id}>
            <td>{email.subject}</td>
            <td>{email.from?.name || email.from?.address || email.from}</td>
            <td>{(email.labelIds || []).join(', ')}</td>
            <td>{email.snippet || (email.body?.substring(0, 100) + '…')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}