import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LanguageItem, LanguageItemUpdate } from "@/definitions/language"

type FormData = Omit<LanguageItem, "id"> | LanguageItemUpdate

type Props = {
    form: FormData
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    error?: string | null
}

export default function LanguageItemForm({ form, onChange, error }: Props) {
    return (
        <div className="flex flex-col gap-4 mt-2">
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
        </div>
    )
} 