import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LanguageItem } from "@/definitions/language"
import { Search, Trash } from "lucide-react"
import { useDebounce } from "../lib/utils"
import AddLanguageItemDialog from "@/components/AddLanguageItemDialog"
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog"
import { useInfiniteLanguageItems } from '@/hooks/useLangugage'

// Simulate a backend dataset
const ALL_ITEMS: LanguageItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: `${i + 1}-b2c3d4e-1111-2222-3333-4444555566${(i + 1).toString().padStart(2, '0')}`,
    content: `word${i + 1}`,
    translation: `переклад${i + 1}`,
    example: `Example sentence for word${i + 1}.`,
    itemType: "word",
    sourceLanguage: "en",
    targetLanguage: "uk",
}))

const PAGE_SIZE = 10

// Simulated API add
function addItemToApi(item: Omit<LanguageItem, "id">): Promise<LanguageItem> {
    return new Promise(resolve => {
        setTimeout(() => {
            const newItem: LanguageItem = {
                ...item,
                id: `${Date.now()}-new`,
            }
            ALL_ITEMS.unshift(newItem)
            resolve(newItem)
        }, 1000)
    })
}

// Simulated API delete
function deleteItemFromApi(id: string): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
            const idx = ALL_ITEMS.findIndex(item => item.id === id)
            if (idx !== -1) ALL_ITEMS.splice(idx, 1)
            resolve()
        }, 1000)
    })
}

export default function LanguageTrainer() {
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 400)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
        isLoading,
    } = useInfiniteLanguageItems(debouncedSearch, PAGE_SIZE)

    // Flatten the infinite query data
    const items = data?.pages.flatMap(page => page.items) ?? []

    // Add Item dialog state
    const [open, setOpen] = useState(false)
    const [addLoading, setAddLoading] = useState(false)
    const [addError, setAddError] = useState<string | null>(null)
    const [form, setForm] = useState<Omit<LanguageItem, "id">>({
        content: "",
        translation: "",
        example: "",
        itemType: "word",
        sourceLanguage: "en",
        targetLanguage: "uk",
    })

    // Delete Item dialog state
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteItem, setDeleteItem] = useState<LanguageItem | null>(null)

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
        if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm(f => ({ ...f, [name]: value }))
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault()
        setAddLoading(true)
        setAddError(null)
        try {
            await addItemToApi(form)
            setOpen(false)
            setForm({
                content: "",
                translation: "",
                example: "",
                itemType: "word",
                sourceLanguage: "en",
                targetLanguage: "uk",
            })
            // Refresh list
            //setItems([])
            //setPage(1)
            //setHasMore(true)
        } catch {
            setAddError("Failed to add item")
        } finally {
            setAddLoading(false)
        }
    }

    const handleDeleteClick = (item: LanguageItem) => {
        setDeleteItem(item)
        setDeleteOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!deleteItem) return
        setDeleteLoading(true)
        await deleteItemFromApi(deleteItem.id)
        setDeleteOpen(false)
        setDeleteLoading(false)
        setDeleteItem(null)
        //setPage(1)
        //setHasMore(true)
        //fetchItemsFromApi({ page, search: debouncedSearch })
        //    .then(data => {
        //        setItems(prev => page === 1 ? data.items : [...prev, ...data.items])
        //        setHasMore(data.hasMore)
        //        setLoading(false)
        //    })
        //    .catch(() => {
        //        setError("Failed to load items")
        //        setLoading(false)
        //    })
    }

    return (
        <Card className="max-w-5xl">
            <CardHeader>
                <CardTitle>Language Trainer</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Form */}
                <form className="flex gap-2 mb-6">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
                        Add item
                    </Button>
                </form>

                {/* Add Item Dialog */}
                <AddLanguageItemDialog
                    open={open}
                    setOpen={setOpen}
                    loading={addLoading}
                    error={addError}
                    form={form}
                    onChange={handleFormChange}
                    onSubmit={handleAddItem}
                />

                {/* Confirm Delete Dialog */}
                <ConfirmDeleteDialog
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    onConfirm={handleDeleteConfirm}
                    description={deleteItem ? `Are you sure you would like to delete "${deleteItem.content}"?` : undefined}
                    loading={deleteLoading}
                />

                {/* Table with lazy scroll */}
                <div
                    className="overflow-y-auto rounded-lg border max-h-96"
                    style={{ minHeight: 240 }}
                    onScroll={handleScroll}
                >
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-muted">
                                <th className="px-4 py-2 text-left font-semibold">Content</th>
                                <th className="px-4 py-2 text-left font-semibold">Translation</th>
                                <th className="px-4 py-2 text-left font-semibold">Example</th>
                                <th className="px-2 py-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 && !isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No items found.</td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id} className="border-t group hover:bg-accent/30 transition-colors">
                                        <td className="px-4 py-2">{item.content}</td>
                                        <td className="px-4 py-2">{item.translation}</td>
                                        <td className="px-4 py-2">{item.example}</td>
                                        <td className="px-2 py-2 text-center align-middle">
                                            <button
                                                type="button"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
                                                title="Delete"
                                                onClick={() => handleDeleteClick(item)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Loader for more items */}
                    {isFetchingNextPage && (
                        <div className="py-4 text-center text-muted-foreground text-xs">Loading more...</div>
                    )}
                    {isLoading && (
                        <div className="py-4 text-center text-muted-foreground text-xs">Loading...</div>
                    )}
                    {error && (
                        <div className="py-4 text-center text-destructive text-xs">{error.message}</div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}