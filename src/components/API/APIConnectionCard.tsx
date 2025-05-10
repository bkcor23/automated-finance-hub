
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export type APIConnectionStatus = 'active' | 'inactive' | 'error';

export interface APIConnection {
  id: string;
  name: string;
  provider: string;
  status: APIConnectionStatus;
  logo: string;
  lastSync: string;
  errorMessage?: string;
}

interface APIConnectionCardProps {
  connection: APIConnection;
  onRefresh: (id: string) => void;
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Activa',
    className: 'bg-finance-mint/20 text-finance-mint',
    icon: <CheckCircle2 size={14} className="mr-1" />
  },
  inactive: {
    label: 'Inactiva',
    className: 'bg-finance-gray/20 text-finance-gray',
    icon: null
  },
  error: {
    label: 'Error',
    className: 'bg-destructive/20 text-destructive',
    icon: <AlertTriangle size={14} className="mr-1" />
  }
};

const APIConnectionCard = ({ connection, onRefresh, className }: APIConnectionCardProps) => {
  const { status, name, provider, lastSync, errorMessage, id, logo } = connection;
  const { label, className: statusClassName, icon } = statusConfig[status];
  
  return (
    <div className={cn(
      "api-connection-card",
      {
        'api-connection-active': status === 'active',
        'api-connection-inactive': status === 'inactive',
        'api-connection-error': status === 'error',
      },
      className
    )}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden">
            <img src={logo} alt={name} className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-xs text-muted-foreground">{provider}</p>
          </div>
        </div>
        
        <Badge className={statusClassName}>
          {icon}
          {label}
        </Badge>
      </div>
      
      {status === 'error' && errorMessage && (
        <div className="mt-3 p-2 bg-destructive/10 text-destructive text-xs rounded">
          {errorMessage}
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
        <span>Última sincronización: {lastSync}</span>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 text-xs"
            onClick={() => onRefresh(id)}
          >
            <RefreshCw size={14} className="mr-1" />
            Sincronizar
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            asChild
            className="h-7 px-2 text-xs"
          >
            <Link to={`/conexiones/${id}`}>
              <ExternalLink size={14} className="mr-1" />
              Detalles
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default APIConnectionCard;
