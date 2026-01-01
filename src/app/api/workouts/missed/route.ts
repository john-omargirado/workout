import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { date, reason, color } = body
        if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

        // normalize date (YYYY-MM-DD) to UTC start of day to avoid timezone shifts
        const parts = date.split('-').map((p: string) => parseInt(p, 10))
        if (parts.length !== 3 || parts.some(isNaN)) {
            return NextResponse.json({ error: 'invalid date format' }, { status: 400 })
        }
        const [year, month, day] = parts
        const dateStart = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
        const dateEnd = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0))

        // find existing workout for that date
        const existing = await prisma.workout.findFirst({
            where: {
                userId: session.user.id,
                date: {
                    gte: dateStart,
                    lt: dateEnd,
                },
            },
        })

        if (existing) {
            const updated = await prisma.workout.update({
                where: { id: existing.id },
                data: {
                    missedReason: reason || null,
                    missedReasonColor: color || null,
                    completed: false,
                },
            })
            return NextResponse.json({ workout: updated })
        }

        const created = await prisma.workout.create({
            data: {
                userId: session.user.id,
                date: dateStart,
                dayType: 'medium',
                completed: false,
                missedReason: reason || null,
                missedReasonColor: color || null,
            },
        })

        return NextResponse.json({ workout: created }, { status: 201 })
    } catch (error) {
        console.error('Error saving missed workout:', error)
        return NextResponse.json({ error: 'Failed to save missed workout' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { date } = body
        if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

        // normalize date (YYYY-MM-DD) to UTC start of day
        const parts = date.split('-').map((p: string) => parseInt(p, 10))
        if (parts.length !== 3 || parts.some(isNaN)) {
            return NextResponse.json({ error: 'invalid date format' }, { status: 400 })
        }
        const [year, month, day] = parts
        const dateStart = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
        const dateEnd = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0))

        const existing = await prisma.workout.findFirst({
            where: {
                userId: session.user.id,
                date: {
                    gte: dateStart,
                    lt: dateEnd,
                },
            },
            include: { workoutSets: true },
        })

        if (!existing) {
            return NextResponse.json({ ok: true })
        }

        // If workout has no sets and is not completed, delete it; otherwise clear missed fields
        if ((!existing.workoutSets || existing.workoutSets.length === 0) && !existing.completed) {
            await prisma.workout.delete({ where: { id: existing.id } })
            return NextResponse.json({ deleted: true })
        }

        const updated = await prisma.workout.update({
            where: { id: existing.id },
            data: {
                missedReason: null,
                missedReasonColor: null,
            },
        })

        return NextResponse.json({ workout: updated })
    } catch (error) {
        console.error('Error deleting missed workout:', error)
        return NextResponse.json({ error: 'Failed to delete missed workout' }, { status: 500 })
    }
}
