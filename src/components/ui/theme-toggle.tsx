
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { UserSettings } from "@/types";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { settings, updateSettings } = useSettings();
  const currentTheme = settings?.theme || 'light';

  // Actualizar el tema en el DOM
  useEffect(() => {
    setMounted(true);
    
    if (settings?.theme) {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    }
  }, [settings?.theme]);
  
  // Solo renderizar el toggle cuando el componente está montado
  if (!mounted) {
    return <Button variant="ghost" size="icon"><Sun className="h-[1.2rem] w-[1.2rem]" /></Button>;
  }

  function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme } as Partial<UserSettings>);
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {currentTheme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
