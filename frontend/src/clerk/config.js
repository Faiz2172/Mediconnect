// Clerk configuration
// You'll need to replace these with your actual Clerk publishable key
// Get these from your Clerk dashboard at https://dashboard.clerk.com















export const clerkConfig = {
  publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_cG9wdWxhci1maWxseS04NC5jbGVyay5hY2NvdW50cy5kZXYk',
  // Optional: Add appearance customization
  appearance: {
    baseTheme: 'dark',
    variables: {
      colorPrimary: '#3b82f6',
      colorBackground: '#1f2937',
      colorText: '#ffffff',
      colorTextSecondary: '#9ca3af',
      colorInputBackground: '#374151',
      colorInputText: '#ffffff',
      colorInputBorder: '#4b5563',
    },
  },
}; 