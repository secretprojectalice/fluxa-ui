import type { CalendarEvent } from "@/definitions/events"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatTime } from "@/lib/utils"
import { Clock, Calendar } from "lucide-react"

interface EventCardProps {
    event: CalendarEvent
    onClick?: () => void
}

const colorClasses = {
    blue: "bg-blue-100 border-blue-300 text-blue-800",
    green: "bg-green-100 border-green-300 text-green-800",
    red: "bg-red-100 border-red-300 text-red-800",
    purple: "bg-purple-100 border-purple-300 text-purple-800",
    orange: "bg-orange-100 border-orange-300 text-orange-800",
}

export function EventCard({ event, onClick }: EventCardProps) {
    return (
        <Card
            className={`cursor-pointer hover:shadow-md transition-shadow ${colorClasses[event.color]} mb-1`}
            onClick={onClick}
        >
            <CardContent className="p-2">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{event.title}</h4>
                        {event.description && <p className="text-xs opacity-75 truncate mt-1">{event.description}</p>}
                        <div className="flex items-center gap-2 mt-1">
                            {event.type === "reminder" ? <Clock className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                            <span className="text-xs">{event.allDay ? "All day" : formatTime(event.startDate)}</span>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-xs ml-2">
                        {event.type}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
