import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getDayTypeInfo } from '@/lib/utils'
import { Dumbbell, Timer, Target } from 'lucide-react'

interface WorkoutCardProps {
  dayType: 'heavy' | 'light' | 'medium'
  isToday?: boolean
  lastWorkoutDate?: string
}

export function WorkoutCard({ dayType, isToday, lastWorkoutDate }: WorkoutCardProps) {
  const info = getDayTypeInfo(dayType)
  
  const variantMap = {
    heavy: 'heavy' as const,
    light: 'light' as const,
    medium: 'medium' as const,
  }

  return (
    <Card className={`transition-all hover:shadow-lg ${isToday ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant={variantMap[dayType]} className="text-sm px-3 py-1">
            {dayType.charAt(0).toUpperCase() + dayType.slice(1)} Day
          </Badge>
          {isToday && (
            <Badge variant="outline" className="text-xs">
              Today
            </Badge>
          )}
        </div>
        <CardTitle className="mt-2">{info.type} Exercises</CardTitle>
        <CardDescription>{info.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>Target Reps: <strong>{info.reps}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span>Rest Period: <strong>{info.rest / 60} min</strong></span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Dumbbell className="h-4 w-4 text-muted-foreground" />
            <span>21 sets total (7 muscle groups × 3 sets)</span>
          </div>
          
          {lastWorkoutDate && (
            <p className="text-xs text-muted-foreground mt-2">
              Last completed: {lastWorkoutDate}
            </p>
          )}
          
          <Link href={`/workout/${dayType}`} className="block mt-4">
            <Button variant={variantMap[dayType]} className="w-full">
              Start {dayType.charAt(0).toUpperCase() + dayType.slice(1)} Workout
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
