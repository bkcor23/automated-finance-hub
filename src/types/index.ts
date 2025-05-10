
import { ReactNode } from 'react';
import { User } from '@supabase/supabase-js';

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Connection = {
  id: string;
  user_id: string;
  name: string;
  provider: string;
  status: 'active' | 'inactive' | 'error';
  logo?: string;
  api_key?: string;
  last_sync?: string;
  error_message?: string;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  connection_id?: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'completed' | 'pending' | 'failed';
  source?: string;
  source_icon?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type Automation = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  type: 'schedule' | 'condition' | 'webhook';
  status: 'active' | 'paused' | 'draft';
  trigger: {
    description: string;
    icon?: ReactNode;
    [key: string]: any;
  };
  action: {
    description: string;
    icon?: ReactNode;
    [key: string]: any;
  };
  last_execution?: string;
  next_execution?: string;
  executions: number;
  created_at: string;
  updated_at: string;
};

export type UserSettings = {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  language: 'es' | 'en';
  notifications: boolean;
  email_notifications: boolean;
  dashboard_widgets: any[];
  created_at: string;
  updated_at: string;
};

export type SecurityLog = {
  id: string;
  user_id: string;
  event_type: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
};

export type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  settings: UserSettings | null;
  isLoading: boolean;
  error: Error | null;
};

export type AuthContextType = {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
};

export type ChildrenProps = {
  children: ReactNode;
};
