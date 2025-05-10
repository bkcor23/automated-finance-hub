
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { useSecurityLogs } from '@/hooks/useSecurityLogs';
import { useSecurityLog } from '@/hooks/useSecurityLog';
import { 
  ShieldCheck, 
  Key, 
  Smartphone, 
  LogOut, 
  AlertTriangle,
  Clock,
  User,
  Globe
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SecurityPage = () => {
  const { authState, logout } = useAuth();
  const { logs, isLoading } = useSecurityLogs(authState.user?.id);
  const { logEvent } = useSecurityLog();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  // Función para formatear fecha
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Función para manejar cierre de todas las sesiones
  const handleCloseAllSessions = async () => {
    try {
      await logout();
      await logEvent(
        'logout',
        'Cierre de todas las sesiones activas',
        'client-ip',
        navigator.userAgent
      );
      toast.success('Todas las sesiones han sido cerradas');
    } catch (error: any) {
      console.error('Error al cerrar sesiones:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  // Función para cambiar tiempo de sesión
  const handleSessionTimeoutChange = (value: number) => {
    setSessionTimeout(value);
    toast.success(`Tiempo de sesión actualizado a ${value} minutos`);
  };

  // Función para activar/desactivar 2FA
  const handleToggle2FA = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    
    if (enabled) {
      toast.success('Autenticación de dos factores activada');
    } else {
      toast.success('Autenticación de dos factores desactivada');
    }
    
    // Registrar evento de seguridad
    logEvent(
      'security_setting_change',
      `2FA ${enabled ? 'activada' : 'desactivada'}`,
      'client-ip',
      navigator.userAgent
    );
  };

  // Obtener tipo de icono según el tipo de evento
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
        return <User size={16} className="text-primary" />;
      case 'login_failed':
        return <AlertTriangle size={16} className="text-destructive" />;
      case 'logout':
        return <LogOut size={16} className="text-muted-foreground" />;
      case 'account_created':
        return <User size={16} className="text-primary" />;
      case 'security_setting_change':
        return <ShieldCheck size={16} className="text-warning" />;
      default:
        return <Clock size={16} />;
    }
  };

  // Obtener texto según el tipo de evento
  const getEventText = (eventType: string) => {
    switch (eventType) {
      case 'login_success':
        return 'Inicio de sesión exitoso';
      case 'login_failed':
        return 'Intento de inicio de sesión fallido';
      case 'logout':
        return 'Cierre de sesión';
      case 'account_created':
        return 'Cuenta creada';
      case 'security_setting_change':
        return 'Cambio en configuración de seguridad';
      default:
        return eventType;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seguridad</h1>
        <p className="text-muted-foreground mt-1">Gestiona la seguridad de tu cuenta</p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings" className="flex items-center">
            <ShieldCheck size={16} className="mr-2" />
            <span>Configuración</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center">
            <Globe size={16} className="mr-2" />
            <span>Sesiones</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center">
            <Clock size={16} className="mr-2" />
            <span>Historial</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Métodos de autenticación</CardTitle>
                <CardDescription>
                  Configura las opciones de seguridad para tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    <Key className="mt-0.5 h-5 w-5 text-primary" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Contraseña
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Actualiza tu contraseña regularmente para mayor seguridad
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Cambiar</Button>
                </div>
                
                <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                  <div className="flex items-start gap-4">
                    <Smartphone className="mt-0.5 h-5 w-5 text-primary" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">
                          Autenticación de dos factores
                        </p>
                        {twoFactorEnabled ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary">Activo</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground">Inactivo</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Añade una capa extra de seguridad a tu cuenta
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                  />
                </div>
              </CardContent>
            </Card>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Zona de peligro</AlertTitle>
              <AlertDescription>
                Las siguientes acciones son permanentes y no se pueden deshacer.
              </AlertDescription>
            </Alert>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle>Eliminar cuenta</CardTitle>
                <CardDescription>
                  Elimina permanentemente tu cuenta y todos tus datos
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="destructive">Eliminar mi cuenta</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Sesiones activas</CardTitle>
              <CardDescription>
                Gestiona las sesiones activas y la seguridad de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border">
                <div className="p-4 bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Sesión actual</p>
                        <p className="text-xs text-muted-foreground">
                          {navigator.userAgent}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Actual
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Tiempo de expiración de sesión</p>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      className="w-20" 
                      value={sessionTimeout} 
                      onChange={(e) => handleSessionTimeoutChange(parseInt(e.target.value, 10))}
                      min="5"
                      max="120"
                    />
                    <span className="text-sm text-muted-foreground">minutos</span>
                  </div>
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleCloseAllSessions}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar todas las sesiones
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Historial de actividad</CardTitle>
              <CardDescription>
                Historial de inicios de sesión y cambios de seguridad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Últimos 30 eventos de seguridad</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead className="text-right">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No hay registros de actividad
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="flex items-center gap-2">
                          {getEventIcon(log.event_type)}
                          <span>{getEventText(log.event_type)}</span>
                        </TableCell>
                        <TableCell>{log.description}</TableCell>
                        <TableCell>{log.ip_address || '-'}</TableCell>
                        <TableCell className="text-right">
                          {formatDate(log.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityPage;
