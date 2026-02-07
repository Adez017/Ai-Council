import { DashboardSkeleton } from '@/components/loading/card-skeleton'

export default function AdminLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </div>
      <DashboardSkeleton />
    </div>
  )
}
