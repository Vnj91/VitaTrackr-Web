import MotionCard from './MotionCard'

export default function RecipeCard({ loading = false }: { loading?: boolean }) {
  if (loading) {
    return (
      <MotionCard className="p-4">
        <div className="h-6 w-3/4 skeleton mb-3" />
        <div className="h-4 w-full skeleton mb-2" />
        <div className="h-3 w-1/2 skeleton mt-2" />
      </MotionCard>
    )
  }

  return (
    <MotionCard className="p-4">
      <h3 className="text-lg font-semibold">Simple Veggie Bowl</h3>
      <p className="text-sm muted">A quick recipe based on your ingredients.</p>
      <ul className="mt-2 list-disc list-inside text-sm">
        <li>2 cups mixed greens</li>
        <li>1 cup roasted chickpeas</li>
        <li>1/2 cup quinoa</li>
      </ul>
    </MotionCard>
  )
}
