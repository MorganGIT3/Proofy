"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createCalendarEvent } from "@/lib/supabase"

interface AddEventModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onEventAdded: () => void
  selectedDate?: Date
}

export function AddEventModal({ open, onOpenChange, onEventAdded, selectedDate }: AddEventModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
    start_time: "",
    end_time: "",
    is_all_day: false,
    event_type: "appointment" as const,
    color: "#3b82f6",
    location: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const eventData = {
        ...formData,
        start_time: formData.is_all_day ? undefined : formData.start_time,
        end_time: formData.is_all_day ? undefined : formData.end_time,
      }

      const result = await createCalendarEvent(eventData)
      
      if (result) {
        onEventAdded()
        onOpenChange(false)
        // Reset form
        setFormData({
          title: "",
          description: "",
          event_date: "",
          start_time: "",
          end_time: "",
          is_all_day: false,
          event_type: "appointment",
          color: "#3b82f6",
          location: ""
        })
      } else {
        setError("Erreur lors de la création de l'événement")
      }
    } catch (error) {
      console.error('Erreur:', error)
      setError("Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un événement</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Appel 1h le 15 octobre"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Détails de l'événement..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date">Date *</Label>
            <Input
              id="event_date"
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_all_day}
                onChange={(e) => setFormData(prev => ({ ...prev, is_all_day: e.target.checked }))}
                className="rounded"
              />
              <span>Toute la journée</span>
            </Label>
          </div>

          {!formData.is_all_day && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Heure de début</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">Heure de fin</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="event_type">Type d'événement</Label>
            <Select value={formData.event_type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, event_type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="appointment">Rendez-vous</SelectItem>
                <SelectItem value="meeting">Réunion</SelectItem>
                <SelectItem value="call">Appel</SelectItem>
                <SelectItem value="task">Tâche</SelectItem>
                <SelectItem value="reminder">Rappel</SelectItem>
                <SelectItem value="personal">Personnel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: Bureau, En ligne, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Couleur</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                className="w-16 h-10"
              />
              <span className="text-sm text-gray-600">Couleur de l'événement</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Création..." : "Créer l'événement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

