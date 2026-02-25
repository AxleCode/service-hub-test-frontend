/**
 * Custom hook to retrieve stored encrypted credentials
 * Usage: const { credentials, loading, error } = useStoredCredentials();
 */

import { useEffect, useState } from 'react';
import { getEncryptedCredentials } from '@/lib/secure-storage';

interface StoredCredentials {
  username: string;
  password: string;
}

export function useStoredCredentials() {
  const [credentials, setCredentials] = useState<StoredCredentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const stored = await getEncryptedCredentials();
        setCredentials(stored);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to retrieve credentials');
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

  return { credentials, loading, error };
}

