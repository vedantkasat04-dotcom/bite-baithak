export default function HomeLoading() {
  return (
    <div
      className="grid h-[100svh] place-items-center bg-cocoa"
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center gap-4">
        <span className="serif text-3xl text-milk/90">
          Bite <span className="italic">Baithak</span>
        </span>
        <span className="h-px w-16 animate-pulse bg-turmeric" />
      </div>
    </div>
  )
}
