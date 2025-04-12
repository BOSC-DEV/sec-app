
// This is a wrapper around the toast component from shadcn/ui
import { useToast as useToastUI } from "@/components/ui/toast"

export const useToast = useToastUI

export const toast = useToastUI().toast
