import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function ToastMessage({ toastTitle }) {
  const { toast } = useToast()

  return (
    toast({
        title: {toastTitle},
        description: "Friday, February 10, 2023 at 5:57 PM",
        action: (
        <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
        ),
    })
  )
}
