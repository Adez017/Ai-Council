import { TableSkeleton } from '@/components/loading/card-skeleton'

export default function HistoryLoading() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      </div>
      <TableSkeleton rows={10} />
    </div>
  )
}
