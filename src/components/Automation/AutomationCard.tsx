
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Calendar, 
  MoreVertical, 
  Play,
  Pause,
  Edit,
  Trash2
} from 'lucide-react';

export type AutomationType = 'schedule' | 'condition' | 'webhook';
export type AutomationStatus = 'active' | 'paused' | 'draft';

export interface Automation {
  id: string;
  name: string;
  description: string;
  type: AutomationType;
  status: AutomationStatus;
  nextExecution?: string;
  lastExecution?: string;
  executions: number;
  trigger: {
    description: string;
    icon: React.ReactNode;
  };
  action: {
    description: string;
    icon: React.ReactNode;
  };
}

interface AutomationCardProps {
  automation: Automation;
  onToggleStatus: (id: string, newStatus: AutomationStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const typeConfig = {
  schedule: {
    label: 'Programada',
    icon: <Calendar size={14} className="mr-1" />,
    className: 'bg-primary/20 text-primary'
  },
  condition: {
    label: 'Condicional',
    icon: <Calendar size={14} className="mr-1" />,
    className: 'bg-finance-gold/20 text-finance-gold'
  },
  webhook: {
    label: 'Webhook',
    icon: <Calendar size={14} className="mr-1" />,
    className: 'bg-finance-mint/20 text-finance-mint'
  }
};

const statusConfig = {
  active: {
    label: 'Activa',
    className: 'bg-finance-mint/20 text-finance-mint'
  },
  paused: {
    label: 'Pausada',
    className: 'bg-finance-gold/20 text-finance-gold'
  },
  draft: {
    label: 'Borrador',
    className: 'bg-muted text-muted-foreground'
  }
};

const AutomationCard = ({ 
  automation, 
  onToggleStatus, 
  onEdit, 
  onDelete, 
  className 
}: AutomationCardProps) => {
  const { 
    id, 
    name, 
    description, 
    type, 
    status, 
    nextExecution, 
    lastExecution, 
    executions,
    trigger,
    action
  } = automation;
  
  const { label: typeLabel, className: typeClassName } = typeConfig[type];
  const { label: statusLabel, className: statusClassName } = statusConfig[status];
  
  const handleToggleStatus = () => {
    const newStatus = status === 'active' ? 'paused' : 'active';
    onToggleStatus(id, newStatus);
  };
  
  return (
    <div className={cn("finance-card", className)}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{name}</h3>
            <Badge className={typeClassName}>{typeLabel}</Badge>
            <Badge className={statusClassName}>{statusLabel}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleToggleStatus}>
              {status === 'active' ? (
                <>
                  <Pause size={14} className="mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play size={14} className="mr-2" />
                  Activar
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(id)}>
              <Edit size={14} className="mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(id)}
              className="text-destructive"
            >
              <Trash2 size={14} className="mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="mt-4 border rounded-md p-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 flex items-center gap-2 p-2 bg-muted/50 rounded-md">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              {trigger.icon}
            </div>
            <span className="text-sm">{trigger.description}</span>
          </div>
          
          <div className="flex-shrink-0 flex items-center">
            <div className="w-8 h-0.5 bg-muted"></div>
            <span className="mx-2 text-muted-foreground text-xs">→</span>
            <div className="w-8 h-0.5 bg-muted"></div>
          </div>
          
          <div className="flex-1 flex items-center gap-2 p-2 bg-muted/50 rounded-md">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              {action.icon}
            </div>
            <span className="text-sm">{action.description}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
        <div>
          <p className="font-medium">Ejecutada</p>
          <p>{executions} veces</p>
        </div>
        
        {lastExecution && (
          <div>
            <p className="font-medium">Última ejecución</p>
            <p>{new Date(lastExecution).toLocaleString()}</p>
          </div>
        )}
        
        {nextExecution && status === 'active' && (
          <div>
            <p className="font-medium">Próxima ejecución</p>
            <p>{new Date(nextExecution).toLocaleString()}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutomationCard;
