import type { CalendarEvent } from "@/definitions/events"
import { EventCard } from "@/components/events/event-card"
import { getEventsForDate, formatDate, formatTime } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"

interface DayViewProps {
    date: Date
    events: CalendarEvent[]
    onDateChange: (date: Date) => void
    onBackToMonth: () => void
    onEventClick: (event: CalendarEvent) => void
}

export function DayView({ date, events, onDateChange, onBackToMonth, onEventClick }: DayViewProps) {
    const dayEvents = getEventsForDate(events, date).sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    const navigateDay = (direction: "prev" | "next") => {
        const newDate = new Date(date)
        if (direction === "prev") {
            newDate.setDate(date.getDate() - 1)
        } else {
            newDate.setDate(date.getDate() + 1)
        }
        onDateChange(newDate)
    }

    // Generate timeline hours (24-hour format)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    const getEventPosition = (event: CalendarEvent) => {
        if (event.allDay) return null

        const startHour = event.startDate.getHours()
        const startMinute = event.startDate.getMinutes()
        const endHour = event.endDate.getHours()
        const endMinute = event.endDate.getMinutes()

        const startPosition = startHour + startMinute / 60
        const duration = endHour + endMinute / 60 - startPosition

        return {
            top: `${startPosition * 60}px`, // 60px per hour
            height: `${Math.max(duration * 60, 30)}px`, // Minimum 30px height
        }
    }

    return (
        <div className="bg-white rounded-lg border">
            {/* Day View Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={onBackToMonth}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Month
                    </Button>
                    <h2 className="text-xl font-semibold">{formatDate(date)}</h2>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateDay("prev")}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigateDay("next")}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* All Day Events */}
            {dayEvents.filter((event) => event.allDay).length > 0 && (
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">All Day</h3>
                    <div className="space-y-2">
                        {dayEvents
                            .filter((event) => event.allDay)
                            .map((event) => (
                                <EventCard key={event.id} event={event} onClick={() => onEventClick(event)} />
                            ))}
                    </div>
                </div>
            )}

            {/* Timeline */}
            <div className="relative">
                <div className="flex">
                    {/* Time Labels */}
                    <div className="w-16 flex-shrink-0">
                        {hours.map((hour) => (
                            <div key={hour} className="h-[60px] flex items-start justify-end pr-2 text-xs text-gray-500 border-b">
                                {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                            </div>
                        ))}
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 relative">
                        {/* Hour Grid Lines */}
                        {hours.map((hour) => (
                            <div key={hour} className="h-[60px] border-b border-gray-100" />
                        ))}

                        {/* Timed Events */}
                        <div className="absolute inset-0 pointer-events-none">
                            {dayEvents
                                .filter((event) => !event.allDay)
                                .map((event) => {
                                    const position = getEventPosition(event)
                                    if (!position) return null

                                    return (
                                        <div key={event.id} className="absolute left-2 right-2 pointer-events-auto" style={position}>
                                            <div
                                                className="h-full rounded p-2 cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                                                style={{
                                                    backgroundColor: getEventBackgroundColor(event.color),
                                                    borderLeft: `4px solid ${getEventBorderColor(event.color)}`,
                                                }}
                                                onClick={() => onEventClick(event)}
                                            >
                                                <div className="text-sm font-medium text-gray-900 truncate">{event.title}</div>
                                                <div className="text-xs text-gray-600 truncate">
                                                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                                                </div>
                                                {event.description && (
                                                    <div className="text-xs text-gray-500 truncate mt-1">{event.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                </div>
            </div>

            {/* No Events Message */}
            {dayEvents.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    <p>No events or reminders for this day</p>
                </div>
            )}
        </div>
    )
}

function getEventBackgroundColor(color: string): string {
    const colors = {
        blue: "#dbeafe",
        green: "#dcfce7",
        red: "#fee2e2",
        purple: "#f3e8ff",
        orange: "#fed7aa",
    }
    return colors[color as keyof typeof colors] || colors.blue
}

function getEventBorderColor(color: string): string {
    const colors = {
        blue: "#3b82f6",
        green: "#22c55e",
        red: "#ef4444",
        purple: "#a855f7",
        orange: "#f97316",
    }
    return colors[color as keyof typeof colors] || colors.blue
}
