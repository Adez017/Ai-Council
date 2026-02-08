"use client"

import { useState, useEffect } from "react"
import { X, Lightbulb } from "lucide-react"
import { Card } from "@/components/ui/card"

interface InlineHintProps {
  id: string
  title: string
  description: string
  showOnce?: boolean
}

export function InlineHint({ id, title, description, showOnce = true }: InlineHintProps) {
  const [isVisible, setIsVisible] = useState(false)
  const storageKey = `hint-dismissed-${id}`

  useEffect(() => {
    if (showOnce) {
      const dismissed = localStorage.getItem(storageKey)
      setIsVisible(!dismissed)
    } else {
      setIsVisible(true)
    }
  }, [id, showOnce, storageKey])

  const handleDismiss = () => {
    setIsVisible(false)
    if (showOnce) {
      localStorage.setItem(storageKey, "true")
    }
  }

  if (!isVisible) return null

  return (
    <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss hint"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex gap-3 pr-6">
        <div className="flex-shrink-0">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            {title}
          </h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {description}
          </p>
        </div>
      </div>
    </Card>
  )
}
