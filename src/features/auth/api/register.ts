import { api } from '@/lib/api-client';
import { RegisterUser } from '@/types/auth';

export async function register(payload: RegisterUser) {
  try {
    const response = await api.post('/auth/register', payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}
