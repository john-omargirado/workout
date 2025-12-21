import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Check, Dumbbell } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HistoryPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  // Fetch real workout history from database
  const workouts = await prisma.workout.findMany({
    where: {
      userId: session.user.id,
      completed: true
    },
    include: {
      workoutSets: true
    },
    orderBy: {
      date: 'desc'
    },
    take: 20
  }) as unknown as Array<{
    id: string
    date: Date
    dayType: string
    notes: string | null
    completed: boolean
    workoutSets: Array<{ id: string }>
  }>

  // Calculate stats
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const workoutsThisWeek = workouts.filter(w => new Date(w.date) >= weekAgo)
  const totalSetsThisWeek = workoutsThisWeek.reduce((acc, w) => acc + w.workoutSets.length, 0)

  // Get user settings for training week
  const settings = await prisma.settings.findUnique({
    where: { userId: session.user.id }
  })

  const variantMap = {
    heavy: 'heavy' as const,
    light: 'light' as const,
    medium: 'medium' as const,
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Workout History</h1>
        <p className="text-muted-foreground">
          Review your past workouts and track your progress
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{workoutsThisWeek.length}</div>
            <p className="text-xs text-muted-foreground">Workouts This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalSetsThisWeek}</div>
            <p className="text-xs text-muted-foreground">Total Sets This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{workouts.length}</div>
            <p className="text-xs text-muted-foreground">Total Workouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">Week {settings?.currentWeek || 1}</div>
            <p className="text-xs text-muted-foreground">Current Training Block</p>
          </CardContent>
        </Card>
      </div>

      {/* Workout List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Workouts</h2>
        
        {workouts.map((workout) => (
          <Card key={workout.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={variantMap[workout.dayType as keyof typeof variantMap]}>
                      {workout.dayType.charAt(0).toUpperCase() + workout.dayType.slice(1)} Day
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(workout.date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {workout.workoutSets.length} sets completed
                    </span>
                  </div>
                  
                  {workout.notes && (
                    <p className="text-sm mt-2 italic text-muted-foreground">
                      &ldquo;{workout.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty state for when there's no history */}
        {workouts.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No workouts yet</h3>
              <p className="text-muted-foreground">
                Start your first workout to begin tracking your progress!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
