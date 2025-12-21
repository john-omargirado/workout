# The Wizard - Gym Workout Tracker

## Project Overview
A Next.js 14 app for tracking workouts based on "The Wizard" Heavy/Light/Medium hypertrophy program by Fazlifts.

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Prisma ORM with SQLite (wizard.db)
- Deployed on Vercel

## Program Structure
- **Heavy Day**: Compound exercises, 5-8 reps, 2 min rest, 3 sets per muscle
- **Light Day**: Isolation exercises, 12-15 reps, 1 min rest, 3 sets per muscle
- **Medium Day**: Moderate exercises, 8-12 reps, 2 min rest, 3 sets per muscle

## Key Features
- Workout logging with rest timer
- Double progression tracking
- Volume tracking per muscle group (target: 9-18 sets/week)
- Deload week management (every 5-6 weeks)
- Exercise library by muscle group

## Development Commands
- `npm run dev` - Start development server
- `npx prisma studio` - Open Prisma Studio
- `npx prisma db push` - Push schema changes
- `npm run build` - Build for production
