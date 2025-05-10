
import React, { useState } from 'react';
import TransactionList, { Transaction } from '@/components/Transactions/TransactionList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CalendarIcon, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';

// Datos de ejemplo
const transactionsData: Transaction[] = [
  {
    id: 't1',
    date: '2023-05-15T10:20:00Z',
    description: 'Pago de membresía Premium',
    amount: 49.99,
    currency: 'USD',
    type: 'deposit',
    status: 'completed',
    source: 'Stripe',
    sourceIcon: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg'
  },
  {
    id: 't2',
    date: '2023-05-14T15:45:00Z',
    description: 'Retiro a cuenta bancaria',
    amount: 1200,
    currency: 'USD',
    type: 'withdrawal',
    status: 'completed',
    source: 'PayPal',
    sourceIcon: 'https://cdn.worldvectorlogo.com/logos/paypal-icon.svg'
  },
  {
    id: 't3',
    date: '2023-05-12T08:30:00Z',
    description: 'Compra BTC',
    amount: 500,
    currency: 'USD',
    type: 'withdrawal',
    status: 'completed',
    source: 'Binance',
    sourceIcon: 'https://cdn.worldvectorlogo.com/logos/binance-logo.svg'
  },
  {
    id: 't4',
    date: '2023-05-11T14:15:00Z',
    description: 'Pago de suscripción mensual',
    amount: 29.99,
    currency: 'USD',
    type: 'deposit',
    status: 'completed',
    source: 'Stripe',
    sourceIcon: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg'
  },
  {
    id: 't5',
    date: '2023-05-10T12:00:00Z',
    description: 'Transferencia a cuenta externa',
    amount: 350,
    currency: 'USD',
    type: 'transfer',
    status: 'pending',
    source: 'Plaid',
    sourceIcon: 'https://cdn.worldvectorlogo.com/logos/plaid-2.svg'
  },
  {
    id: 't6',
    date: '2023-05-09T09:30:00Z',
    description: 'Venta ETH',
    amount: 120.50,
    currency: 'USD',
    type: 'deposit',
    status: 'completed',
    source: 'Binance',
    sourceIcon: 'https://cdn.worldvectorlogo.com/logos/binance-logo.svg'
  },
  {
    id: 't7',
    date: '2023-05-08T16:40:00Z',
    description: 'Reembolso #REF-12345',
    amount: 59.99,
    currency: 'USD',
    type: 'withdrawal',
    status: 'failed',
    source: 'PayPal',
    sourceIcon: 'https://cdn.worldvectorlogo.com/logos/paypal-icon.svg'
  }
];

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [date, setDate] = useState<Date>();

  const filteredTransactions = transactionsData.filter(transaction => {
    // Filtrar por búsqueda
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrar por fuente
    const matchesSource = sourceFilter === 'all' || transaction.source === sourceFilter;
    
    // Filtrar por estado
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    // Filtrar por tipo
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    // Filtrar por fecha
    const matchesDate = !date || 
      new Date(transaction.date).toDateString() === date.toDateString();
    
    // Filtrar por pestaña seleccionada
    const matchesTab = 
      selectedTab === 'all' || 
      (selectedTab === 'deposits' && transaction.type === 'deposit') ||
      (selectedTab === 'withdrawals' && transaction.type === 'withdrawal') ||
      (selectedTab === 'transfers' && transaction.type === 'transfer');
    
    return matchesSearch && matchesSource && matchesStatus && matchesType && matchesDate && matchesTab;
  });

  // Obtener fuentes únicas para el selector
  const uniqueSources = ['all', ...new Set(transactionsData.map(t => t.source))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Transacciones</h1>
        <p className="text-muted-foreground mt-1">Historial unificado de transacciones de todas tus APIs</p>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Resumen de Transacciones</CardTitle>
            <CardDescription>Últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="stat-card p-4">
              <div className="stat-title">Depósitos</div>
              <div className="stat-value text-finance-mint">$3,240.50</div>
            </div>
            <div className="stat-card p-4">
              <div className="stat-title">Retiros</div>
              <div className="stat-value text-finance-gold">$2,170.00</div>
            </div>
            <div className="stat-card p-4">
              <div className="stat-title">Transferencias</div>
              <div className="stat-value">$850.00</div>
            </div>
            <div className="stat-card p-4">
              <div className="stat-title">Transacciones</div>
              <div className="stat-value">42</div>
            </div>
          </CardContent>
        </Card>
      
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="deposits">Depósitos</TabsTrigger>
              <TabsTrigger value="withdrawals">Retiros</TabsTrigger>
              <TabsTrigger value="transfers">Transferencias</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm">
              <Download size={14} className="mr-2" />
              Exportar
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transacciones..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString() : "Fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex gap-2">
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Fuente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fuentes</SelectItem>
                  {uniqueSources.filter(source => source !== 'all').map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="failed">Fallida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-4">
            <TransactionList transactions={filteredTransactions} />
          </TabsContent>
          
          <TabsContent value="deposits" className="mt-4">
            <TransactionList 
              transactions={filteredTransactions.filter(t => t.type === 'deposit')} 
            />
          </TabsContent>
          
          <TabsContent value="withdrawals" className="mt-4">
            <TransactionList 
              transactions={filteredTransactions.filter(t => t.type === 'withdrawal')} 
            />
          </TabsContent>
          
          <TabsContent value="transfers" className="mt-4">
            <TransactionList 
              transactions={filteredTransactions.filter(t => t.type === 'transfer')} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Transactions;
