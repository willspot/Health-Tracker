# Hi, I'm Willspot! 👋

# Health Tracker

Health Tracker is a modern, fullstack web application that empowers users to monitor and manage their health metrics with ease. Built with a Next.js/React frontend and a Laravel REST API backend, the platform allows users to track weight, food intake, steps, heart rate, blood pressure, temperature, and more. Featuring JWT authentication, interactive charts, goal setting, and a beautiful responsive UI with dark mode support, Health Tracker helps users stay on top of their wellness journey from any device.


## Setup Instruction

1. Clone the Repository:

```bash
git clone https://github.com/willspot/Health-Tracker.git
cd Health-Tracker
```
2. Backend Setup (Laravel)

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
```
Configure your database in .env (DB_DATABASE, DB_USERNAME, DB_PASSWORD).

Set up your JWT secret:

```bash
php artisan jwt:secret
```
Run migrations:
```bash
php artisan migrate
```
Start the backend server:
```bash
php artisan serve
```
The backend API will be available at http://localhost:8000

3. Frontend Setup (Next.js/React)

```bash
cd ../frontend
npm install
```

Start the frontend
```bash
npm run dev
```

The frontend will be available at http://localhost:3000


4. Usage
Visit http://localhost:3000 in your browser.
Sign up or log in to start tracking your health metrics!
## Tech Stack

**Frontend:** Next.js, React, Tailwind CSS

**Backend:** Laravel, JWT Auth

**Database:** MySQL/MariaDB


## Features

- User Authentication:
Secure JWT-based signup, login, and protected routes.

- Health Metrics Tracking:
Log and visualize weight, food/calories, steps, heart rate, blood pressure, temperature, and more.

- Interactive Charts:
Beautiful, responsive charts for all tracked metrics.

- Goal Setting:
Set and update daily goals for steps and calorie intake.

- Personalized Dashboard:
See your latest stats, trends, and progress at a glance.

- Tooltips & Explanations:
Hover for detailed metric info, healthy ranges, and tips.

- Responsive Design:
Fully mobile-friendly and desktop-optimized UI.
- Profile Management:
Update your user profile and change your password.

- Modern Tech Stack:
Built with Next.js/React frontend and Laravel API backend.

- RESTful API:
Clean, well-structured endpoints for all data operations.

