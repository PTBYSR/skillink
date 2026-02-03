
# SkillLink

SkillLink is a minimal skill swap app where you can find people to learn from and teach.

## Features

- **Auth**: Simple email/password login (bcyrpt + JWT).
- **Onboarding**: Select skills to learn and teach.
- **Matching**: Only see people who teach what you want to learn.
- **Swipe**: Tinder-like UI to match or skip.
- **Matches**: View your liked profiles.
- **Safety**: Block and report users.

## Setup

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Environment Variables**:
    Copy `.env.example` to `.env` and fill in your MongoDB URI.
    ```bash
    cp .env.example .env
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Seed Data**:
    To populate the database with demo users, visit:
    `http://localhost:3000/api/seed`

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- MongoDB + Mongoose
- Tailwind CSS (Black & White theme)
- Framer Motion

## Folder Structure

- `/app`: Pages and API routes.
- `/lib`: DB connection, Auth helpers, Constants.
- `/models`: Mongoose models (User, Swipe, Safety).
- `/components`: (Inline components used in pages for MVP simplicity).
