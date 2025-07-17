import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { checkRandomGuessExercise, createLanguageItem, deleteLanguageItem, fetchLanguageItems, fetchRandomGuessExercise, updateLanguageItem, type CheckGuessExercisePayload } from '@/api/language'
import type { LanguageItem, LanguageItemUpdate } from '@/definitions/language'

export const useInfiniteLanguageItems = (search: string = "", limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: ['languageItems', search, limit],
        queryFn: ({ pageParam }) => fetchLanguageItems({ search, pageParam, limit }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
    })
}

export const useGuessExercise = () => {
    return useQuery({
        queryKey: ['guessExercise'],
        queryFn: () => fetchRandomGuessExercise(),
    })
}

export const useCheckGuessExercise = () => {
    return useMutation({
        mutationFn: (data: CheckGuessExercisePayload) => checkRandomGuessExercise(data)
    })
}

export const useCreateLanguageItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: Omit<LanguageItem, "id">) => createLanguageItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['languageItems'] })
        }
    })
}

export const useUpdateLanguageItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: LanguageItemUpdate }) => updateLanguageItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['languageItems'] })
        }
    })
}

export const useDeleteLanguageItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteLanguageItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['languageItems'] })
        }
    })
}