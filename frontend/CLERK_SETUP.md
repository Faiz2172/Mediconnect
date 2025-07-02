# Clerk Authentication Setup

## Prerequisites

1. Create a Clerk account at [https://clerk.com](https://clerk.com)
2. Create a new application in your Clerk dashboard

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Clerk Configuration
# Get your publishable key from https://dashboard.clerk.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Optional: Add your Clerk secret key for backend operations
# VITE_CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

## Getting Your Clerk Keys

1. Go to your Clerk dashboard
2. Select your application
3. Go to "API Keys" in the sidebar
4. Copy your "Publishable Key" and replace `pk_test_your_publishable_key_here` in the `.env` file

## Features Included

- Email/Password authentication
- Google OAuth integration
- User profile management
- Protected routes
- Firebase integration for data storage (user profiles, health data, etc.)

## How It Works

This setup uses:
- **Clerk** for authentication (login/register)
- **Firebase** for data storage (user profiles, health data, documents, etc.)

The authentication flow:
1. Users register/login through Clerk
2. User data is stored in Firebase using the Clerk user ID
3. All data operations use Firebase while authentication uses Clerk

## Important Notes

- Make sure to restart your development server after adding the `.env` file
- The `.env` file should be added to `.gitignore` to keep your keys secure
- For production, set the environment variables in your hosting platform

## Troubleshooting

If you see "process is not defined" errors, make sure you're using `import.meta.env` instead of `process.env` in your Vite configuration.

If you see "useSignOut is not exported" errors, use `useClerk` instead and call `signOut()` from the clerk instance.

## Migration from Firebase

The following components have been updated to use Clerk:

- `src/App.jsx` - Added ClerkProvider
- `src/Pages/login.jsx` - Updated to use Clerk hooks
- `src/Pages/register.jsx` - Updated to use Clerk hooks
- `src/Components/ProtectedRoute.jsx` - Updated to use Clerk authentication
- `src/Components/Header.jsx` - Updated to use Clerk hooks

## Next Steps

1. Set up your Clerk application
2. Add your publishable key to the `.env` file
3. Configure OAuth providers (Google) in your Clerk dashboard
4. Test the authentication flow

## Additional Configuration

You can customize the Clerk appearance by modifying the `appearance` object in `src/clerk/config.js`. 