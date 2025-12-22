// Exercise with image reference
export interface Exercise {
    name: string
    image?: string // URL to exercise demonstration image
}

// Default exercises organized by muscle group and type
// Using local images from /public/images/exercises/
export const defaultExercises = {
    chest: {
        compound: [
            { name: 'Bench Press', image: '/images/exercises/Bench Press.avif' },
            { name: 'Incline Bench Press', image: '/images/exercises/Incline Bench Press.avif' },
            { name: 'DB Bench Press', image: '/images/exercises/DB Bench Press.avif' },
            { name: 'DB Incline Bench Press', image: '/images/exercises/DB Incline Bench Press.avif' },
            { name: 'Hammer Strength Chest Press', image: '/images/exercises/Hammer Strength Chest Press.avif' },
            { name: 'Machine Chest Press', image: '/images/exercises/Machine Chest Press.avif' },
            { name: 'Weighted Dips', image: '/images/exercises/Weighted Dips.avif' },
            { name: 'Push Ups', image: '/images/exercises/Push Ups.avif' }
        ],
        isolation: [
            { name: 'Pec Dec', image: '/images/exercises/Pec Dec.png' },
            { name: 'Cable Crossover', image: '/images/exercises/Cable Crossover.gif' },
            { name: 'DB Flyes', image: '/images/exercises/DB Flyes.avif' },
            { name: 'Incline DB Flyes', image: '/images/exercises/Incline DB Flyes.avif' },
            { name: 'Cable Flyes', image: '/images/exercises/Cable Flyes.avif' }
        ]
    },
    upperBack: {
        compound: [
            { name: 'Pull Ups', image: '/images/exercises/Pull Ups.avif' },
            { name: 'Barbell Rows', image: '/images/exercises/Barbell Rows.avif' },
            { name: 'DB Rows', image: '/images/exercises/DB Rows.avif' },
            { name: 'T-Bar Rows', image: '/images/exercises/T-Bar Rows.avif' },
            { name: 'Hammer Strength DY Row', image: '/images/exercises/Hammer Strength DY Row.jpg' },
            { name: 'Seated Cable Rows', image: '/images/exercises/Seated Cable Rows.avif' },
            { name: 'Lat Pulldowns', image: '/images/exercises/Lat Pulldowns.avif' }
        ],
        isolation: [
            { name: 'Pullover', image: '/images/exercises/Pullover.gif' },
            { name: 'DB Pullover', image: '/images/exercises/DB Pullover.gif' },
            { name: 'Straight Arm Pulldowns', image: '/images/exercises/Straight Arm Pulldowns.gif' },
            { name: 'Face Pulls', image: '/images/exercises/Face Pulls.avif' }
        ]
    },
    shoulders: {
        compound: [
            { name: 'Overhead Press', image: '/images/exercises/Overhead Press.avif' },
            { name: 'Seated Press', image: '/images/exercises/Seated Press.avif' },
            { name: 'DB Seated Press', image: '/images/exercises/DB Seated Press.avif' },
            { name: 'Machine Shoulder Press', image: '/images/exercises/Machine Shoulder Press.avif' },
            { name: 'Arnold Press', image: '/images/exercises/Arnold Press.avif' }
        ],
        isolation: [
            { name: 'DB Laterals', image: '/images/exercises/DB Laterals.avif' },
            { name: 'Cable Laterals', image: '/images/exercises/Cable Laterals.avif' },
            { name: 'Rear Delt Flyes', image: '/images/exercises/Rear Delt Flyes.webp' },
            { name: 'Face Pulls', image: '/images/exercises/Face Pulls.avif' },
            { name: 'Front Raises', image: '/images/exercises/Front Raises.gif' }
        ]
    },
    quads: {
        compound: [
            { name: 'Squats', image: '/images/exercises/Squats.avif' },
            { name: 'Leg Press', image: '/images/exercises/Leg Press.avif' },
            { name: 'Hack Squat', image: '/images/exercises/Hack Squat.avif' },
            { name: 'Front Squat', image: '/images/exercises/Front Squat.avif' },
            { name: 'Bulgarian Split Squat', image: '/images/exercises/Bulgarian Split Squat.avif' },
            { name: 'Lunges', image: '/images/exercises/Lunges.avif' }
        ],
        isolation: [
            { name: 'Leg Extensions', image: '/images/exercises/Leg Extension.avif' },
            { name: 'Sissy Squats', image: '/images/exercises/Sissy Squats.avif' }
        ]
    },
    hamstrings: {
        compound: [
            { name: 'Romanian Deadlift', image: '/images/exercises/Romanian Deadlift.avif' },
            { name: 'Stiff Leg Deadlift', image: '/images/exercises/Stiff Leg Deadlift.avif' },
            { name: 'DB RDL', image: '/images/exercises/DB RDL.avif' },
            { name: 'Glute Bridge', image: '/images/exercises/Glute Bridge.avif' },
            { name: 'Hip Thrust', image: '/images/exercises/Hip Thrust.avif' }
        ],
        isolation: [
            { name: 'Leg Curls', image: '/images/exercises/Leg Curls.avif' },
            { name: 'Seated Leg Curls', image: '/images/exercises/Seated Leg Curls.avif' },
            { name: 'Nordic Leg Curls', image: '/images/exercises/Nordic Leg Curls.avif' }
        ]
    },
    biceps: {
        compound: [] as Exercise[],
        isolation: [
            { name: 'Barbell Curl', image: '/images/exercises/Barbell Curl.avif' },
            { name: 'DB Curl', image: '/images/exercises/DB Curl.avif' },
            { name: 'Cable Curl', image: '/images/exercises/Cable Curl.avif' },
            { name: 'Machine Preacher Curl', image: '/images/exercises/Machine Preacher Curl.avif' },
            { name: 'Hammer Curl', image: '/images/exercises/Hammer Curl.avif' },
            { name: 'Incline DB Curl', image: '/images/exercises/Incline DB Curl.avif' },
            { name: 'Concentration Curl', image: '/images/exercises/Concentration Curl.avif' }
        ]
    },
    triceps: {
        compound: [
            { name: 'Close Grip Bench Press', image: '/images/exercises/Close Grip Bench Press.avif' },
            { name: 'Weighted Dips', image: '/images/exercises/Weighted Dips.avif' },
            { name: 'Smith CGBP', image: '/images/exercises/Smith CGBP.avif' }
        ],
        isolation: [
            { name: 'Pushdowns', image: '/images/exercises/Pushdowns.avif' },
            { name: 'Overhead Tricep Extension', image: '/images/exercises/Overhead Tricep Extension.avif' },
            { name: 'DB Overhead Extension', image: '/images/exercises/DB Overhead Extension.avif' },
            { name: 'Skull Crushers', image: '/images/exercises/Skull Crushers.avif' },
            { name: 'Cable Kickbacks', image: '/images/exercises/Cable Kickbacks.avif' }
        ]
    }
}

