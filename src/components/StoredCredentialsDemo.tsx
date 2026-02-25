/**
 * Demo Component - Stored Credentials Viewer
 * 
 * This is a DEMO component to show stored credentials info.
 * DO NOT use this in production as it exposes sensitive information!
 * This is only for development/testing purposes.
 */

"use client";

import { useState } from 'react';
import { 
  getEncryptedCredentials, 
  hasStoredCredentials,
  clearEncryptedCredentials 
} from '@/lib/secure-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function StoredCredentialsDemo() {
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const [hasStored, setHasStored] = useState(hasStoredCredentials());
  const [loading, setLoading] = useState(false);

  const handleViewCredentials = async () => {
    setLoading(true);
    try {
      const creds = await getEncryptedCredentials();
      setCredentials(creds);
    } catch (error) {
      console.error('Failed to decrypt credentials:', error);
      alert('Failed to decrypt credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCredentials = () => {
    clearEncryptedCredentials();
    setCredentials(null);
    setHasStored(false);
    alert('Credentials cleared!');
  };

  const handleCheckStorage = () => {
    setHasStored(hasStoredCredentials());
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>⚠️ Stored Credentials Demo</CardTitle>
        <CardDescription>
          This demo shows encrypted credential storage. 
          <strong className="text-red-500"> DO NOT use in production!</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Storage Status:</span>
          {hasStored ? (
            <Badge variant="default" className="bg-green-500">
              Credentials Stored ✓
            </Badge>
          ) : (
            <Badge variant="secondary">
              No Credentials Stored
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleCheckStorage}
            variant="outline"
            size="sm"
          >
            Check Storage
          </Button>
          
          <Button 
            onClick={handleViewCredentials}
            disabled={!hasStored || loading}
            variant="default"
            size="sm"
          >
            {loading ? 'Decrypting...' : 'View Credentials'}
          </Button>
          
          <Button 
            onClick={handleClearCredentials}
            disabled={!hasStored}
            variant="destructive"
            size="sm"
          >
            Clear Credentials
          </Button>
        </div>

        {credentials && (
          <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
            <h3 className="font-semibold text-sm">Decrypted Credentials:</h3>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Username:</span>{' '}
                <code className="bg-background px-2 py-1 rounded">
                  {credentials.username}
                </code>
              </div>
              <div>
                <span className="font-medium">Password:</span>{' '}
                <code className="bg-background px-2 py-1 rounded">
                  {credentials.password}
                </code>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">💡 How to Check Encryption:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Open Browser DevTools (F12)</li>
            <li>Go to Application → Local Storage</li>
            <li>Look for <code className="bg-white dark:bg-gray-800 px-1 rounded">secure_credentials</code></li>
            <li>The value should look like encrypted gibberish</li>
          </ol>
        </div>

        <div className="mt-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>⚠️ Security Warning:</strong> This component is for demonstration only. 
            Never expose credentials in production applications!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default StoredCredentialsDemo;

