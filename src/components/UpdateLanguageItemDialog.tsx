import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import LanguageItemForm from "@/components/LanguageItemForm"
import type { LanguageItem, LanguageItemUpdate } from "@/definitions/language"

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
                <form onSubmit={onSubmit}>
                    <LanguageItemForm form={form} onChange={onChange} error={error} />
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