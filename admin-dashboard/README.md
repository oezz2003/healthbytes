# Food App Admin Dashboard

A modern and comprehensive admin dashboard for a food delivery application built with Next.js, Tailwind CSS, and Firebase.

## Features

- **User Management**: View and manage customers and staff accounts
- **Order Processing**: Accept, reject, and update order statuses
- **Menu Management**: Add, edit, delete menu items with nutritional information
- **Analytics Dashboard**: Track sales, popular items, and customer activity
- **Reporting**: Generate daily, weekly, and monthly reports
- **Role-based Access Control**: Different permissions for different roles

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **File Storage**: Firebase Storage
- **Charting**: Recharts
- **UI Components**: Custom components with Tailwind

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore, Authentication, and Storage enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/food-app-admin-dashboard.git
   cd food-app-admin-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   ```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app router 
│   │   ├── api/       # API routes
│   │   ├── auth/      # Authentication pages
│   │   └── dashboard/ # Dashboard pages
│   ├── components/    # React components
│   │   ├── dashboard/ # Dashboard specific components
│   │   └── ui/        # Reusable UI components
│   ├── lib/           # Utility functions and hooks
│   │   ├── firebase/  # Firebase configuration
│   │   ├── hooks/     # Custom React hooks
│   │   └── utils/     # Helper functions
│   └── types/         # TypeScript type definitions
└── tailwind.config.ts # Tailwind CSS configuration
```

## User Roles

The application supports the following user roles:

- **Operation Manager**: Manages day-to-day operations and orders
- **Accounting Manager**: Handles financial reports and analytics
- **Sales Manager**: Monitors sales performance and customer activity
- **Admin**: Full access to all features
- **Super Admin**: Full access with additional system configuration capabilities

## Screenshots

(Coming soon)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
