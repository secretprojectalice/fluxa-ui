import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import LanguageItemForm from "@/components/LanguageItemForm"
import type { LanguageItem } from "@/definitions/language"

type Props = {
    open: boolean
    setOpen: (open: boolean) => void
    loading: boolean
    error: string | null
    form: Omit<LanguageItem, "id">
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSubmit: (e: React.FormEvent) => void
}

export default function AddLanguageItemDialog({ open, setOpen, loading, error, form, onChange, onSubmit }: Props) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>Add Language Item</DialogTitle>
                <form onSubmit={onSubmit}>
                    <LanguageItemForm form={form} onChange={onChange} error={error} />
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
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