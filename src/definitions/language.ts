import { z } from 'zod'

export const LanguageItemSchema = z.object({
    id: z.uuid(),
    content: z.string(),
    translation: z.string(),
    example: z.string().optional(),
    itemType: z.enum(["word", "phrasal_verb", "idiom", "phrase"]),
    sourceLanguage: z.enum(["en", "uk"]).default("en"),
    targetLanguage: z.enum(["en", "uk"]).default("uk"),
})

export const LanguageItemUpdateSchema = LanguageItemSchema.partial().pick({
    content: true,
    translation: true,
    example: true,
    itemType: true,
    sourceLanguage: true,
    targetLanguage: true,
})

export type LanguageItem = z.infer<typeof LanguageItemSchema>
export type LanguageItemUpdate = z.infer<typeof LanguageItemUpdateSchema>