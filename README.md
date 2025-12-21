# The Wizard - Gym Workout Tracker

A Next.js 14 application for tracking workouts based on "The Wizard" Heavy/Light/Medium hypertrophy program by Fazlifts.

## Features

- 📅 **Three-Day Program**: Heavy, Light, and Medium workout days
- ⏱️ **Rest Timer**: Built-in countdown timer with audio notification
- 📊 **Volume Tracking**: Track weekly sets per muscle group (target: 9-18 sets)
- 📈 **Double Progression**: Log weights and reps to track progress
- 🔄 **Deload Management**: Track training weeks and schedule deloads
- 📚 **Exercise Library**: Browse exercises by muscle group and type

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Gym_Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma db push
```

4. Seed the database with exercises (optional):
```bash
# Start the dev server first, then call the seed endpoint
curl -X POST http://localhost:3000/api/seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Program Structure

### Heavy Day
- Compound exercises
- 5-8 reps per set
- 2 minute rest periods
- 3 sets per muscle group

### Light Day
- Isolation exercises
- 12-15 reps per set
- 1 minute rest periods
- Active recovery focus

### Medium Day
- Moderate/machine exercises
- 8-12 reps per set
- 2 minute rest periods
- Joint-friendly variations

## Database Commands

```bash
# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Generate Prisma client
npx prisma generate
```

## Deployment to Vercel

1. Push your code to GitHub

2. Connect your repository to Vercel

3. Add environment variables:
   - `DATABASE_URL`: Your production database URL

4. Deploy!

**Note**: For production, consider using a hosted database like:
- Turso (SQLite)
- PlanetScale (MySQL)
- Supabase (PostgreSQL)

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes
│   ├── exercises/        # Exercise library page
│   ├── history/          # Workout history page
│   ├── settings/         # Settings page
│   ├── workout/[dayType] # Dynamic workout pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Dashboard
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Navigation bar
│   ├── rest-timer.tsx    # Rest timer component
│   ├── set-logger.tsx    # Set logging component
│   ├── volume-tracker.tsx# Volume tracking component
│   └── workout-card.tsx  # Workout day card
├── lib/
│   ├── exercises.ts      # Exercise data
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
prisma/
├── schema.prisma         # Database schema
└── wizard.db             # SQLite database
```

## The Wizard Program Philosophy

Based on the Fazlifts hypertrophy program:

1. **Double Progression**: Stay at a weight until you hit the top of the rep range for all sets, then increase weight
2. **Start Low**: Begin with 9 sets per muscle/week, add volume only when progress stalls
3. **Deload Regularly**: Every 5-6 weeks, take a deload week
4. **Exercise Rotation**: Consider switching exercises every 3 weeks (waves method)
5. **Rest Period Adaptation**: The body adapts to shorter rest periods over time

## License

This project is for personal use. The Wizard program is created by Fazlifts.
