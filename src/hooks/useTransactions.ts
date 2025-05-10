import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Transaction } from '@/types';
import { toast } from 'sonner';

export const useTransactions = (userId?: string) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  
  // Función para obtener todas las transacciones del usuario
  const fetchTransactions = async (filters?: {
    type?: 'deposit' | 'withdrawal' | 'transfer';
    startDate?: string;
    endDate?: string;
    source?: string;
    status?: 'completed' | 'pending' | 'failed';
  }): Promise<Transaction[]> => {
    let query = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    // Aplicar filtros si existen
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters?.source) {
      query = query.eq('source', filters.source);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    // Ensure types are correctly cast
    return (data || []).map(tx => ({
      ...tx,
      type: (tx.type as 'deposit' | 'withdrawal' | 'transfer'),
      status: (tx.status as 'completed' | 'pending' | 'failed')
    })) as Transaction[];
  };

  // Función para obtener una transacción específica
  const fetchTransaction = async (id: string): Promise<Transaction> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Ensure types are correctly cast
    return {
      ...data,
      type: (data.type as 'deposit' | 'withdrawal' | 'transfer'),
      status: (data.status as 'completed' | 'pending' | 'failed')
    } as Transaction;
  };

  // Consulta para cargar transacciones
  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: () => fetchTransactions(),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear una transacción
  const createMutation = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          ...transaction,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Transacción creada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      toast.error(`Error al crear la transacción: ${error.message}`);
    }
  });

  // Mutación para actualizar una transacción
  const updateMutation = useMutation({
    mutationFn: async (transaction: Partial<Transaction> & { id: string }) => {
      const { id, ...updates } = transaction;
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Transacción actualizada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar la transacción: ${error.message}`);
    }
  });

  // Mutación para eliminar una transacción
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      toast.success('Transacción eliminada exitosamente');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      toast.error(`Error al eliminar la transacción: ${error.message}`);
    }
  });

  // Función para filtrar transacciones
  const filterTransactions = async (filters: any) => {
    try {
      setLoading(true);
      return await fetchTransactions(filters);
    } catch (error: any) {
      console.error('Error al filtrar transacciones:', error);
      toast.error(`Error: ${error.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    transactions: transactionsQuery.data || [],
    isLoading: transactionsQuery.isLoading || loading,
    error: transactionsQuery.error,
    getTransaction: fetchTransaction,
    createTransaction: createMutation.mutate,
    updateTransaction: updateMutation.mutate,
    deleteTransaction: deleteMutation.mutate,
    filterTransactions,
    refreshTransactions: () => queryClient.invalidateQueries({ queryKey: ['transactions'] })
  };
};
