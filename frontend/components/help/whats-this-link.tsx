"use client"

import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WhatsThisLinkProps {
  content: string
  side?: "top" | "right" | "bottom" | "left"
}

export function WhatsThisLink({ content, side = "top" }: WhatsThisLinkProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline transition-colors"
          >
            <HelpCircle className="h-3 w-3" />
            What's this?
          </button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-sm">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
