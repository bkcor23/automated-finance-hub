
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { UserSettings } from '@/types';
import { Globe, Bell, Moon, User, Mail, Phone } from 'lucide-react';

// Esquemas de validación
const profileSchema = z.object({
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
  email: z.string().email("Ingresa un correo electrónico válido").optional(),
  avatar_url: z.string().url("Ingresa una URL válida").optional().nullable(),
});

const settingsSchema = z.object({
  theme: z.enum(["light", "dark"]),
  language: z.enum(["es", "en"]),
  notifications: z.boolean(),
  email_notifications: z.boolean(),
});

const SettingsPage = () => {
  const { authState, updateProfile } = useAuth();
  const { settings, updateSettings, isLoading } = useSettings();
  const { profile } = authState;

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
      email: profile?.email || "",
      avatar_url: profile?.avatar_url || "",
    },
  });

  const settingsForm = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      theme: (settings?.theme as any) || "light",
      language: (settings?.language as any) || "es",
      notifications: settings?.notifications !== undefined ? settings.notifications : true,
      email_notifications: settings?.email_notifications !== undefined ? settings.email_notifications : true,
    },
  });

  const onProfileSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      toast.error("Error al actualizar perfil");
    }
  };

  const onSettingsSubmit = async (data: z.infer<typeof settingsSchema>) => {
    try {
      await updateSettings(data as Partial<UserSettings>);
    } catch (error) {
      console.error("Error al actualizar configuración:", error);
      toast.error("Error al actualizar configuración");
    }
  };

  // Actualizar formularios cuando cambian los datos
  React.useEffect(() => {
    if (profile) {
      profileForm.reset({
        full_name: profile.full_name || "",
        email: profile.email || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile, profileForm]);

  React.useEffect(() => {
    if (settings) {
      settingsForm.reset({
        theme: (settings.theme as any) || "light",
        language: (settings.language as any) || "es",
        notifications: settings.notifications,
        email_notifications: settings.email_notifications,
      });
    }
  }, [settings, settingsForm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-1">Administra tu cuenta y preferencias</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center">
            <User size={16} className="mr-2" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Bell size={16} className="mr-2" />
            <span>Preferencias</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Información de perfil</CardTitle>
              <CardDescription>
                Actualiza tu información personal y de contacto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan Pérez" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>
                          Este es el nombre que se mostrará en tu perfil
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="mail@example.com" 
                            {...field} 
                            value={field.value || ""} 
                            disabled
                          />
                        </FormControl>
                        <FormDescription>
                          Tu correo electrónico registrado (no se puede cambiar)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="avatar_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de avatar</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/avatar.jpg" 
                            {...field} 
                            value={field.value || ""} 
                          />
                        </FormControl>
                        <FormDescription>
                          URL de tu imagen de perfil (debe ser una URL pública)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={!profileForm.formState.isDirty || profileForm.formState.isSubmitting}
                    >
                      Guardar cambios
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
              <CardDescription>
                Personaliza tu experiencia en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...settingsForm}>
                <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                  <FormField
                    control={settingsForm.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Moon size={16} className="mr-2" />
                          Tema
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un tema" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Oscuro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Establece el tema visual de la aplicación
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={settingsForm.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Globe size={16} className="mr-2" />
                          Idioma
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un idioma" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="es">Español</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Establece el idioma principal de la aplicación
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notificaciones</h3>

                    <FormField
                      control={settingsForm.control}
                      name="notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="flex items-center">
                              <Bell size={16} className="mr-2" />
                              Notificaciones de la aplicación
                            </FormLabel>
                            <FormDescription>
                              Recibe alertas y notificaciones en la aplicación
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={settingsForm.control}
                      name="email_notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="flex items-center">
                              <Mail size={16} className="mr-2" />
                              Notificaciones por correo electrónico
                            </FormLabel>
                            <FormDescription>
                              Recibe alertas importantes por correo electrónico
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={!settingsForm.formState.isDirty || settingsForm.formState.isSubmitting || isLoading}
                    >
                      Guardar preferencias
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
