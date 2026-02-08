"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface HelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpModal({ open, onOpenChange }: HelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Help & Documentation</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="shortcuts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shortcuts">Keyboard Shortcuts</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guide">Getting Started</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shortcuts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
                <CardDescription>Quickly navigate through the app</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ShortcutItem keys={["Ctrl", "/"]} description="Open command palette" />
                <ShortcutItem keys={["Ctrl", "K"]} description="Focus search" />
                <ShortcutItem keys={["Ctrl", "H"]} description="Go to home" />
                <ShortcutItem keys={["Ctrl", "D"]} description="Go to dashboard" />
                <ShortcutItem keys={["Ctrl", "Shift", "H"]} description="Go to history" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Chat Interface</CardTitle>
                <CardDescription>Interact with AI Council efficiently</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ShortcutItem keys={["Ctrl", "Enter"]} description="Submit query" />
                <ShortcutItem keys={["Ctrl", "N"]} description="New chat" />
                <ShortcutItem keys={["Esc"]} description="Cancel current request" />
                <ShortcutItem keys={["Ctrl", "L"]} description="Clear input" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Common actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ShortcutItem keys={["?"]} description="Open this help modal" />
                <ShortcutItem keys={["Ctrl", "S"]} description="Go to settings" />
                <ShortcutItem keys={["Ctrl", "B"]} description="Toggle sidebar" />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-4">
            <FAQItem
              question="What are execution modes?"
              answer="Execution modes control how AI Council processes your query. FAST mode uses fewer models for quick responses, BALANCED mode provides a good mix of speed and quality, and BEST_QUALITY mode uses multiple premium models with arbitration for the highest quality results."
            />
            <FAQItem
              question="How does multi-agent orchestration work?"
              answer="AI Council breaks down complex queries into smaller subtasks, assigns each to the most suitable AI model, processes them in parallel, and synthesizes the results into a coherent response. This approach is faster and more cost-effective than using a single large model."
            />
            <FAQItem
              question="What do confidence scores mean?"
              answer="Confidence scores (0-100%) indicate how certain the AI models are about their responses. Higher scores suggest more reliable answers. Scores below 70% may warrant additional verification."
            />
            <FAQItem
              question="How is cost calculated?"
              answer="Cost is calculated based on the number of tokens (words/characters) processed by each AI model, multiplied by that model's pricing. The total cost is the sum of all subtask costs."
            />
            <FAQItem
              question="Can I use my own API keys?"
              answer="Yes! Go to Settings > API Keys to configure your own keys for Groq, OpenAI, Together.ai, and other providers. This gives you more control and potentially lower costs."
            />
            <FAQItem
              question="What happens if a request fails?"
              answer="AI Council has built-in retry logic and circuit breakers. If one model fails, it automatically tries alternative models. You'll see error messages in the progress timeline if issues occur."
            />
            <FAQItem
              question="How do I view past requests?"
              answer="Navigate to the History page to see all your previous requests. You can search, filter by execution mode, and view detailed orchestration breakdowns for each request."
            />
          </TabsContent>
          
          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>1. Submit Your First Query</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Start by typing a question or task in the chat input. Complex queries work best - AI Council excels at breaking down multi-part questions.
                </p>
                <p className="text-sm text-muted-foreground">
                  Example: "Compare the pros and cons of React vs Vue, then recommend which to use for a large enterprise application."
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>2. Choose an Execution Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Select how you want your query processed:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li><strong>FAST:</strong> Quick responses, lower cost (~$0.001-0.01)</li>
                  <li><strong>BALANCED:</strong> Good quality, moderate cost (~$0.01-0.05)</li>
                  <li><strong>BEST_QUALITY:</strong> Highest quality, premium models (~$0.05-0.20)</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>3. Watch the Orchestration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  As your query processes, you'll see real-time updates showing task decomposition, model assignments, parallel execution, and synthesis. This transparency helps you understand how AI Council works.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>4. Review the Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The final response includes the synthesized answer, confidence score, cost breakdown, and detailed orchestration metadata. You can copy the response or download the full report as JSON.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>5. Configure Your Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visit Settings to add your own API keys, customize preferences, and manage your account. Using your own keys can reduce costs and increase rate limits.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function ShortcutItem({ keys, description }: { keys: string[], description: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{description}</span>
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <Badge key={i} variant="outline" className="font-mono text-xs">
            {key}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{answer}</p>
      </CardContent>
    </Card>
  )
}
