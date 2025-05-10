
import React, { useState } from 'react';
import {
  BarChart3,
  Wallet,
  ArrowUpDown,
  Clock,
  AlertCircle,
  Check,
  Calendar,
  Zap,
  ArrowRightLeft,
  Mail
} from 'lucide-react';
import StatCard from '@/components/Dashboard/StatCard';
import APIConnectionCard, { APIConnection } from '@/components/API/APIConnectionCard';
import AutomationCard, { Automation, AutomationStatus } from '@/components/Automation/AutomationCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/formatters';

// Datos de prueba
const apiConnections: APIConnection[] = [
  {
    id: '1',
    name: 'Stripe',
    provider: 'API de Pagos',
    status: 'active',
    logo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg',
    lastSync: '2023-05-10T15:30:00Z'
  },
  {
    id: '2',
    name: 'Binance',
    provider: 'Exchange de Criptomonedas',
    status: 'active',
    logo: 'https://cdn.worldvectorlogo.com/logos/binance-logo.svg',
    lastSync: '2023-05-10T12:45:00Z'
  },
  {
    id: '3',
    name: 'PayPal',
    provider: 'Pasarela de pago',
    status: 'error',
    logo: 'https://cdn.worldvectorlogo.com/logos/paypal-icon.svg',
    lastSync: '2023-05-09T18:20:00Z',
    errorMessage: 'Error de autenticación. La API key puede haber expirado.'
  }
];

const automations: Automation[] = [
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
      icon: <Wallet size={16} />
    },
    action: {
      description: 'Enviar alerta por email',
      icon: <Mail size={16} />
    }
  }
];

const Dashboard = () => {
  const [connections, setConnections] = useState<APIConnection[]>(apiConnections);
  const [automationsList, setAutomationsList] = useState<Automation[]>(automations);
  
  const handleRefreshConnection = (id: string) => {
    // Simula actualización de conexión
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Sincronizando conexión...',
        success: `Conexión sincronizada exitosamente`,
        error: 'Error al sincronizar la conexión'
      }
    );
  };
  
  const handleToggleAutomationStatus = (id: string, newStatus: AutomationStatus) => {
    setAutomationsList(prev => 
      prev.map(automation => 
        automation.id === id 
          ? { ...automation, status: newStatus } 
          : automation
      )
    );
    
    toast.success(`Automatización ${newStatus === 'active' ? 'activada' : 'pausada'}`);
  };
  
  const handleEditAutomation = (id: string) => {
    // Redireccionar a la página de edición
    toast.info(`Editando automatización: ${id}`);
  };
  
  const handleDeleteAutomation = (id: string) => {
    setAutomationsList(prev => prev.filter(automation => automation.id !== id));
    toast.success('Automatización eliminada');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Bienvenido a tu centro de control financiero</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Balance total"
          value={formatCurrency(24586.40)}
          icon={<Wallet size={18} />}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard 
          title="Transacciones (30 días)"
          value="1,284"
          icon={<ArrowUpDown size={18} />}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard 
          title="APIs Conectadas"
          value="3/5"
          icon={<Check size={18} />}
        />
        <StatCard 
          title="Automatizaciones activas"
          value="7"
          icon={<Zap size={18} />}
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Conexiones API</h2>
          <Button size="sm">
            Ver todas
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {connections.map(connection => (
            <APIConnectionCard 
              key={connection.id}
              connection={connection}
              onRefresh={handleRefreshConnection}
            />
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Automatizaciones</h2>
          <Button size="sm">
            Ver todas
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {automationsList.map(automation => (
            <AutomationCard 
              key={automation.id}
              automation={automation}
              onToggleStatus={handleToggleAutomationStatus}
              onEdit={handleEditAutomation}
              onDelete={handleDeleteAutomation}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
