import { z } from 'zod'

export const CalendarEventSchema = z.object({
    id: z.uuid(),
    title: z.string(),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date(),
    type: z.enum(["event", "reminder"]),
    color: z.enum(["blue", "green", "red", "purple", "orange"]).default("blue"),
    allDay: z.boolean().default(false)
})

export const CalendarViewSchema = z.object({
    type: z.enum(["month", "day"]),
    date: z.date(),
})

export type CalendarEvent = z.infer<typeof CalendarEventSchema>
export type CalendarView = z.infer<typeof CalendarViewSchema>
