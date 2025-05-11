
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Copy, RefreshCw, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

type AdminCredentials = {
  email: string;
  password: string;
  fullName: string;
};

const CreateAdmin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const createAdminUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const { data, error } = await supabase.functions.invoke('create-admin-user');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setAdminCredentials(data.adminCredentials);
        setSuccess(data.message);
        toast.success(data.message);
      }
    } catch (error) {
      console.error('Error al crear administrador:', error);
      setError(error?.message || 'Error desconocido al crear administrador');
      toast.error('Error al crear usuario administrador');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copiado al portapapeles`);
  };

  useEffect(() => {
    // Verificar si ya existe un usuario administrador al cargar
    const checkAdminExists = async () => {
      try {
        setIsLoading(true);
        
        const { data } = await supabase.functions.invoke('create-admin-user');
        
        // Si llegamos aquí sin error, es que el usuario ya existe
        if (data && data.adminCredentials) {
          setAdminCredentials(data.adminCredentials);
          setSuccess('El usuario administrador ya existe');
        }
      } catch (error) {
        console.error('Error al verificar administrador:', error);
        // No mostramos error, solo indicamos que podemos crear el usuario
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminExists();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-lg mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Configurar Usuario Administrador</CardTitle>
            <CardDescription>
              Esta herramienta permite crear un usuario administrador predeterminado para el sistema.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 p-4 rounded-md flex items-start">
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Éxito</p>
                  <p className="text-sm">{success}</p>
                </div>
              </div>
            )}

            {adminCredentials && (
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Credenciales del Administrador</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Correo electrónico:</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{adminCredentials.email}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(adminCredentials.email, 'Email')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Contraseña:</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{adminCredentials.password}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(adminCredentials.password, 'Contraseña')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Nombre:</span>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{adminCredentials.fullName}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(adminCredentials.fullName, 'Nombre')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-muted-foreground">
                  <p>Guarda estas credenciales en un lugar seguro. No serán mostradas nuevamente.</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button
              onClick={createAdminUser}
              disabled={isLoading || !!adminCredentials}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : adminCredentials ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Usuario administrador creado
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Crear usuario administrador
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateAdmin;
