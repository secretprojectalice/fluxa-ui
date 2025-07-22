import { useState } from "react"
import type { CalendarEvent } from "@/definitions/events"
import { CalendarGrid } from "@/components/events/calendar-grid"
import { EventForm } from "@/components/events/event-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Calendar, Clock } from "lucide-react"
import { DayView } from "@/components/events/day-view"

const mockEvents: CalendarEvent[] = [
    {
        id: "1",
        title: "Team Meeting",
        description: "Weekly team sync",
        startDate: new Date(2024, 11, 15, 10, 0),
        endDate: new Date(2024, 11, 15, 11, 0),
        type: "event",
        color: "blue",
        allDay: false,
    },
    {
        id: "2",
        title: "Project Deadline",
        description: "Submit final project deliverables",
        startDate: new Date(2024, 11, 20, 9, 0),
        endDate: new Date(2024, 11, 20, 17, 0),
        type: "reminder",
        color: "red",
        allDay: false,
    },
    {
        id: "3",
        title: "Conference",
        description: "Annual tech conference",
        startDate: new Date(2024, 11, 25, 0, 0),
        endDate: new Date(2024, 11, 25, 23, 59),
        type: "event",
        color: "green",
        allDay: true,
    },
    {
        id: "4",
        title: "Client Call",
        description: "Quarterly review with client",
        startDate: new Date(2024, 11, 18, 14, 0),
        endDate: new Date(2024, 11, 18, 15, 30),
        type: "event",
        color: "purple",
        allDay: false,
    },
    {
        id: "5",
        title: "Doctor Appointment",
        description: "Annual checkup",
        startDate: new Date(2024, 11, 22, 11, 0),
        endDate: new Date(2024, 11, 22, 12, 0),
        type: "reminder",
        color: "orange",
        allDay: false,
    },
]

export default function EventsPage() {
    const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
    const [currentView, setCurrentView] = useState<"month" | "day">("month")
    const [selectedViewDate, setSelectedViewDate] = useState<Date>(new Date())
    const eventCount = events.length
    const reminderCount = events.filter((e) => e.type === "reminder").length

    const handleCreateEvent = (eventData: Omit<CalendarEvent, "id">) => {
        const newEvent: CalendarEvent = {
            ...eventData,
            id: Date.now().toString(),
        }
        setEvents((prev) => [...prev, newEvent])
        setIsDialogOpen(false)
    }

    const handleCreateEventClick = () => {
        setSelectedDate(currentView === "day" ? selectedViewDate : new Date())
        setIsDialogOpen(true)
    }

    const handleUpdateEvent = (eventData: Omit<CalendarEvent, "id">) => {
        if (!selectedEvent) return

        const updatedEvent: CalendarEvent = {
            ...eventData,
            id: selectedEvent.id,
        }

        setEvents((prev) => prev.map((event) => (event.id === selectedEvent.id ? updatedEvent : event)))

        setIsEditDialogOpen(false)
        setSelectedEvent(null)
    }

    const handleDeleteEvent = (id: string) => {
        setEvents((prev) => prev.filter((event) => event.id !== id))
        setIsEditDialogOpen(false)
        setSelectedEvent(null)
    }

    const handleDateClick = (date: Date) => {
        setSelectedViewDate(date)
        setCurrentView("day")
    }

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event)
        setIsEditDialogOpen(true)
    }

    const handleBackToMonth = () => {
        setCurrentView("month")
    }

    const handleDayChange = (date: Date) => {
        setSelectedViewDate(date)
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2" onClick={handleCreateEventClick}>
                                    <Plus className="h-4 w-4" />
                                    New Event
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Create New Event</DialogTitle>
                                </DialogHeader>
                                <EventForm
                                    onSubmit={handleCreateEvent}
                                    onCancel={() => setIsDialogOpen(false)}
                                    initialDate={selectedDate}
                                />
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Event</DialogTitle>
                                </DialogHeader>
                                {selectedEvent && (
                                    <EventForm
                                        onSubmit={handleUpdateEvent}
                                        onCancel={() => setIsEditDialogOpen(false)}
                                        event={selectedEvent}
                                        onDelete={handleDeleteEvent}
                                    />
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{eventCount} total events</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{reminderCount} reminders</span>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                {currentView === "month" ? (
                    <CalendarGrid events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />
                ) : (
                    <DayView
                        date={selectedViewDate}
                        events={events}
                        onDateChange={handleDayChange}
                        onBackToMonth={handleBackToMonth}
                        onEventClick={handleEventClick}
                    />
                )}
            </div>
        </div>
    )
}