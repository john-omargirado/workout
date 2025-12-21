import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const exercises = await prisma.exercise.findMany({
            include: {
                muscleGroup: true
            },
            orderBy: {
                name: 'asc'
            }
        })
        return NextResponse.json(exercises)
    } catch (error) {
        console.error('Error fetching exercises:', error)
        return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, muscleGroupId, type, description } = body

        const exercise = await prisma.exercise.create({
            data: {
                name,
                muscleGroupId,
                type,
                description,
            },
            include: {
                muscleGroup: true
            }
        })

        return NextResponse.json(exercise, { status: 201 })
    } catch (error) {
        console.error('Error creating exercise:', error)
        return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 })
    }
}
