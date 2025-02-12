---
file: /docs/auth/AUTH_FLOWS.md
description: Authentication flow diagrams and descriptions
project: Household Chore Gamification System
lastModified: 2025-02-12
---

# Authentication Flows

This document outlines the authentication flows for the Household Chore
Gamification System. While these diagrams may seem formal for a household
application, they provide clear documentation for implementation and future
maintenance.

## Registration Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as Next.js API
    participant Auth as NextAuth
    participant DB as Database

    User->>UI: Clicks Register
    alt Email/Password
        User->>UI: Enters email/password
        UI->>API: POST /api/auth/signup
        API->>DB: Check if email exists
        alt Email exists
            DB-->>API: User found
            API-->>UI: Error: Email taken
            UI-->>User: Show error message
        else Email available
            API->>DB: Create user
            DB-->>API: User created
            API->>Auth: Create session
            Auth-->>UI: Set session cookie
            UI->>UI: Redirect to onboarding
        end
    else OAuth (Google)
        User->>UI: Clicks "Sign in with Google"
        UI->>Auth: Redirect to Google
        Auth->>Google: OAuth request
        Google-->>Auth: OAuth callback
        Auth->>DB: Get/Create user
        DB-->>Auth: User record
        Auth-->>UI: Set session cookie
        UI->>UI: Redirect to onboarding
    end
```

## Login Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as Next.js API
    participant Auth as NextAuth
    participant DB as Database

    User->>UI: Clicks Login
    alt Email/Password
        User->>UI: Enters credentials
        UI->>Auth: POST /api/auth/signin
        Auth->>DB: Verify credentials
        alt Valid credentials
            DB-->>Auth: User verified
            Auth-->>UI: Set persistent session cookie
            UI->>UI: Redirect to dashboard
        else Invalid credentials
            DB-->>Auth: Invalid
            Auth-->>UI: Auth error
            UI-->>User: Show error message
        end
    else OAuth (Google)
        User->>UI: Clicks "Login with Google"
        UI->>Auth: Redirect to Google
        Auth->>Google: OAuth request
        Google-->>Auth: OAuth callback
        Auth->>DB: Get/Create user
        DB-->>Auth: User record
        Auth-->>UI: Set persistent session cookie
        UI->>UI: Redirect to dashboard
    end
```

## Email Verification Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as Next.js API
    participant Mail as Email Service
    participant DB as Database

    Note over User,DB: After Registration
    API->>Mail: Send verification email
    Mail-->>User: Receives email with token
    User->>UI: Clicks verification link
    UI->>API: POST /api/auth/verify-email
    API->>DB: Verify token & update status
    alt Valid Token
        DB-->>API: Update successful
        API-->>UI: Verification complete
        UI-->>User: Show success message
    else Invalid/Expired Token
        DB-->>API: Invalid token
        API-->>UI: Verification failed
        UI-->>User: Show error & resend option
    end
```

## Password Reset Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Frontend
    participant API as Next.js API
    participant Mail as Email Service
    participant DB as Database

    User->>UI: Clicks "Forgot Password"
    User->>UI: Enters email
    UI->>API: POST /api/auth/forgot-password
    API->>DB: Check email exists
    alt Email Found
        API->>Mail: Send reset token
        Mail-->>User: Receives reset email
        User->>UI: Clicks reset link
        UI->>UI: Show reset password form
        User->>UI: Enters new password
        UI->>API: POST /api/auth/reset-password
        API->>DB: Verify token & update password
        alt Valid Token
            DB-->>API: Update successful
            API-->>UI: Reset complete
            UI-->>User: Show success & login link
        else Invalid/Expired Token
            DB-->>API: Invalid token
            API-->>UI: Reset failed
            UI-->>User: Show error message
        end
    else Email Not Found
        API-->>UI: Email not found
        UI-->>User: Show error message
    end
```

## Household Admin Management Flow

```mermaid
sequenceDiagram
    actor Admin
    participant UI as Frontend
    participant API as Next.js API
    participant Auth as NextAuth
    participant DB as Database

    Note over Admin: Must have admin role
    Admin->>UI: Access member management
    UI->>Auth: Verify admin status
    Auth-->>UI: Confirmed admin
    UI->>API: GET /api/household/members
    API->>DB: Fetch household members
    DB-->>API: Member list
    API-->>UI: Display members

    alt Update Member Role
        Admin->>UI: Modify member role
        UI->>API: PATCH /api/household/members/:id
        API->>DB: Update member role
        DB-->>API: Confirm update
        API-->>UI: Role updated
    else Remove Member
        Admin->>UI: Select member to remove
        UI->>API: DELETE /api/household/members/:id
        API->>DB: Deactivate member
        DB-->>API: Confirm removal
        API-->>UI: Member removed
    end
```

## Implementation Notes

1. **Session Persistence**

   - Sessions remain active indefinitely for better household usability
   - Users only need to log in again after explicitly logging out
   - Password changes will invalidate all active sessions

2. **OAuth Provider**

   - Initially supporting Google authentication
   - Additional providers can be added based on household needs

3. **Error Handling**

   - Clear error messages for users
   - Proper handling of network issues
   - Graceful fallbacks for OAuth failures

4. **Redirects**
   - New users go through onboarding
   - Existing users go directly to dashboard
   - Failed attempts remain on login/register page with error messages
