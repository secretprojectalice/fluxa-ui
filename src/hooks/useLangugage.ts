import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchLanguageItems } from '@/api/language'

export const useInfiniteLanguageItems = (search: string = "", limit: number = 10) => {
    return useInfiniteQuery({
        queryKey: ['languageItems', search, limit],
        queryFn: ({ pageParam }) => fetchLanguageItems({ search, pageParam, limit }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1,
    })
}