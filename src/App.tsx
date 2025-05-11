
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import AuthLayout from './pages/Auth/AuthLayout';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminRoute from './components/Auth/AdminRoute';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Connections from './pages/Connections';
import Automations from './pages/Automations';
import NotFound from './pages/NotFound';
import UserManagement from './pages/Admin/UserManagement';
import SettingsPage from './pages/Settings/SettingsPage';
import SecurityPage from './pages/Security/SecurityPage';
import CreateAdmin from './pages/Admin/CreateAdmin';

// Configuración de rutas con React Router
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: (
        <AuthProvider>
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        </AuthProvider>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'transactions', element: <Transactions /> },
        { path: 'connections', element: <Connections /> },
        { path: 'automations', element: <Automations /> },
        { path: 'settings', element: <SettingsPage /> },
        { path: 'security', element: <SecurityPage /> },
        {
          path: 'admin',
          element: <AdminRoute />,
          children: [
            { index: true, element: <Navigate to="/admin/users" replace /> },
            { path: 'users', element: <UserManagement /> },
            { path: 'create-admin', element: <CreateAdmin /> },
          ],
        },
        // Redirigir rutas no encontradas al dashboard
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
    {
      path: '/auth',
      element: (
        <AuthProvider>
          <AuthLayout />
        </AuthProvider>
      ),
      children: [
        { index: true, element: <Navigate to="/auth/login" replace /> },
        { path: 'login', element: <LoginPage /> },
        { path: 'signup', element: <SignupPage /> },
      ],
    },
    // Fallback para rutas fuera de la jerarquía principal
    { path: '*', element: <Navigate to="/" replace /> },
  ],
  {
    basename: import.meta.env.BASE_URL || '/',
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
