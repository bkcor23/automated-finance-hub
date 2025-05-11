
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  WalletCards, 
  ReceiptText, 
  Zap, 
  Settings, 
  ShieldCheck,
  Users,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('admin');

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="w-5 h-5" />,
      exact: true
    },
    {
      name: 'Conexiones',
      path: '/conexiones',
      icon: <WalletCards className="w-5 h-5" />
    },
    {
      name: 'Transacciones',
      path: '/transacciones',
      icon: <ReceiptText className="w-5 h-5" />
    },
    {
      name: 'Automatizaciones',
      path: '/automatizaciones',
      icon: <Zap className="w-5 h-5" />
    },
    {
      name: 'Configuración',
      path: '/configuracion',
      icon: <Settings className="w-5 h-5" />
    },
    {
      name: 'Seguridad',
      path: '/seguridad',
      icon: <ShieldCheck className="w-5 h-5" />
    }
  ];

  const adminItems = [
    {
      name: 'Gestión de Usuarios',
      path: '/admin/usuarios',
      icon: <Users className="w-5 h-5" />
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-4 border-b">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-start")}>
          <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-md text-white font-bold text-lg">
            F
          </div>
          {!isCollapsed && (
            <h1 className="font-bold text-lg ml-2">Finance Hub</h1>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/60 hover:text-accent-foreground",
                  isCollapsed && "justify-center"
                )
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}

          {isAdmin && (
            <div className="pt-4">
              <div className={cn("px-3 py-2 text-xs uppercase text-muted-foreground/70 font-semibold",
                isCollapsed && "text-center"
              )}>
                {!isCollapsed ? "Administración" : "Admin"}
              </div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent/60 hover:text-accent-foreground",
                      isCollapsed && "justify-center"
                    )
                  }
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              ))}
            </div>
          )}
        </nav>
      </div>
      
      <div className="mt-auto p-4 border-t">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">U</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium">Mi cuenta</span>
              <span className="text-xs text-muted-foreground">Usuario</span>
            </div>
          </div>
          <ChevronRight className={cn("w-5 h-5 text-muted-foreground", !isCollapsed && "ml-2")} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
