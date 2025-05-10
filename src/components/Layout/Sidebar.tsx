
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Plugs, 
  BarChart3, 
  Clock, 
  Settings, 
  Shield, 
  HelpCircle 
} from 'lucide-react';

const navItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/' 
  },
  { 
    icon: Plugs, 
    label: 'API Conexiones', 
    path: '/conexiones' 
  },
  { 
    icon: BarChart3, 
    label: 'Transacciones', 
    path: '/transacciones' 
  },
  { 
    icon: Clock, 
    label: 'Automatizaciones', 
    path: '/automatizaciones' 
  },
  { 
    icon: Settings, 
    label: 'Configuración', 
    path: '/configuracion' 
  },
  { 
    icon: Shield, 
    label: 'Seguridad', 
    path: '/seguridad' 
  },
  { 
    icon: HelpCircle, 
    label: 'Ayuda', 
    path: '/ayuda' 
  },
];

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <div className="h-screen w-64 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-5 border-b border-sidebar-border">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-finance-gold">
            <Plugs size={24} />
          </span>
          FinanceHub
        </h1>
        <p className="text-xs text-sidebar-foreground/70 mt-1">Control Central de APIs</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                  : "text-sidebar-foreground/80 hover:bg-sidebar-border hover:text-sidebar-foreground"
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-finance-blue flex items-center justify-center">
            <span className="font-semibold text-white">U</span>
          </div>
          <div>
            <p className="text-sm font-medium">Usuario Demo</p>
            <p className="text-xs text-sidebar-foreground/70">Plan Professional</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
