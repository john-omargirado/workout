"use client"

import { useState } from 'react'
import { MissedWorkoutModal } from './missed-workout-modal'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface EditMissedProps {
    date: string
    initialReason?: string | null
    initialColor?: string | null
}

export function EditMissedWorkout({ date, initialReason, initialColor }: EditMissedProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSave = async (reason: string, color: string) => {
        try {
            await fetch('/api/workouts/missed', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, reason, color }),
            })
            setOpen(false)
            router.refresh()
        } catch (err) {
            console.error('Failed to save missed workout', err)
        }
    }

    const handleDelete = async () => {
        try {
            await fetch('/api/workouts/missed', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date }),
            })
            setOpen(false)
            router.refresh()
        } catch (err) {
            console.error('Failed to delete missed workout', err)
        }
    }

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Edit</Button>
            <MissedWorkoutModal
                open={open}
                date={date}
                initialReason={initialReason}
                initialColor={initialColor || undefined}
                onClose={() => setOpen(false)}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </>
    )
}
