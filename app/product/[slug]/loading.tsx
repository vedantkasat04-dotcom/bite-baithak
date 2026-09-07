import { SkeletonLine } from '../../components/ui/Skeleton'

export default function ProductLoading() {
  return (
    <div className="container-bb py-14 md:py-20">
      <SkeletonLine className="mb-8 h-4 w-28" />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <SkeletonLine className="aspect-square w-full rounded-2xl" />

        <div className="space-y-5 lg:pt-4">
          <SkeletonLine className="h-3 w-24" />
          <SkeletonLine className="h-16 w-[80%] md:h-24" />
          <SkeletonLine className="h-4 w-[70%]" />
          <SkeletonLine className="h-10 w-40" />
          <div className="flex gap-2 pt-4">
            <SkeletonLine className="h-11 w-24 rounded-full" />
            <SkeletonLine className="h-11 w-24 rounded-full" />
          </div>
          <SkeletonLine className="h-14 w-64 rounded-full" />
        </div>
      </div>
    </div>
  )
}
