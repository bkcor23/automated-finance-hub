
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plugs } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-5 p-6 max-w-md">
        <div className="rounded-full w-20 h-20 bg-muted flex items-center justify-center mx-auto mb-6">
          <Plugs size={32} className="text-finance-gold" />
        </div>
        
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl">Página no encontrada</p>
        
        <p className="text-muted-foreground">
          La página que estás buscando no existe o ha sido eliminada.
        </p>
        
        <Button asChild className="mt-8">
          <Link to="/">Volver al Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
