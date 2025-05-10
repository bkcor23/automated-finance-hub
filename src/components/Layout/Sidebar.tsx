
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  LayoutDashboard,
  Link2,
  ArrowUpDown,
  Zap,
  Settings,
  ShieldCheck,
  LogOut,
  ChevronDown,
  ChevronRight,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

interface SidebarProps {
  isCollapsed: boolean;
}

export default function Sidebar({ isCollapsed }: SidebarProps) {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const { authState, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const profile = authState.profile;
  const shortName = profile?.full_name
    ? profile.full_name.split(' ')[0]
    : 'Usuario';
  
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="size-4" />,
    },
    {
      name: 'Conexiones API',
      path: '/conexiones',
      icon: <Link2 className="size-4" />,
    },
    {
      name: 'Transacciones',
      path: '/transacciones',
      icon: <ArrowUpDown className="size-4" />,
    },
    {
      name: 'Automatizaciones',
      path: '/automatizaciones',
      icon: <Zap className="size-4" />,
    },
  ];
  
  // Elementos de menú para la configuración y seguridad
  const configItems = [
    {
      name: 'Configuración',
      path: '/configuracion',
      icon: <Settings className="size-4" />,
    },
    {
      name: 'Seguridad',
      path: '/seguridad',
      icon: <ShieldCheck className="size-4" />,
    },
  ];

  // Si la pantalla es pequeña, colapsado o no debe establecerse desde fuera
  // y este componente no debería cambiar esa propiedad
  return (
    <ScrollArea
      className={cn('h-full rounded-md', {
        'w-sidebar': !isCollapsed,
        'w-sidebar-collapsed': isCollapsed,
      })}
      data-collapsed={isCollapsed}
    >
      <div className="p-2 pt-6 flex flex-col h-full justify-between">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/">
              <img
                src="/placeholder.svg"
                alt="Logo"
                className="size-10"
              />
            </Link>
          </div>

          {/* Navegación Principal */}
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={pathname === item.path ? 'secondary' : 'ghost'}
                size="sm"
                className={cn('justify-start gap-2 h-10', {
                  'justify-center': isCollapsed,
                })}
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              </Button>
            ))}
          </div>
          
          {/* Sección de Configuración */}
          {!isCollapsed ? (
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground ml-3 mb-1">
                CONFIGURACIÓN
              </div>
              {configItems.map((item) => (
                <Button
                  key={item.path}
                  variant={pathname === item.path ? 'secondary' : 'ghost'}
                  size="sm"
                  className="justify-start gap-2 h-10 w-full"
                  asChild
                >
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {configItems.map((item) => (
                <Button
                  key={item.path}
                  variant={pathname === item.path ? 'secondary' : 'ghost'}
                  size="sm"
                  className="justify-center gap-2 h-10 w-full"
                  asChild
                >
                  <Link to={item.path}>
                    {item.icon}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Perfil de usuario */}
        {!isCollapsed ? (
          <Collapsible 
            open={isUserMenuOpen} 
            onOpenChange={setIsUserMenuOpen}
            className="mt-auto"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center py-2 px-2 gap-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || 'Usuario'} 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{shortName}</span>
                    <span className="text-xs text-muted-foreground truncate w-28">
                      {profile?.email || 'usuario@ejemplo.com'}
                    </span>
                  </div>
                </div>
                {isUserMenuOpen ? (
                  <ChevronDown size={16} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={16} className="text-muted-foreground" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pl-4 pt-2 space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link to="/configuracion">
                    <Settings size={16} />
                    Configuración
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start gap-2" 
                  asChild
                >
                  <Link to="/seguridad">
                    <ShieldCheck size={16} />
                    Seguridad
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                  onClick={logout}
                >
                  <LogOut size={16} />
                  Cerrar sesión
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          <div className="mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full h-10 flex justify-center items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name || 'Usuario'} 
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                    ) : (
                      <User size={16} />
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
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
                  <Link to="/configuracion" className="flex items-center gap-2 cursor-pointer">
                    <Settings size={16} />
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/seguridad" className="flex items-center gap-2 cursor-pointer">
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
        )}
      </div>
    </ScrollArea>
  );
}
