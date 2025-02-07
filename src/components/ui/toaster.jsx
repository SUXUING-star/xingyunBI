// src/components/ui/toaster.jsx
import { useToast } from "@/hooks/use-toast"
import { 
  Toast, 
  ToastProvider, 
  ToastViewport,
  ToastTitle,        // 添加这些导入
  ToastDescription   // 添加这些导入
} from "./toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}