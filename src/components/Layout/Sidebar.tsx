import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  ArrowUpDownIcon,
  Link2,
  Zap,
  LogOut,
  Settings,
  ShieldAlert,
  Users,
  UserPlus,
  Menu,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultCollapsed?: boolean;
}

export default function Sidebar({
  defaultCollapsed = false,
  className,
  ...props
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const navigate = useNavigate();
  const { logout, hasRole } = useAuth();
  const isMobile = useIsMobile();

  // En móvil, siempre comenzamos colapsado
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <>
      {/* Botón para mostrar/ocultar sidebar en móvil */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex flex-col h-screen bg-background border-r transition-all duration-300 overflow-hidden",
          collapsed ? "w-16" : "w-64",
          isMobile && collapsed && "-ml-16",
          isMobile && "fixed z-40 h-full",
          className
        )}
        {...props}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-center h-14 border-b">
          {collapsed ? (
            <BarChart3 className="h-6 w-6 text-primary" />
          ) : (
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-bold tracking-tight">Finance Hub</span>
            </div>
          )}
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-4 flex flex-col overflow-y-auto scrollbar-thin">
          <NavItem
            icon={<BarChart3 className="h-4 w-4" />}
            label="Dashboard"
            to="/"
            collapsed={collapsed}
          />
          <NavItem
            icon={<ArrowUpDownIcon className="h-4 w-4" />}
            label="Transacciones"
            to="/transactions"
            collapsed={collapsed}
          />
          <NavItem
            icon={<Link2 className="h-4 w-4" />}
            label="Conexiones"
            to="/connections"
            collapsed={collapsed}
          />
          <NavItem
            icon={<Zap className="h-4 w-4" />}
            label="Automatizaciones"
            to="/automations"
            collapsed={collapsed}
          />

          <div className="mt-2 mb-2 border-t mx-3"></div>

          <NavItem
            icon={<Settings className="h-4 w-4" />}
            label="Configuración"
            to="/settings"
            collapsed={collapsed}
          />
          <NavItem
            icon={<ShieldAlert className="h-4 w-4" />}
            label="Seguridad"
            to="/security"
            collapsed={collapsed}
          />

          {/* Sección administrativa solo visible para administradores */}
          {hasRole('admin') && (
            <>
              <div className="mt-2 mb-2 border-t mx-3"></div>
              
              <div className={cn(
                "px-3 text-xs font-semibold text-muted-foreground",
                collapsed ? "text-center" : "text-left"
              )}>
                {!collapsed && "ADMIN"}
              </div>
              
              <NavItem
                icon={<Users className="h-4 w-4" />}
                label="Gestión de Usuarios"
                to="/admin/users"
                collapsed={collapsed}
              />
              
              <NavItem
                icon={<UserPlus className="h-4 w-4" />}
                label="Crear Admin"
                to="/admin/create-admin"
                collapsed={collapsed}
              />
            </>
          )}
        </nav>

        {/* Cerrar sesión */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center justify-start",
              collapsed && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && <span>Cerrar sesión</span>}
          </Button>
        </div>

        {/* Control de colapso (solo en escritorio) */}
        {!isMobile && (
          <div className="p-2 border-t flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-6 w-6"
            >
              {collapsed ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10 12.77 13.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Overlay para cerrar sidebar en móvil */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

// Componente de item de navegación
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed: boolean;
}

function NavItem({ icon, label, to, collapsed }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2 mx-2 my-1 rounded-md text-sm transition-colors hover:bg-accent",
        collapsed ? "justify-center" : "justify-start"
      )}
    >
      <span className={collapsed ? "" : "mr-2"}>{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
