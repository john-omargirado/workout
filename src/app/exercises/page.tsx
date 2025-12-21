import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { muscleGroups, defaultExercises } from '@/lib/exercises'
import { Dumbbell } from 'lucide-react'

export default function ExercisesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Exercise Library</h1>
        <p className="text-muted-foreground">
          Browse exercises by muscle group for your Heavy, Light, and Medium days
        </p>
      </div>

      <div className="grid gap-6">
        {muscleGroups.map((group) => {
          const exercises = defaultExercises[group.id as keyof typeof defaultExercises]
          
          return (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  {group.name}
                </CardTitle>
                <CardDescription>
                  {exercises.compound.length + exercises.isolation.length} exercises available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Compound Exercises */}
                  {exercises.compound.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Badge variant="heavy">Compound</Badge>
                        <span className="text-xs text-muted-foreground">Heavy & Medium Days</span>
                      </h4>
                      <ul className="space-y-1">
                        {exercises.compound.map((exercise) => (
                          <li key={exercise} className="text-sm text-muted-foreground pl-2 border-l-2 border-red-200">
                            {exercise}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Isolation Exercises */}
                  {exercises.isolation.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Badge variant="light">Isolation</Badge>
                        <span className="text-xs text-muted-foreground">Light Days</span>
                      </h4>
                      <ul className="space-y-1">
                        {exercises.isolation.map((exercise) => (
                          <li key={exercise} className="text-sm text-muted-foreground pl-2 border-l-2 border-green-200">
                            {exercise}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>Exercise Selection Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Heavy Day:</strong> Focus on big, basic compound exercises. 
            Think Bench Press, Squats, Pull-ups, and Overhead Press.
          </p>
          <p>
            <strong className="text-foreground">Light Day:</strong> Use isolation exercises for active recovery. 
            Keep the weight lighter and focus on the pump.
          </p>
          <p>
            <strong className="text-foreground">Medium Day:</strong> Choose joint-friendly variations. 
            Dumbbells and machines work great here.
          </p>
          <p>
            <strong className="text-foreground">Rotation:</strong> Consider switching exercises every 3 weeks 
            to prevent overuse injuries and maintain progress (the "waves" method).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
