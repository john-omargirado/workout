import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface VolumeTrackerProps {
    muscleGroups: {
        name: string
        sets: number
        target: number
    }[]
}

export function VolumeTracker({ muscleGroups }: VolumeTrackerProps) {
    const getVolumeStatus = (sets: number, target: number) => {
        const percentage = (sets / target) * 100
        if (percentage < 50) return 'destructive'
        if (percentage < 100) return 'secondary'
        return 'default'
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    Weekly Volume
                    <Badge variant="outline">Target: 9-18 sets/muscle</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {muscleGroups.map((muscle) => (
                        <div key={muscle.name} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{muscle.name}</span>
                                <span className="text-muted-foreground">
                                    {muscle.sets} / {muscle.target} sets
                                </span>
                            </div>
                            <Progress value={muscle.sets} max={muscle.target} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
