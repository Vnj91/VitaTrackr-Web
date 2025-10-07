export default function GoalProgress({ progress = 0 }: { progress?: number }) {
  return (
    <div>
      <div className="h-4 bg-gray-200 rounded overflow-hidden">
        <div
          className="h-full bg-green-500"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <div className="text-sm mt-1">{progress}% to goal</div>
    </div>
  )
}
