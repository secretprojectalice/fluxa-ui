import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { LanguageItem, LanguageItemUpdate } from "@/definitions/language"

// Dialog styles (shadcn/ui style, centered modal)
function Dialog({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            {children}
        </DialogPrimitive.Root>
    )
}

function DialogContent({ children, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
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
                <DialogPrimitive.Close className="absolute right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    )
}

function DialogTitle({ children, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title className={"text-lg font-semibold " + (className || "")}{...props}>{children}</DialogPrimitive.Title>
    )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={"flex flex-row-reverse gap-2 mt-4 " + (className || "")} {...props} />
}

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    loading: boolean
    error: string | null
    item: LanguageItem | null
    form: LanguageItemUpdate
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSubmit: (e: React.FormEvent) => void
}

export default function UpdateLanguageItemDialog({ open, setOpen, loading, error, item, form, onChange, onSubmit }: Props) {
    if (!item) return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>Update Language Item</DialogTitle>
                <form className="flex flex-col gap-4 mt-2" onSubmit={onSubmit}>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="content">Content</Label>
                        <Input id="content" name="content" value={form.content} onChange={onChange} required />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="translation">Translation</Label>
                        <Input id="translation" name="translation" value={form.translation} onChange={onChange} required />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="example">Example</Label>
                        <Input id="example" name="example" value={form.example || ""} onChange={onChange} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="itemType">Type</Label>
                        <select
                            id="itemType"
                            name="itemType"
                            value={form.itemType}
                            onChange={onChange}
                            className="w-full border rounded-md px-3 py-2 bg-background"
                            required
                        >
                            <option value="word">Word</option>
                            <option value="phrasal_verb">Phrasal Verb</option>
                            <option value="idiom">Idiom</option>
                            <option value="phrase">Phrase</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Label htmlFor="sourceLanguage" className="mb-2">Source Language</Label>
                            <select
                                id="sourceLanguage"
                                name="sourceLanguage"
                                value={form.sourceLanguage}
                                onChange={onChange}
                                className="w-full border rounded-md px-3 py-2 bg-background"
                                required
                            >
                                <option value="en">English</option>
                                <option value="uk">Ukrainian</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="targetLanguage" className="mb-2">Target Language</Label>
                            <select
                                id="targetLanguage"
                                name="targetLanguage"
                                value={form.targetLanguage}
                                onChange={onChange}
                                className="w-full border rounded-md px-3 py-2 bg-background"
                                required
                            >
                                <option value="en">English</option>
                                <option value="uk">Ukrainian</option>
                            </select>
                        </div>
                    </div>
                    {error && <div className="text-destructive text-xs">{error}</div>}
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update"}
                        </Button>
                        <Button type="button" variant="outline" disabled={loading} onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 