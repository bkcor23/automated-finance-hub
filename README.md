
# Automated Finance Hub

Plataforma para la gestión unificada de finanzas personales a través de conexiones API, análisis de transacciones y automatizaciones.

## Características principales

- 🔐 **Autenticación completa** con registro, inicio de sesión y protección de rutas
- 👥 **Sistema de roles de usuario** (Admin, Moderador, Usuario)
- 💳 **Gestión de conexiones API** para servicios financieros (Stripe, PayPal, etc.)
- 📊 **Historial de transacciones** unificado con filtros avanzados
- ⚡ **Automatizaciones** para tareas financieras programadas o basadas en eventos
- 🔒 **Configuración de seguridad** con logs de actividad y gestión de sesiones
- 🎨 **Tema claro/oscuro** y otras preferencias de usuario
- 📱 **Diseño responsive** adaptado a todo tipo de dispositivos

## Stack tecnológico

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions)
- **Estado**: TanStack Query (React Query)
- **Formularios**: React Hook Form + Zod
- **Despliegue**: GitHub Pages

## Estructura del proyecto

```
src/
├── components/     # Componentes reutilizables
├── contexts/       # Contextos de React (Auth, etc.)
├── hooks/          # Custom hooks (API, formularios, etc.)
├── integrations/   # Integración con Supabase
├── lib/            # Utilidades y helpers
├── pages/          # Componentes de página
└── types/          # Definiciones de tipos TypeScript

supabase/
├── functions/      # Edge functions
```

## Configuración y ejecución

### Requisitos previos

- Node.js (v18+)
- npm o bun
- Cuenta en Supabase

### Instalación local

1. Clonar el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd automated-finance-hub
   ```

2. Instalar dependencias:
   ```bash
   npm install
   # o
   bun install
   ```

3. Configurar Supabase:
   - Crear proyecto en Supabase
   - Ejecutar el script SQL incluido en la sección "Configuración de la base de datos"
   - Actualizar las variables de Supabase en `src/integrations/supabase/client.ts`

4. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   # o
   bun dev
   ```

## Configuración de la base de datos

### Esquema de Supabase

Para configurar correctamente la base de datos, ejecuta el siguiente script SQL en la consola de SQL de Supabase:

```sql
-- Crear tipos de roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'moderator');

-- Tabla de roles de usuario
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- Tabla de perfiles de usuario
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de conexiones API
CREATE TABLE public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    status TEXT NOT NULL,
    logo TEXT,
    api_key TEXT,
    last_sync TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de transacciones
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    connection_id UUID REFERENCES public.connections(id) ON DELETE SET NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    source TEXT,
    source_icon TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de automatizaciones
CREATE TABLE public.automations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    trigger JSONB NOT NULL,
    action JSONB NOT NULL,
    last_execution TIMESTAMP WITH TIME ZONE,
    next_execution TIMESTAMP WITH TIME ZONE,
    executions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de configuraciones de usuario
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    theme TEXT DEFAULT 'light',
    language TEXT DEFAULT 'es',
    notifications BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    dashboard_widgets JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de logs de seguridad
CREATE TABLE public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  -- Also create default settings for new user
  INSERT INTO public.settings (user_id)
  VALUES (NEW.id);
  
  -- Log the signup event
  INSERT INTO public.security_logs (user_id, event_type, description)
  VALUES (NEW.id, 'account_created', 'Account created');
  
  RETURN NEW;
END;
$$;

-- Función para registrar eventos de seguridad
CREATE OR REPLACE FUNCTION public.log_security_event(event_type text, description text, ip_address text DEFAULT NULL, user_agent text DEFAULT NULL)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_logs (user_id, event_type, description, ip_address, user_agent)
  VALUES (auth.uid(), event_type, description, ip_address, user_agent)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Función para asignar roles a usuarios nuevos
CREATE OR REPLACE FUNCTION public.set_first_user_as_admin()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  -- Check if this is the first user
  IF (SELECT COUNT(*) FROM auth.users) = 1 THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    -- Insert regular user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Función para verificar rol de usuario (evita recursión RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Activar Row Level Security en todas las tablas
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Disparadores para actualizar automáticamente datos
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE TRIGGER on_auth_user_created_set_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.set_first_user_as_admin();

-- Políticas RLS para user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles"
  ON public.user_profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles
  USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para connections
CREATE POLICY "Users can view their own connections"
  ON public.connections
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own connections"
  ON public.connections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connections"
  ON public.connections
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para automations
CREATE POLICY "Users can view their own automations"
  ON public.automations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own automations"
  ON public.automations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automations"
  ON public.automations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para settings
CREATE POLICY "Users can view their own settings"
  ON public.settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Políticas RLS para security_logs
CREATE POLICY "Users can view their own security logs"
  ON public.security_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all security logs"
  ON public.security_logs
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
```

