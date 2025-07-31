import React, {
  createContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import { listEmails, getEmail } from '../api/api';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const account = 'peter';
  const [emails, setEmails]             = useState([]);
  const [isLoading, setLoading]         = useState(false);
  const [error, setError]               = useState(null);
  const [authRequired, setAuthRequired] = useState(false);

  // 1) make fetchEmails stable
  const fetchEmails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // this will throw or reject if Interactor says “no tokens”
      const listRes = await listEmails('gmail', account);
      const ids = (listRes.messages || []).slice(0, 10).map(m => m.id);
      const full = await Promise.all(
        ids.map(id => getEmail('gmail', account, id))
      );
      setEmails(full);
    } catch (err) {
      // map either our thrown err.authRequired **or** a 401 from the server
      if (err.authRequired || err.response?.data?.authRequired) {
        setEmails([]);
        setAuthRequired(true);
      } else {
        setEmails([]);
        setError(err.message || 'Unknown error');
      }
    } finally {
      setLoading(false);
    }
  }, [account]);

  // 2) run it immediately on mount
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const handleAuthSuccess = () => {
    // user just completed OAUTH
    setAuthRequired(false);
    fetchEmails();
  };

  return (
    <AppContext.Provider value={{
      account,
      emails,
      isLoading,
      error,
      authRequired,
      fetchEmails,
      handleAuthSuccess
    }}>
      {children}
    </AppContext.Provider>
  );
}