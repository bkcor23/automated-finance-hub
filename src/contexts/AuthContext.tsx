
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthState, UserProfile, UserRole, UserSettings, ChildrenProps } from '@/types';

const initialState: AuthState = {
  user: null,
  profile: null,
  roles: [],
  settings: null,
  isLoading: true,
  error: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: ChildrenProps) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const navigate = useNavigate();
  const location = useLocation();

  // Actualiza el estado de usuario y carga los datos asociados
  const updateUserState = async (session: Session | null) => {
    try {
      if (!session) {
        setAuthState({
          ...initialState,
          isLoading: false
        });
        return;
      }

      const user = session.user;
      
      // Cargar perfil
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') throw profileError;

      // Cargar roles de usuario
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (rolesError) throw rolesError;

      // Cargar configuración
      const { data: settingsData, error: settingsError } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
      
      // Ensure the theme and language are properly typed for UserSettings
      const settings: UserSettings = {
        ...(settingsData || {}),
        id: settingsData?.id || '',
        user_id: settingsData?.user_id || user.id,
        theme: (settingsData?.theme as 'light' | 'dark') || 'light',
        language: (settingsData?.language as 'es' | 'en') || 'es',
        notifications: settingsData?.notifications !== undefined ? !!settingsData?.notifications : true,
        email_notifications: settingsData?.email_notifications !== undefined ? !!settingsData?.email_notifications : true,
        // Asegurar que dashboard_widgets sea siempre un array
        dashboard_widgets: Array.isArray(settingsData?.dashboard_widgets) 
          ? settingsData?.dashboard_widgets 
          : [],
        created_at: settingsData?.created_at || new Date().toISOString(),
        updated_at: settingsData?.updated_at || new Date().toISOString()
      };

      // Si no hay perfil o configuración, crearlos
      if (!profile) {
        const { data: newProfile, error: newProfileError } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || '',
          })
          .select()
          .single();

        if (newProfileError) throw newProfileError;

        // Si se creó un perfil nuevo, actualizarlo
        if (newProfile) {
          const { error: logError } = await supabase.functions.invoke('log-security-event', {
            body: {
              event_type: 'profile_created',
              description: 'Perfil creado automáticamente',
              ip_address: 'client-side',
              user_agent: navigator.userAgent
            }
          });

          if (logError) console.error("Error al registrar evento:", logError);
        }
      }

      if (!settingsData) {
        const { data: newSettings, error: newSettingsError } = await supabase
          .from('settings')
          .insert({
            user_id: user.id,
            theme: 'light',
            language: 'es',
            notifications: true,
            email_notifications: true,
            dashboard_widgets: []
          })
          .select()
          .single();

        if (newSettingsError) throw newSettingsError;
      }

      // Registrar login exitoso
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: 'login_success',
          description: 'Inicio de sesión exitoso',
          ip_address: 'client-side',
          user_agent: navigator.userAgent
        }
      }).catch(err => console.error("Error al registrar login:", err));

      setAuthState({
        user,
        profile: profile || {
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        roles: rolesData || [],
        settings,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error al cargar datos de usuario:', error);
      setAuthState({
        ...authState,
        isLoading: false,
        error: error as Error
      });
    }
  };

  // Inicializar y escuchar cambios de autenticación
  useEffect(() => {
    // Verificar sesión actual
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await updateUserState(session);
    };

    initializeAuth();

    // Configurar listener para cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await updateUserState(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Redirigir al usuario según su estado de autenticación
  useEffect(() => {
    if (authState.isLoading) return;

    const path = location.pathname;
    
    // Permitir acceso a rutas públicas incluso sin autenticación
    if (path === '/auth' || path === '/auth/login' || path === '/auth/signup') {
      if (authState.user) {
        // Si está autenticado y trata de acceder a rutas de auth, redirigir a dashboard
        navigate('/');
      }
      return;
    }

    // Para todas las demás rutas, redirigir si no está autenticado
    if (!authState.user) {
      navigate('/auth/login', { state: { from: path } });
    }
  }, [authState.isLoading, authState.user, location.pathname, navigate]);

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role: 'admin' | 'user' | 'moderator'): boolean => {
    if (!authState.user || !authState.roles) return false;
    return authState.roles.some(r => r.role === role);
  };

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      await updateUserState(data.session);
      toast.success('¡Inicio de sesión exitoso!');
      navigate('/');
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error);
      toast.error(`Error: ${error.message}`);
      setAuthState(prev => ({ ...prev, isLoading: false, error: error }));
    }
  };

  // Registrar usuario
  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || ''
          }
        }
      });

      if (error) throw error;

      toast.success('Cuenta creada correctamente. Ya puedes iniciar sesión.', {
        description: 'En un entorno real, verifica tu correo electrónico para confirmar la cuenta.'
      });
      
      navigate('/auth/login');
    } catch (error: any) {
      console.error('Error de registro:', error);
      toast.error(`Error: ${error.message}`);
      setAuthState(prev => ({ ...prev, isLoading: false, error: error }));
    }
  };

  // Cerrar sesión
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Sesión cerrada correctamente');
      navigate('/auth/login');
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  // Actualizar perfil
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!authState.user) throw new Error('No hay usuario autenticado');
      
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', authState.user.id);

      if (error) throw error;

      // Actualizar perfil en el estado
      setAuthState(prev => ({
        ...prev,
        profile: { ...prev.profile!, ...updates }
      }));

      toast.success('Perfil actualizado correctamente');
    } catch (error: any) {
      console.error('Error al actualizar el perfil:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const contextValue: AuthContextType = {
    authState,
    login,
    signup,
    logout,
    updateProfile,
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
