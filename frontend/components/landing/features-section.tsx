"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Network, Zap, DollarSign, Shield, BarChart3, Cpu } from "lucide-react"

const features = [
  {
    icon: Network,
    title: "Multi-Provider Orchestration",
    description: "Complex queries are automatically decomposed and distributed across specialized AI providers including OpenAI, Gemini, Ollama, and more."
  },
  {
    icon: Zap,
    title: "Parallel Execution",
    description: "Independent tasks run simultaneously across multiple providers, reducing total processing time by up to 3x."
  },
  {
    icon: DollarSign,
    title: "Cost Optimization",
    description: "Smart routing ensures each task uses the most cost-effective provider, reducing expenses by up to 50%."
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Built-in arbitration resolves conflicts between providers, ensuring consistent and reliable outputs."
  },
  {
    icon: BarChart3,
    title: "Real-Time Insights",
    description: "Watch your query being processed in real-time with detailed orchestration visualization."
  },
  {
    icon: Cpu,
    title: "Provider Specialization",
    description: "Each subtask is matched with the AI provider best suited for that specific type of work."
  }
]

const providers = [
  { name: "OpenAI", logo: "🤖" },
  { name: "Google Gemini", logo: "✨" },
  { name: "Ollama", logo: "🦙" },
  { name: "Together AI", logo: "🔗" },
  { name: "OpenRouter", logo: "🌐" },
  { name: "HuggingFace", logo: "🤗" },
  { name: "Qwen", logo: "🔮" },
]

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Why AI Council?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Harness the power of multiple AI providers working together to deliver superior results
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Supported Providers */}
        <div className="mt-16 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-6">
            SUPPORTED AI PROVIDERS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {providers.map((provider, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border bg-card px-4 py-2 transition-all hover:shadow-md"
              >
                <span className="text-2xl">{provider.logo}</span>
                <span className="text-sm font-medium">{provider.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
