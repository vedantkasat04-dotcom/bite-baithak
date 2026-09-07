import { SkeletonLine } from '../components/ui/Skeleton'

export default function CartLoading() {
  return (
    <div className="container-bb py-14 md:py-20">
      <SkeletonLine className="mb-12 h-14 w-72 md:h-20" />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="flex flex-col gap-5 lg:col-span-7">
          {[0, 1, 2].map((i) => (
            <SkeletonLine key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <SkeletonLine className="h-72 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
