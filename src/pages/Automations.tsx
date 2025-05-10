
import React, { useState } from 'react';
import { 
  Plus,
  Search,
  Calendar,
  DollarSign,
  AlertCircle,
  Zap,
  Mail,
  MessageSquare,
  ArrowRightLeft,
  WebhookIcon,
  Clock 
} from 'lucide-react';
import AutomationCard, { Automation, AutomationType, AutomationStatus } from '@/components/Automation/AutomationCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const automationsData: Automation[] = [
  {
    id: '1',
    name: 'Transferencia mensual',
    description: 'Transferir fondos de Stripe a cuenta bancaria cada mes',
    type: 'schedule',
    status: 'active',
    nextExecution: '2023-06-01T10:00:00Z',
    lastExecution: '2023-05-01T10:00:00Z',
    executions: 5,
    trigger: {
      description: 'El día 1 de cada mes a las 10:00',
      icon: <Calendar size={16} />
    },
    action: {
      description: 'Transferir $1,000 USD de Stripe a BBVA',
      icon: <ArrowRightLeft size={16} />
    }
  },
  {
    id: '2',
    name: 'Alerta de balance bajo',
    description: 'Enviar email si el balance de PayPal baja de $100',
    type: 'condition',
    status: 'paused',
    executions: 2,
    lastExecution: '2023-04-15T14:22:00Z',
    trigger: {
      description: 'Cuando el balance de PayPal < $100',
      icon: <DollarSign size={16} />
    },
    action: {
      description: 'Enviar alerta por email',
      icon: <Mail size={16} />
    }
  },
  {
    id: '3',
    name: 'Notificación de cargo grande',
    description: 'Enviar SMS cuando ocurra un cargo mayor a $500',
    type: 'condition',
    status: 'active',
    executions: 3,
    lastExecution: '2023-05-02T17:45:00Z',
    trigger: {
      description: 'Cuando un cargo > $500 USD',
      icon: <AlertCircle size={16} />
    },
    action: {
      description: 'Enviar SMS al número registrado',
      icon: <MessageSquare size={16} />
    }
  },
  {
    id: '4',
    name: 'Procesar pago webhook',
    description: 'Al recibir webhook de nuevo pago, registrar en sistema',
    type: 'webhook',
    status: 'active',
    executions: 28,
    lastExecution: '2023-05-10T09:12:00Z',
    trigger: {
      description: 'Evento Webhook payment.created',
      icon: <WebhookIcon size={16} />
    },
    action: {
      description: 'Registrar en sistema y notificar',
      icon: <Zap size={16} />
    }
  },
  {
    id: '5',
    name: 'Reporte semanal',
    description: 'Generar y enviar reporte de transacciones semanalmente',
    type: 'schedule',
    status: 'active',
    nextExecution: '2023-05-14T08:00:00Z',
    lastExecution: '2023-05-07T08:00:00Z',
    executions: 12,
    trigger: {
      description: 'Todos los domingos a las 8:00',
      icon: <Clock size={16} />
    },
    action: {
      description: 'Generar PDF y enviar por email',
      icon: <Mail size={16} />
    }
  }
];

const Automations = () => {
  const [automations, setAutomations] = useState<Automation[]>(automationsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredAutomations = automations.filter(automation => {
    const matchesSearch = 
      automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = 
      typeFilter === 'all' || 
      automation.type === typeFilter;
      
    const matchesStatus = 
      statusFilter === 'all' || 
      automation.status === statusFilter;
      
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const handleToggleStatus = (id: string, newStatus: AutomationStatus) => {
    setAutomations(prevAutomations => 
      prevAutomations.map(automation => 
        automation.id === id 
          ? { ...automation, status: newStatus } 
          : automation
      )
    );
    
    toast.success(`Automatización ${newStatus === 'active' ? 'activada' : 'pausada'}`);
  };
  
  const handleEditAutomation = (id: string) => {
    toast.info('Editando automatización... (Funcionalidad en desarrollo)');
  };
  
  const handleDeleteAutomation = (id: string) => {
    setAutomations(prevAutomations => 
      prevAutomations.filter(automation => automation.id !== id)
    );
    
    toast.success('Automatización eliminada');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Automatizaciones</h1>
        <p className="text-muted-foreground mt-1">Configura flujos automáticos para tus operaciones financieras</p>
      </div>
      
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="schedule">Programadas</TabsTrigger>
            <TabsTrigger value="condition">Condicionales</TabsTrigger>
            <TabsTrigger value="webhook">Webhooks</TabsTrigger>
          </TabsList>
          
          <Button>
            <Plus size={16} className="mr-2" />
            Nueva Automatización
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar automatizaciones..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="paused">Pausadas</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAutomations.length > 0 ? (
              filteredAutomations.map(automation => (
                <AutomationCard 
                  key={automation.id}
                  automation={automation}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditAutomation}
                  onDelete={handleDeleteAutomation}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-muted-foreground">No se encontraron automatizaciones</p>
                {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all') && (
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setTypeFilter('all');
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAutomations.filter(a => a.type === 'schedule').length > 0 ? (
              filteredAutomations
                .filter(a => a.type === 'schedule')
                .map(automation => (
                  <AutomationCard 
                    key={automation.id}
                    automation={automation}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEditAutomation}
                    onDelete={handleDeleteAutomation}
                  />
                ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-muted-foreground">No se encontraron automatizaciones programadas</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="condition" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAutomations.filter(a => a.type === 'condition').length > 0 ? (
              filteredAutomations
                .filter(a => a.type === 'condition')
                .map(automation => (
                  <AutomationCard 
                    key={automation.id}
                    automation={automation}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEditAutomation}
                    onDelete={handleDeleteAutomation}
                  />
                ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-muted-foreground">No se encontraron automatizaciones condicionales</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="webhook" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredAutomations.filter(a => a.type === 'webhook').length > 0 ? (
              filteredAutomations
                .filter(a => a.type === 'webhook')
                .map(automation => (
                  <AutomationCard 
                    key={automation.id}
                    automation={automation}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEditAutomation}
                    onDelete={handleDeleteAutomation}
                  />
                ))
            ) : (
              <div className="col-span-2 text-center py-10">
                <p className="text-muted-foreground">No se encontraron automatizaciones de webhook</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Automations;
