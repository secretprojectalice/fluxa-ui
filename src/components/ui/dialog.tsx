import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from '@/lib/utils'

// Dialog styles (shadcn/ui style, centered modal)
export function Dialog({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </DialogPrimitive.Root>
    )
}

export function DialogContent({ children, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <DialogPrimitive.Content
                className={
                    "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 rounded-xl" +
                    (className ? " " + className : "")
                }
                {...props}
            >
                {children}
                <DialogPrimitive.Close className="
                            absolute right-4 top-4 rounded-xs opacity-70 
                            transition-opacity hover:opacity-100 focus:outline-none 
                            disabled:pointer-events-none">
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    )
}

export function DialogTitle({ children, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title className={"text-lg font-semibold " + (className || "")} {...props}>{children}</DialogPrimitive.Title>
    )
}

export function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={"flex flex-row-reverse gap-2 mt-4 " + (className || "")} {...props} />
}

export function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
            {...props}
        />
    )
}

export function DialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}