"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink } from "lucide-react"

interface CalComQuickRedirectProps {
  className?: string
  children?: React.ReactNode
}

export function CalComQuickRedirect({ className = "", children }: CalComQuickRedirectProps) {
  const handleRedirect = () => {
    window.open('https://cal.com/smartappacademy/1h-d-accompagnement', '_blank', 'width=800,height=700,scrollbars=yes,resizable=yes')
  }

  return (
    <Button
      onClick={handleRedirect}
      className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
    >
      {children || (
        <>
          <Calendar className="h-4 w-4 mr-2" />
          Réserver un appel
          <ExternalLink className="h-4 w-4 ml-2" />
        </>
      )}
    </Button>
  )
}