export const muscleGroups = [
    { id: 'chest', name: 'Chest' },
    { id: 'upperBack', name: 'Upper Back' },
    { id: 'shoulders', name: 'Shoulders' },
    { id: 'quads', name: 'Quads' },
    { id: 'hamstrings', name: 'Hamstrings/Glutes' },
    { id: 'biceps', name: 'Biceps' },
    { id: 'triceps', name: 'Triceps' }
]

// Helper to get all exercise names for a muscle group
export function getExerciseNames(muscleId: keyof typeof defaultExercises): string[] {
    const exercises = defaultExercises[muscleId]
    return [
        ...exercises.compound.map(e => e.name),
        ...exercises.isolation.map(e => e.name)
    ]
}

// Helper to find an exercise by name
export function findExercise(name: string): Exercise | undefined {
    for (const muscleGroup of Object.values(defaultExercises)) {
        const found = [...muscleGroup.compound, ...muscleGroup.isolation].find(e => e.name === name)
        if (found) return found
    }
    return undefined
}

// The Wizard program templates - Heavy/Light/Medium day structure
export const workoutTemplates = {
    heavy: [
        { muscle: 'chest', exercise: 'Bench Press', sets: 3, reps: '5-8' },
        { muscle: 'upperBack', exercise: 'Pull Ups', sets: 3, reps: '5-8' },
        { muscle: 'quads', exercise: 'Squats', sets: 3, reps: '5-8' },
        { muscle: 'hamstrings', exercise: 'Stiff Leg Deadlift', sets: 3, reps: '5-8' },
        { muscle: 'shoulders', exercise: 'Seated Press', sets: 3, reps: '5-8' },
        { muscle: 'biceps', exercise: 'Barbell Curl', sets: 3, reps: '5-8' },
        { muscle: 'triceps', exercise: 'Weighted Dips', sets: 3, reps: '5-8' }
    ],
    light: [
        { muscle: 'chest', exercise: 'Pec Dec', sets: 3, reps: '12-15' },
        { muscle: 'upperBack', exercise: 'Pullover', sets: 3, reps: '12-15' },
        { muscle: 'quads', exercise: 'Leg Extensions', sets: 3, reps: '12-15' },
        { muscle: 'hamstrings', exercise: 'Leg Curls', sets: 3, reps: '12-15' },
        { muscle: 'shoulders', exercise: 'DB Laterals', sets: 3, reps: '12-15' },
        { muscle: 'biceps', exercise: 'Cable Curl', sets: 3, reps: '12-15' },
        { muscle: 'triceps', exercise: 'Pushdowns', sets: 3, reps: '12-15' }
    ],
    medium: [
        { muscle: 'chest', exercise: 'DB Incline Bench Press', sets: 3, reps: '8-12' },
        { muscle: 'upperBack', exercise: 'DB Rows', sets: 3, reps: '8-12' },
        { muscle: 'quads', exercise: 'Leg Press', sets: 3, reps: '8-12' },
        { muscle: 'hamstrings', exercise: 'Glute Bridge', sets: 3, reps: '8-12' },
        { muscle: 'shoulders', exercise: 'DB Seated Press', sets: 3, reps: '8-12' },
        { muscle: 'biceps', exercise: 'Machine Preacher Curl', sets: 3, reps: '8-12' },
        { muscle: 'triceps', exercise: 'Overhead Tricep Extension', sets: 3, reps: '8-12' }
    ]
}
