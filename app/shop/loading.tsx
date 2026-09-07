import { SkeletonGrid, SkeletonLine } from '../components/ui/Skeleton'

export default function ShopLoading() {
  return (
    <div className="container-bb py-14 md:py-20">
      <div className="mb-10 md:mb-14">
        <SkeletonLine className="h-3 w-28" />
        <SkeletonLine className="mt-4 h-14 w-[min(28rem,80%)] md:h-20" />
        <SkeletonLine className="mt-5 h-4 w-[min(34rem,90%)]" />
      </div>

      <div className="mb-8 flex gap-2 border-b border-ink/10 pb-6">
        {Array.from({ length: 6 }, (_, i) => (
          <SkeletonLine key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      <SkeletonGrid count={6} />
    </div>
  )
}
