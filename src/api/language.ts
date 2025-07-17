import { LanguageItemSchema, type LanguageItem, type LanguageItemUpdate } from '../definitions/language'
import { z } from 'zod'

const ITEMS_BASE_URL = `${import.meta.env.VITE_LANGUAGE_API_BASE_URL}/items`
const EXERCISES_BASE_URL = `${import.meta.env.VITE_LANGUAGE_API_BASE_URL}/exercises`

const LanguageItemsResponseSchema = z.object({
    items: z.array(LanguageItemSchema),
    total: z.number(),
    nextPage: z.number().optional(),
})

export const GuessExerciseResponseSchema = z.object({
    testItem: z.string(),
    options: z.array(z.string()),
})

const GuessExerciseCheckResponseSchema = z.object({
    ok: z.boolean(),
    correctAnswer: z.string(),
})

interface AutocompleteItemsSearch {
    search?: string,
    pageParam?: number,
    limit?: number
}

export interface CheckGuessExercisePayload {
    content: string
    answer: string
}

export const checkRandomGuessExercise = async (data: CheckGuessExercisePayload) => {
    const res = await fetch(`${EXERCISES_BASE_URL}/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) throw new Error("Error during exercise answer checking")

    try {
        const data = await res.json()
        const validatedData = GuessExerciseCheckResponseSchema.parse(data)

        return validatedData
    } catch (err) {
        throw new Error("Exercise check response doesn't correspond to type")
    }
}

export const fetchRandomGuessExercise = async () => {
    const res = await fetch(`${EXERCISES_BASE_URL}/guess`)

    if (!res.ok) throw new Error("Error during fetching a random `Guess` exercise")

    const rawData = await res.json()

    try {
        const validatedData = GuessExerciseResponseSchema.parse(rawData)

        return {
            testItem: validatedData.testItem,
            options: [...validatedData.options],
        }
    } catch (err) {
        throw new Error("`Guess` exercise response doesn't correspond to type")
    }
}

export const fetchLanguageItems = async ({ search = "", pageParam = 1, limit = 10 }: AutocompleteItemsSearch) => {
    const res = await fetch(`${ITEMS_BASE_URL}?search=${search}&page=${pageParam}&limit=${limit}`)

    if (!res.ok) throw new Error("Error during fetching a paginated language items")

    const rawData = await res.json()

    try {
        const validatedData = LanguageItemsResponseSchema.parse(rawData)

        return {
            items: validatedData.items,
            total: validatedData.total,
            nextPage: validatedData.items.length < limit ? undefined : pageParam + 1
        }
    } catch (err) {
        throw new Error("Language items response doesn't correspond to type")
    }
}

export const createLanguageItem = async (data: Omit<LanguageItem, "id">) => {
    const res = await fetch(ITEMS_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok || res.status !== 201) throw new Error("Error during creation of language item")

    try {
        const data = await res.json()
        const validatedData = LanguageItemSchema.parse(data)

        return validatedData
    } catch (err) {
        throw new Error("New language item response doesn't correspond to type")
    }
}

export const updateLanguageItem = async (id: string, data: LanguageItemUpdate) => {
    const res = await fetch(`${ITEMS_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    if (!res.ok) throw new Error("Error during update of language item")

    try {
        const data = await res.json()
        const validatedData = LanguageItemSchema.parse(data)

        return validatedData
    } catch (err) {
        throw new Error("Updated language item response doesn't correspond to type")
    }
}

export const deleteLanguageItem = async (id: string) => {
    const res = await fetch(`${ITEMS_BASE_URL}/${id}`, { method: 'DELETE' })

    if (!res.ok || res.status !== 204) throw new Error('Error during language item removal')

    return true
}