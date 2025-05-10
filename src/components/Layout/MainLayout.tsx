
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/use-mobile';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const { pathname } = useLocation();
  const { authState } = useAuth();
  const { user, isLoading } = authState;

  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  // Ajustar colapso de la barra lateral en cambios de tamaño de pantalla
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isMobile]);

  // Mostrar cargando mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: pathname }} replace />;
  }

  const sidebarWidth = isSidebarCollapsed ? 60 : 240; // Ancho en píxeles

  return (
    <div className="min-h-screen bg-background">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={sidebarWidth}
          collapsible={true}
          collapsedSize={7}
          minSize={7}
          maxSize={15}
          onCollapse={() => setSidebarCollapsed(true)}
          onExpand={() => setSidebarCollapsed(false)}
          className={cn('transition-all duration-300', {
            'min-w-[60px] md:min-w-[60px]': isSidebarCollapsed,
            'min-w-[240px] md:min-w-[240px]': !isSidebarCollapsed,
          })}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} />
        </ResizablePanel>
        
        <ResizableHandle withHandle className="bg-border" />
        
        <ResizablePanel defaultSize={100 - sidebarWidth} minSize={30}>
          <div className="flex flex-col h-full">
            <Header toggleSidebar={toggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MainLayout;
