
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatters';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'completed' | 'pending' | 'failed';
  source: string;
  sourceIcon: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const typeConfig = {
  deposit: {
    icon: <ArrowDownRight className="mr-1 text-finance-mint" size={16} />,
    className: 'text-finance-mint'
  },
  withdrawal: {
    icon: <ArrowUpRight className="mr-1 text-finance-gold" size={16} />,
    className: 'text-finance-gold'
  },
  transfer: {
    icon: <RefreshCw className="mr-1 text-primary" size={16} />,
    className: 'text-primary'
  }
};

const statusConfig = {
  completed: {
    className: 'bg-finance-mint/20 text-finance-mint'
  },
  pending: {
    className: 'bg-finance-gold/20 text-finance-gold'
  },
  failed: {
    className: 'bg-destructive/20 text-destructive'
  }
};

const TransactionList = ({ transactions, isLoading = false }: TransactionListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-md"></div>
        ))}
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No hay transacciones para mostrar</p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Fuente</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Monto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          const { icon, className } = typeConfig[transaction.type];
          const { className: statusClassName } = statusConfig[transaction.status];
          
          return (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {new Date(transaction.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5">
                    <img 
                      src={transaction.sourceIcon} 
                      alt={transaction.source} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  {transaction.source}
                </div>
              </TableCell>
              <TableCell>
                <div className={`flex items-center ${className}`}>
                  {icon}
                  <span>
                    {transaction.type === 'deposit' && 'Ingreso'}
                    {transaction.type === 'withdrawal' && 'Retiro'}
                    {transaction.type === 'transfer' && 'Transferencia'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={statusClassName}>
                  {transaction.status === 'completed' && 'Completada'}
                  {transaction.status === 'pending' && 'Pendiente'}
                  {transaction.status === 'failed' && 'Fallida'}
                </Badge>
              </TableCell>
              <TableCell className={`text-right font-medium ${className}`}>
                {transaction.type === 'withdrawal' ? '- ' : ''}
                {formatCurrency(transaction.amount, transaction.currency)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TransactionList;
