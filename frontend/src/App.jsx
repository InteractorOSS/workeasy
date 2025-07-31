import React, { useContext, useEffect } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import AuthButton from './components/AuthButton';
import EmailList  from './components/EmailList';

function InnerApp() {
  const {
    account,
    emails,
    isLoading,
    error,
    authRequired,
    fetchEmails,
    handleAuthSuccess,
    disconnectGmail
  } = useContext(AppContext);

  // kick off initial load
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  if (authRequired) {
    return (
      <AuthButton
        service="gmail"
        account={account}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  if (isLoading) {
    return <p>Loading emails…</p>;
  }

  if (error) {
    return (
      <div>
        <p>Error loading emails: {error}</p>
        <button onClick={fetchEmails}>Retry</button>
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <button onClick={fetchEmails}>
        Fetch Emails
      </button>
    );
  }

  return (
    <div>
      <EmailList />
      <button
        style={{ marginTop: '1rem' }}
        onClick={disconnectGmail}
      >
        Disconnect Gmail
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  );
}