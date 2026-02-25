import { api } from '@/lib/api-client';

export interface ChangePasswordPayload {
  password: string;
  password_confirmation: string;
  old_password: string;
}

export async function changePassword(payload: ChangePasswordPayload) {
  try {
    const response = await api.post('/auth/change_password', payload, {
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
