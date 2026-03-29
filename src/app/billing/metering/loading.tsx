export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 
          border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    </div>
  )
}
