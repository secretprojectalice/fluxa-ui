import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDeleteDialogProps {
    open: boolean
    setOpen: (open: boolean) => void
    onConfirm: () => void
    description?: string
    loading?: boolean
}

export default function ConfirmDeleteDialog({ open, setOpen, onConfirm, description, loading }: ConfirmDeleteDialogProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 rounded-xl">
                    <DialogPrimitive.Title className="text-lg font-semibold">Are you sure?</DialogPrimitive.Title>
                    <DialogPrimitive.Description className="text-muted-foreground text-sm">
                        {description || "Are you sure you would like to delete this item?"}
                    </DialogPrimitive.Description>
                    <div className="flex flex-row-reverse gap-2 mt-4">
                        <Button variant="destructive" onClick={onConfirm} disabled={loading}>
                            {loading ? "Deleting..." : "Delete"}
                        </Button>
                        <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    )
} 