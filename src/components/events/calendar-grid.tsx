import { useState } from "react"
import type { CalendarEvent } from "@/definitions/events"
import { getEventsForDate, formatTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarGridProps {
    events: CalendarEvent[]
    onDateClick: (date: Date) => void
    onEventClick: (event: CalendarEvent) => void
}

export function CalendarGrid({ events, onDateClick, onEventClick }: CalendarGridProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const today = new Date()
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    const days = []

    const getEventColorClass = (color: string) => {
        const colorClasses = {
            blue: "bg-blue-100 text-blue-800",
            green: "bg-green-100 text-green-800",
            red: "bg-red-100 text-red-800",
            purple: "bg-purple-100 text-purple-800",
            orange: "bg-orange-100 text-orange-800",
        } as const
        return colorClasses[color as keyof typeof colorClasses] || colorClasses.blue
    }

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day))
    }

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev)
            if (direction === "prev") {
                newDate.setMonth(prev.getMonth() - 1)
            } else {
                newDate.setMonth(prev.getMonth() + 1)
            }
            return newDate
        })
    }

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return (
        <div className="bg-white rounded-lg border">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">
                    {monthNames[month]} {year}
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 border-b">
                {weekDays.map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-r last:border-r-0">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {days.map((date, index) => {
                    if (!date) {
                        return <div key={index} className="min-h-[120px] border-r border-b last:border-r-0" />
                    }

                    const dayEvents = getEventsForDate(events, date)
                    const isToday = date.toDateString() === today.toDateString()
                    const isCurrentMonth = date.getMonth() === month

                    return (
                        <div
                            key={date.toISOString()}
                            className={`min-h-[120px] border-r border-b p-1 cursor-pointer hover:bg-gray-50 ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                                }`}
                            onClick={() => onDateClick(date)}
                        >
                            <div
                                className={`text-sm font-medium mb-1 ${isToday ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center" : ""
                                    }`}
                            >
                                {date.getDate()}
                            </div>
                            <div className="space-y-1 max-h-[90px] overflow-y-auto">
                                {dayEvents.slice(0, 4).map((event) => (
                                    <div
                                        key={event.id}
                                        className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 truncate ${getEventColorClass(event.color)}`}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onEventClick(event)
                                        }}
                                        title={`${event.title} - ${event.allDay ? "All day" : formatTime(event.startDate)}`}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 4 && (
                                    <div className="text-xs text-gray-500 text-center">+{dayEvents.length - 4} more</div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
