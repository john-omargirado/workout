import { WorkoutCard } from '@/components/workout-card'
import { VolumeTracker } from '@/components/volume-tracker'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, TrendingUp, Zap } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login')
  }
  
  // Get user settings from database
  let settings = null
  let weeklyVolume = [
    { name: 'Chest', sets: 0, target: 9 },
    { name: 'Upper Back', sets: 0, target: 9 },
    { name: 'Shoulders', sets: 0, target: 9 },
    { name: 'Quads', sets: 0, target: 9 },
    { name: 'Hamstrings', sets: 0, target: 9 },
    { name: 'Biceps', sets: 0, target: 9 },
    { name: 'Triceps', sets: 0, target: 9 },
  ]

  if (session?.user?.id) {
    settings = await prisma.settings.findUnique({
      where: { userId: session.user.id }
    })

    // Get this week's workout data
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const workouts = await prisma.workout.findMany({
      where: {
        userId: session.user.id,
        date: { gte: startOfWeek }
      },
      include: {
        workoutSets: {
          where: { completed: true }
        }
      }
    })

    // Calculate weekly volume
    const totalSets = workouts.reduce((acc: number, w: { workoutSets: unknown[] }) => acc + w.workoutSets.length, 0)
    // Update sets per day completed (3 sets per muscle per workout day)
    const completedDays = workouts.filter((w: { completed: boolean }) => w.completed).length
    weeklyVolume = weeklyVolume.map(v => ({
      ...v,
      sets: completedDays * 3
    }))
  }

  const currentWeek = settings?.currentWeek || 1
  const weeksUntilDeload = settings ? settings.weeksUntilDeload - ((settings.currentWeek - 1) % settings.weeksUntilDeload) : 5

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}! 💪
        </h1>
        <p className="text-muted-foreground">
          Heavy/Light/Medium Hypertrophy Training Program
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Week {currentWeek}</div>
            <p className="text-xs text-muted-foreground">
              {weeksUntilDeload} weeks until deload
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyVolume.reduce((a, v) => a + v.sets, 0)} sets</div>
            <p className="text-xs text-muted-foreground">
              Target: 63 sets (9 per muscle)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Session</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Medium Day</div>
            <p className="text-xs text-muted-foreground">
              8-12 reps, 2 min rest
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Program Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Program Structure</CardTitle>
          <CardDescription>
            3 non-consecutive days per week with double progression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Badge variant="heavy">Heavy</Badge>
              <span>Compound exercises, 5-8 reps, 2 min rest</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="light">Light</Badge>
              <span>Isolation exercises, 12-15 reps, 1 min rest (active recovery)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="medium">Medium</Badge>
              <span>Moderate exercises, 8-12 reps, 2 min rest</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workout Selection */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Start a Workout</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <WorkoutCard dayType="heavy" lastWorkoutDate="Dec 15, 2024" />
          <WorkoutCard dayType="light" lastWorkoutDate="Dec 17, 2024" />
          <WorkoutCard dayType="medium" isToday lastWorkoutDate="Dec 19, 2024" />
        </div>
      </div>

      {/* Volume Tracker */}
      <VolumeTracker muscleGroups={weeklyVolume} />
    </div>
  )
}
