import { api } from '@/lib/api-client';

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
  password_confirmation: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  try {
    const response = await api.post('/auth/forgot_password_request', payload, {
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

export async function resetPassword(token: string, payload: ResetPasswordPayload) {
  try {
    const response = await api.post(`/auth/forgot_password_submit/${token}`, payload, {
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
