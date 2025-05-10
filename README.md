
# Automated Finance Hub

Plataforma para la gestión unificada de finanzas personales a través de conexiones API, análisis de transacciones y automatizaciones.

## Características principales

- 🔐 **Autenticación completa** con registro, inicio de sesión y protección de rutas
- 💳 **Gestión de conexiones API** para servicios financieros (Stripe, PayPal, etc.)
- 📊 **Historial de transacciones** unificado con filtros avanzados
- ⚡ **Automatizaciones** para tareas financieras programadas o basadas en eventos
- 🔒 **Configuración de seguridad** con logs de actividad y gestión de sesiones
- 🎨 **Tema claro/oscuro** y otras preferencias de usuario
- 📱 **Diseño responsive** adaptado a todo tipo de dispositivos

## Stack tecnológico

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage)
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
   - Ejecutar el script SQL incluido en el directorio `sql/`
   - Actualizar las variables de Supabase en `src/integrations/supabase/client.ts`

4. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   # o
   bun dev
   ```

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

## Estructura de la base de datos

### Tablas

- **user_profiles**: Información de usuario
- **connections**: Conexiones API a servicios financieros
- **transactions**: Transacciones financieras
- **automations**: Reglas y automatizaciones programadas
- **settings**: Preferencias de usuario
- **security_logs**: Registro de eventos de seguridad

### Diagrama ER

```
user_profiles 1---* connections
user_profiles 1---* transactions
user_profiles 1---* automations
user_profiles 1---1 settings
user_profiles 1---* security_logs
connections 1---* transactions
```

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

## Mejores prácticas implementadas

- Componentes modulares con responsabilidades únicas
- Gestión de estado con React Query para mejor rendimiento y caché
- Validación de formularios con Zod
- Gestión avanzada de errores con toasts informativos
- Rutas protegidas con redirección automática
- RLS (Row Level Security) en Supabase para protección de datos
- Código mantenible con tipado estricto

## Colaboración

1. Haga un fork del repositorio
2. Cree una rama para su feature (`git checkout -b feature/amazing-feature`)
3. Haga commit de sus cambios (`git commit -m 'Add amazing feature'`)
4. Haga push a la rama (`git push origin feature/amazing-feature`)
5. Abra un Pull Request

## Licencia

Distribuido bajo la licencia MIT. Vea `LICENSE` para más información.
