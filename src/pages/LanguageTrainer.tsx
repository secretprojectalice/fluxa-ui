import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LanguageItem, LanguageItemUpdate } from "@/definitions/language"
import { Search, Trash, Edit, PlayIcon } from "lucide-react"
import { useDebounce } from "../lib/utils"
import AddLanguageItemDialog from "@/components/AddLanguageItemDialog"
import UpdateLanguageItemDialog from "@/components/UpdateLanguageItemDialog"
import ConfirmDeleteDialog from "@/components/ConfirmDeleteLanguageItemDialog"
import GuessExerciseDialog from "@/components/GuessExerciseDialog"
import { useInfiniteLanguageItems, useCreateLanguageItem, useUpdateLanguageItem, useDeleteLanguageItem } from '@/hooks/useLanguage'

const PAGE_SIZE = 10

export default function LanguageTrainer() {
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 400)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        error,
        isLoading,
    } = useInfiniteLanguageItems(debouncedSearch, PAGE_SIZE)

    // Flatten the infinite query data
    const items = data?.pages.flatMap(page => page.items) ?? []

    // Add Item dialog state
    const [open, setOpen] = useState(false)
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
    const [deleteItem, setDeleteItem] = useState<LanguageItem | null>(null)

    // Update Item dialog state
    const [updateOpen, setUpdateOpen] = useState(false)
    const [updateItem, setUpdateItem] = useState<LanguageItem | null>(null)
    const [updateForm, setUpdateForm] = useState<LanguageItemUpdate>({
        content: "",
        translation: "",
        example: "",
        itemType: "word",
        sourceLanguage: "en",
        targetLanguage: "uk",
    })

    // Real API hooks
    const createMutation = useCreateLanguageItem()
    const updateMutation = useUpdateLanguageItem()
    const deleteMutation = useDeleteLanguageItem()

    // Exercise dialog state
    const [exerciseOpen, setExerciseOpen] = useState(false)

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

    const handleUpdateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setUpdateForm(f => ({ ...f, [name]: value }))
    }

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createMutation.mutateAsync(form)
            setOpen(false)
            setForm({
                content: "",
                translation: "",
                example: "",
                itemType: "word",
                sourceLanguage: "en",
                targetLanguage: "uk",
            })
        } catch (error) {
            // Error handling is managed by the mutation
            console.error("Failed to add item:", error)
        }
    }

    const handleEditClick = (item: LanguageItem) => {
        setUpdateItem(item)
        setUpdateForm({
            content: item.content,
            translation: item.translation,
            example: item.example || "",
            itemType: item.itemType,
            sourceLanguage: item.sourceLanguage,
            targetLanguage: item.targetLanguage,
        })
        setUpdateOpen(true)
    }

    const handleDeleteClick = (item: LanguageItem) => {
        setDeleteItem(item)
        setDeleteOpen(true)
    }

    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!updateItem) return
        try {
            await updateMutation.mutateAsync({ id: updateItem.id, data: updateForm })
            setUpdateOpen(false)
            setUpdateItem(null)
            setUpdateForm({
                content: "",
                translation: "",
                example: "",
                itemType: "word",
                sourceLanguage: "en",
                targetLanguage: "uk",
            })
        } catch (error) {
            // Error handling is managed by the mutation
            console.error("Failed to update item:", error)
        }
    }

    const handleDeleteConfirm = async () => {
        if (!deleteItem) return
        try {
            await deleteMutation.mutateAsync(deleteItem.id)
            setDeleteOpen(false)
            setDeleteItem(null)
        } catch (error) {
            // Error handling is managed by the mutation
            console.error("Failed to delete item:", error)
        }
    }

    const startExercise = async () => {
        setExerciseOpen(true)
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
                    <Button type="button" variant="secondary" onClick={startExercise}>
                        <PlayIcon />
                    </Button>
                </form>

                {/* Add Item Dialog */}
                <AddLanguageItemDialog
                    open={open}
                    setOpen={setOpen}
                    loading={createMutation.isPending}
                    error={createMutation.error?.message || null}
                    form={form}
                    onChange={handleFormChange}
                    onSubmit={handleAddItem}
                />

                {/* Update Item Dialog */}
                <UpdateLanguageItemDialog
                    open={updateOpen}
                    setOpen={setUpdateOpen}
                    loading={updateMutation.isPending}
                    error={updateMutation.error?.message || null}
                    item={updateItem}
                    form={updateForm}
                    onChange={handleUpdateFormChange}
                    onSubmit={handleUpdateItem}
                />

                {/* Confirm Delete Dialog */}
                <ConfirmDeleteDialog
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    onConfirm={handleDeleteConfirm}
                    description={deleteItem ? `Are you sure you would like to delete "${deleteItem.content}"?` : undefined}
                    loading={deleteMutation.isPending}
                />

                {/* Guess Exercise Dialog */}
                {exerciseOpen && <GuessExerciseDialog open={exerciseOpen} setOpen={setExerciseOpen} />}

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
                                <th className="px-2 py-2 w-20"></th>
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
                                            <div className="flex gap-1 justify-center">
                                                <button
                                                    type="button"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                                                    title="Edit"
                                                    onClick={() => handleEditClick(item)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/80"
                                                    title="Delete"
                                                    onClick={() => handleDeleteClick(item)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
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