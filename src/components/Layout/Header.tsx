
import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  UserCircle,
  Search,
  Bell,
  ShieldCheck,
  LogOut,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Header = ({ toggleSidebar, isSidebarCollapsed }: HeaderProps) => {
  const { authState, logout } = useAuth();
  const profile = authState.profile;
  
  // En un sistema real, esto consultaría notificaciones desde la BD
  const notificationCount = 3;
  
  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6 sticky top-0 z-10">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleSidebar}
        className="mr-2"
      >
        {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </Button>

      <div className="flex-1 md:grow-0 md:w-64 md:mr-4">
        <div className="relative md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-8 bg-muted/50 border-muted md:w-full"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Botón de notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[10px] flex items-center justify-center text-primary-foreground">
                  {notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              <DropdownMenuItem className="py-3">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Nueva transacción detectada</span>
                    <span className="text-xs text-muted-foreground">Hace 5 min</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Se ha registrado un pago de $299.99 en tu cuenta
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Automatización completada</span>
                    <span className="text-xs text-muted-foreground">Hace 2 horas</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    La transferencia automática mensual se completó exitosamente
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Error en conexión</span>
                    <span className="text-xs text-muted-foreground">Hace 1 día</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    La conexión con PayPal requiere reautorización
                  </span>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-center cursor-pointer">
              Ver todas las notificaciones
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botón de tema */}
        <ThemeToggle />

        {/* Menú de usuario */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.full_name || 'Usuario'} 
                    className="w-6 h-6 rounded-full object-cover" 
                  />
                ) : (
                  <User size={14} />
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{profile?.full_name || 'Usuario'}</span>
                <span className="text-xs text-muted-foreground">
                  {profile?.email || 'usuario@ejemplo.com'}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings size={16} />
                <span>Configuración</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/security" className="flex items-center gap-2 cursor-pointer">
                <ShieldCheck size={16} />
                <span>Seguridad</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={logout}
            >
              <LogOut size={16} className="mr-2" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
