'use client'

import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'
import { CardSkeleton } from '@/components/loading/card-skeleton'

// Lazy load heavy components with loading states

export const LazyOrchestrationVisualization = dynamic(
  () => import('@/components/council/orchestration-visualization').then(mod => ({ default: mod.OrchestrationVisualization })),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
)

export const LazyOrchestrationBreakdown = dynamic(
  () => import('@/components/council/orchestration-breakdown').then(mod => ({ default: mod.OrchestrationBreakdown })),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
)

export const LazyProgressTimeline = dynamic(
  () => import('@/components/council/progress-timeline').then(mod => ({ default: mod.ProgressTimeline })),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
)

export const LazyResponseViewer = dynamic(
  () => import('@/components/council/response-viewer').then(mod => ({ default: mod.ResponseViewer })),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
)

export const LazySystemMonitoring = dynamic(
  () => import('@/components/admin/system-monitoring').then(mod => ({ default: mod.SystemMonitoring })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    ),
    ssr: false,
  }
)

export const LazyUserManagementTable = dynamic(
  () => import('@/components/admin/user-management-table').then(mod => ({ default: mod.UserManagementTable })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    ),
    ssr: false,
  }
)
