import { DashboardSkeleton } from '@/components/loading/card-skeleton'

export default function DashboardLoading() {
  return (
    <div className="container mx-auto py-8">
      <DashboardSkeleton />
    </div>
  )
}
