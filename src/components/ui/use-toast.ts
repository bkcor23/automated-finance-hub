
import { toast } from "sonner";

// Re-export sonner toast
export { toast };
export const useToast = () => {
  return {
    toast,
    // Add compatibility with the shadcn/ui toast interface
    // so existing code doesn't break
    toasts: []
  };
};
