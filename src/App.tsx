
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "./components/Layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Connections from "./pages/Connections";
import Transactions from "./pages/Transactions";
import Automations from "./pages/Automations";
import SettingsPage from "./pages/Settings/SettingsPage";
import SecurityPage from "./pages/Security/SecurityPage";
import AuthLayout from "./pages/Auth/AuthLayout";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import NotFound from "./pages/NotFound";

// Crear cliente de Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Determinar el basename para despliegue en GitHub Pages
const getBasename = () => {
  // En desarrollo, usar "/"
  // En producción con GitHub Pages, usar "/repository-name"
  return import.meta.env.MODE === 'production' ? '/automated-finance-hub' : '/';
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter basename={getBasename()}>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Rutas autenticadas dentro de MainLayout */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="conexiones" element={<Connections />} />
              <Route path="transacciones" element={<Transactions />} />
              <Route path="automatizaciones" element={<Automations />} />
              <Route path="configuracion" element={<SettingsPage />} />
              <Route path="seguridad" element={<SecurityPage />} />
            </Route>
            
            {/* Rutas de autenticación */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<Navigate to="/auth/login" replace />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </Route>
            
            {/* Ruta Index para redirigir al dashboard */}
            <Route path="/index" element={<Navigate to="/" replace />} />
            
            {/* Cualquier otra ruta redirige a la página de 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