### Configuración de usuario administrador

El sistema está configurado para asignar automáticamente el rol de administrador al primer usuario registrado. Para crear un usuario administrador:

1. Registra un nuevo usuario a través de la interfaz de la aplicación o desde el panel de Supabase.
2. El trigger `on_auth_user_created_set_role` detectará automáticamente que es el primer usuario y le asignará el rol de administrador.
3. Para verificar o modificar roles, utiliza la sección de "Gestión de Usuarios" disponible para administradores.

## Despliegue en GitHub Pages

### Opción 1: Manual

1. Construir el proyecto:
   ```bash
   npm run build
   ```

2. Crear rama `gh-pages`:
   ```bash
   git checkout -b gh-pages
   ```

3. Copiar contenido de la carpeta `dist` a la raíz:
   ```bash
   cp -R dist/* .
   ```

4. Confirmar y subir cambios:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

5. Configurar la rama `gh-pages` como fuente en la configuración del repositorio de GitHub

### Opción 2: GitHub Actions

1. Crear archivo `.github/workflows/deploy.yml` con:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout 🛎️
           uses: actions/checkout@v3
           
         - name: Install and Build 🔧
           run: |
             npm ci
             npm run build
             
         - name: Deploy 🚀
           uses: JamesIves/github-pages-deploy-action@v4
           with:
             folder: dist
   ```

2. Subir el archivo al repositorio para activar el workflow.

## Migración a backend propio

Para migrar de Supabase a un backend propio:

1. **Base de datos**: 
   - Exporte el esquema de Supabase
   - Importe en su base de datos relacional preferida (PostgreSQL recomendado)

2. **API**:
   - Implemente una API REST o GraphQL (Node.js/Express, NestJS, etc.)
   - Sustituya las llamadas a Supabase por las de su API
   - Mantenga los mismos contratos de tipos en TypeScript

3. **Autenticación**:
   - Implemente JWT u OAuth2 para reemplazar el sistema de autenticación de Supabase
   - Actualice el contexto de autenticación para usar el nuevo sistema

## Consideraciones de seguridad

1. **Roles y permisos**:
   - El sistema utiliza un enfoque de roles basado en la función `has_role` para evitar problemas de recursividad en políticas RLS.
   - Los roles están almacenados en una tabla separada y se gestionan a través de políticas de seguridad.

2. **Protección de rutas**:
   - Todas las rutas sensibles están protegidas por el contexto de autenticación.
   - Las rutas administrativas utilizan un componente `AdminRoute` que verifica el rol.

3. **Seguridad en la base de datos**:
   - Row Level Security (RLS) aplicada a todas las tablas.
   - Políticas específicas para cada operación CRUD.
   - Funciones definidas con SECURITY DEFINER para operaciones críticas.

## Mejores prácticas implementadas

- Componentes modulares con responsabilidades únicas
- Gestión de estado con React Query para mejor rendimiento y caché
- Validación de formularios con Zod
- Gestión avanzada de errores con toasts informativos
- Rutas protegidas con redirección automática
- RLS (Row Level Security) en Supabase para protección de datos
- Código mantenible con tipado estricto

## Licencia

Distribuido bajo la licencia MIT. Vea `LICENSE` para más información.
