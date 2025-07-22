"use client"

import type React from "react"

import { useState } from "react"
import type { CalendarEvent } from "@/definitions/events"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { DialogFooter } from "@/components/ui/dialog"

interface EventFormProps {
    onSubmit: (event: Omit<CalendarEvent, "id">) => void
    onCancel: () => void
    initialDate?: Date
    event?: CalendarEvent
    onDelete?: (id: string) => void
}

export function EventForm({ onSubmit, onCancel, initialDate = new Date(), event, onDelete }: EventFormProps) {
    const [formData, setFormData] = useState({
        title: event?.title || "",
        description: event?.description || "",
        startDate: event?.startDate.toISOString().slice(0, 16) || initialDate.toISOString().slice(0, 16),
        endDate:
            event?.endDate.toISOString().slice(0, 16) ||
            new Date(initialDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16),
        type: event?.type || ("event" as "event" | "reminder"),
        color: event?.color || ("blue" as CalendarEvent["color"]),
        allDay: event?.allDay || false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            title: formData.title,
            description: formData.description,
            startDate: new Date(formData.startDate),
            endDate: new Date(formData.endDate),
            type: formData.type,
            color: formData.color,
            allDay: formData.allDay,
        })
    }

    const handleDelete = () => {
        if (event && onDelete) {
            onDelete(event.id)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Event title"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Event description (optional)"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(value: "event" | "reminder") => setFormData({ ...formData, type: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="event">Event</SelectItem>
                            <SelectItem value="reminder">Reminder</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Select
                        value={formData.color}
                        onValueChange={(value: CalendarEvent["color"]) => setFormData({ ...formData, color: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="blue">Blue</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="red">Red</SelectItem>
                            <SelectItem value="purple">Purple</SelectItem>
                            <SelectItem value="orange">Orange</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <Switch
                    id="allDay"
                    checked={formData.allDay}
                    onCheckedChange={(checked) => setFormData({ ...formData, allDay: checked })}
                />
                <Label htmlFor="allDay">All day event</Label>
            </div>

            {!formData.allDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date & Time</Label>
                        <Input
                            id="startDate"
                            type="datetime-local"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endDate">End Date & Time</Label>
                        <Input
                            id="endDate"
                            type="datetime-local"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            required
                        />
                    </div>
                </div>
            )}

            <DialogFooter className="flex justify-between">
                <div>
                    {event && onDelete && (
                        <Button type="button" variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">{event ? "Update" : "Create"} {formData.type}</Button>
                </div>
            </DialogFooter>
        </form>
    )
}
