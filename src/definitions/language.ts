import { z } from 'zod'

const LanguageItemSchema = z.object({
    id: z.uuid(),
    content: z.string(),
    translation: z.string(),
    example: z.string().optional(),
    itemType: z.enum(["word", "phrasal_verb", "idiom", "phrase"]),
    sourceLanguage: z.enum(["en", "uk"]).default("en"),
    targetLanguage: z.enum(["en", "uk"]).default("uk"),
})

export type LanguageItem = z.infer<typeof LanguageItemSchema>