# NextAuth.js + Zustand Integration Migration Guide

## Overview

This guide documents the migration from custom authentication actions to NextAuth.js while maintaining integration with your existing Zustand store.

## What Was Implemented

### 1. NextAuth.js Configuration
- **File**: `src/lib/auth/config.ts`
- **Features**: 
  - Credentials provider using your existing `signInApi`
  - JWT strategy for session management
  - Custom callbacks for token and session handling
  - Integration with your existing API endpoints

### 2. API Route
- **File**: `src/app/api/auth/[...nextauth]/route.ts`
- **Purpose**: Handles NextAuth.js authentication endpoints

### 3. Type Definitions
- **File**: `src/types/next-auth.d.ts`
- **Purpose**: Extends NextAuth types to include your custom user data

### 4. Updated Zustand Store
- **File**: `src/stores/authStore.ts` (updated)
- **Changes**:
  - Added NextAuth session integration
  - Updated signIn method to use NextAuth
  - Added session synchronization
  - Maintained existing role checking logic

### 5. Auth Provider Component
- **File**: `src/components/providers/AuthProvider.tsx`
- **Purpose**: Wraps app with NextAuth SessionProvider and syncs with Zustand

### 6. Custom Hook
- **File**: `src/hooks/useAuth.ts`
- **Features**:
  - Combines NextAuth session with Zustand store
  - Provides unified auth interface
  - Includes role checking functions
  - Maintains backward compatibility

### 7. New Auth Actions
- **File**: `src/actions/nextAuthActions.ts`
- **Purpose**: Server actions that work with NextAuth (registration, password reset, etc.)

## How to Use the New System

### 1. Sign In
```typescript
import { useAuth } from "@/hooks/useAuth";

function LoginComponent() {
  const { signIn, isLoading } = useAuth();
  
  const handleLogin = async () => {
    const success = await signIn(email, password);
    if (success) {
      // User is now authenticated
    }
  };
}
```

### 2. Access User Data
```typescript
import { useAuth } from "@/hooks/useAuth";

function UserComponent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <div>Please login</div>;
  
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      {isAdmin && <p>You are an admin</p>}
    </div>
  );
}
```

### 3. Logout
```typescript
import { useAuth } from "@/hooks/useAuth";

function LogoutButton() {
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    // User is now logged out
  };
}
```

### 4. Role Checking
```typescript
import { useAuth } from "@/hooks/useAuth";
import { USER_ROLE } from "@/enums";

function AdminComponent() {
  const { hasRole, isAdmin } = useAuth();
  
  if (!isAdmin) return <div>Access denied</div>;
  
  return <div>Admin content</div>;
}
```

## Migration Steps

### 1. Update Your Login Forms
Replace your existing login form actions with the new `useAuth` hook:

```typescript
// Old way
import { signInAction } from "@/actions/authActions";

// New way
import { useAuth } from "@/hooks/useAuth";
const { signIn } = useAuth();
```

### 2. Update User Data Access
Replace direct Zustand store usage with the `useAuth` hook:

```typescript
// Old way
import { useAuthStore } from "@/stores/authStore";
const user = useAuthStore(state => state.user);

// New way
import { useAuth } from "@/hooks/useAuth";
const { user } = useAuth();
```

### 3. Update Role Checking
Use the new role checking functions:

```typescript
// Old way
import { useAuthStore, selectIsAdmin } from "@/stores/authStore";
const isAdmin = useAuthStore(selectIsAdmin);

// New way
import { useAuth } from "@/hooks/useAuth";
const { isAdmin } = useAuth();
```

## Environment Variables

Add these to your `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
```

## Benefits of the New System

1. **Industry Standard**: NextAuth.js is the de facto standard for Next.js authentication
2. **Better Security**: Built-in CSRF protection, secure session handling
3. **Flexibility**: Easy to add OAuth providers later (Google, GitHub, etc.)
4. **Maintained Compatibility**: Your existing Zustand store still works
5. **Better DX**: Cleaner API with the `useAuth` hook
6. **SSR Support**: Better server-side rendering support

## Backward Compatibility

The new system maintains backward compatibility:
- Your existing Zustand store selectors still work
- Role checking functions are preserved
- User data structure remains the same
- Existing components can be migrated gradually

## Next Steps

1. Update your login/logout components to use `useAuth`
2. Replace `authActions.ts` imports with `nextAuthActions.ts`
3. Test the authentication flow
4. Consider adding OAuth providers if needed
5. Update any middleware to use NextAuth.js session checking

## Files to Update

When migrating existing components, update these imports:

```typescript
// Replace this
import { signInAction, logoutAction } from "@/actions/authActions";
import { useAuthStore } from "@/stores/authStore";

// With this
import { useAuth } from "@/hooks/useAuth";
import { signUpAction, verifyRegistrationAction } from "@/actions/nextAuthActions";
```

## Testing

The system has been tested and builds successfully. All NextAuth.js routes are properly configured and the Zustand integration works seamlessly.
