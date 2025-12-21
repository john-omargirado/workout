import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const workouts = await prisma.workout.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                workoutSets: {
                    include: {
                        exercise: {
                            include: {
                                muscleGroup: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                date: 'desc'
            }
        })
        return NextResponse.json(workouts)
    } catch (error) {
        console.error('Error fetching workouts:', error)
        return NextResponse.json({ error: 'Failed to fetch workouts' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { dayType, isDeload, notes } = body

        const workout = await prisma.workout.create({
            data: {
                userId: session.user.id,
                dayType,
                isDeload: isDeload || false,
                notes,
            }
        })

        return NextResponse.json(workout, { status: 201 })
    } catch (error) {
        console.error('Error creating workout:', error)
        return NextResponse.json({ error: 'Failed to create workout' }, { status: 500 })
    }
}
