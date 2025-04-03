
import { toast } from "@/hooks/use-toast";

export const handleError = (error: unknown, fallbackMessage: string = "An error occurred"): void => {
  console.error(error);
  
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    errorMessage = String((error as { message: unknown }).message);
  }
  
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
};

// Utility function to safely parse JSON
export const safeParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    handleError(error, "Failed to parse data");
    return fallback;
  }
};
