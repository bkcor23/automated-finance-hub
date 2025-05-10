
import React, { useState } from 'react';
import { 
  Plus,
  Search,
  Filter,
  AlertTriangle
} from 'lucide-react';
import APIConnectionCard, { APIConnection } from '@/components/API/APIConnectionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from '@/components/ui/textarea';

// Datos de prueba
const apiConnectionsData: APIConnection[] = [
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
  },
  {
    id: '4',
    name: 'Plaid',
    provider: 'Agregador bancario',
    status: 'inactive',
    logo: 'https://cdn.worldvectorlogo.com/logos/plaid-2.svg',
    lastSync: '2023-05-08T09:15:00Z'
  }
];

const availableAPIs = [
  { id: 'stripe', name: 'Stripe', logo: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', category: 'Pagos' },
  { id: 'paypal', name: 'PayPal', logo: 'https://cdn.worldvectorlogo.com/logos/paypal-icon.svg', category: 'Pagos' },
  { id: 'binance', name: 'Binance', logo: 'https://cdn.worldvectorlogo.com/logos/binance-logo.svg', category: 'Criptomonedas' },
  { id: 'plaid', name: 'Plaid', logo: 'https://cdn.worldvectorlogo.com/logos/plaid-2.svg', category: 'Agregadores' },
  { id: 'coinbase', name: 'Coinbase', logo: 'https://cdn.worldvectorlogo.com/logos/coinbase-1.svg', category: 'Criptomonedas' }
];

const Connections = () => {
  const [connections, setConnections] = useState<APIConnection[]>(apiConnectionsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState('');
  
  const filteredConnections = connections.filter(connection => {
    const matchesSearch = 
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.provider.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      connection.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });
  
  const handleRefreshConnection = (id: string) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Sincronizando conexión...',
        success: `Conexión sincronizada exitosamente`,
        error: 'Error al sincronizar la conexión'
      }
    );
  };
  
  const handleAddConnection = () => {
    if (!selectedAPI || !apiKey.trim()) {
      toast.error('Por favor selecciona una API e introduce una clave API válida');
      return;
    }
    
    const apiDetails = availableAPIs.find(api => api.id === selectedAPI);
    if (!apiDetails) return;
    
    const newConnection: APIConnection = {
      id: `new-${Date.now()}`,
      name: apiDetails.name,
      provider: apiDetails.category,
      status: 'active',
      logo: apiDetails.logo,
      lastSync: new Date().toISOString()
    };
    
    setConnections(prev => [newConnection, ...prev]);
    setSelectedAPI(null);
    setApiKey('');
    setIsAddDialogOpen(false);
    
    toast.success(`Conexión con ${apiDetails.name} agregada exitosamente`);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Conexiones API</h1>
        <p className="text-muted-foreground mt-1">Gestiona tus integraciones con servicios financieros</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conexiones..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="inactive">Inactivas</SelectItem>
              <SelectItem value="error">Con errores</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Nueva Conexión
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Agregar nueva conexión API</DialogTitle>
              <DialogDescription>
                Selecciona un proveedor de API y configura tu conexión.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid gap-3">
                <FormLabel>Seleccionar API</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableAPIs.map(api => (
                    <div 
                      key={api.id}
                      className={`border rounded-md p-3 flex flex-col items-center cursor-pointer hover:bg-accent transition-colors ${selectedAPI === api.id ? 'border-primary bg-accent' : ''}`}
                      onClick={() => setSelectedAPI(api.id)}
                    >
                      <div className="w-12 h-12 flex items-center justify-center mb-2">
                        <img src={api.logo} alt={api.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="text-sm font-medium">{api.name}</span>
                      <span className="text-xs text-muted-foreground">{api.category}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid gap-3">
                <FormLabel>Credenciales API</FormLabel>
                {selectedAPI && (
                  <>
                    <Textarea
                      placeholder="Pega tu API key o secreto aquí"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Las credenciales serán encriptadas y almacenadas de forma segura
                    </p>
                  </>
                )}
                {!selectedAPI && (
                  <p className="text-sm text-muted-foreground">Selecciona primero una API</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddConnection} disabled={!selectedAPI || !apiKey.trim()}>
                Conectar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {filteredConnections.length === 0 ? (
        <div className="text-center py-10">
          {searchQuery || statusFilter !== 'all' ? (
            <>
              <p className="text-muted-foreground">No se encontraron conexiones con los filtros aplicados</p>
              <Button variant="link" onClick={() => {setSearchQuery(''); setStatusFilter('all');}}>
                Limpiar filtros
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">No tienes conexiones API configuradas</p>
              <Button variant="link" onClick={() => setIsAddDialogOpen(true)}>
                Agregar tu primera conexión
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredConnections.map(connection => (
            <APIConnectionCard 
              key={connection.id}
              connection={connection}
              onRefresh={handleRefreshConnection}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
