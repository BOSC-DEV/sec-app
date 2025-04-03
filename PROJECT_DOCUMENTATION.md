
# Scammer Reporting Platform Documentation

## Project Overview

This application is a platform for reporting and tracking scammers in the digital space. Users can report scammers, view detailed information about known scammers, and track statistics about scam activity.

## Architecture

The application follows a modern React architecture with the following key technologies:

- **React**: Frontend library
- **TypeScript**: Type checking
- **React Router**: Navigation
- **React Hook Form**: Form handling
- **Tailwind CSS**: Styling
- **Shadcn/UI**: UI component library
- **Supabase**: Backend database and authentication

## Directory Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/         # Shared components used across the app
│   ├── layout/         # Layout components (header, footer, etc.)
│   ├── profile/        # Profile-related components
│   ├── report/         # Components for reporting scammers
│   └── ui/             # Shadcn UI components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── integrations/       # Third-party service integrations
├── lib/                # Utility libraries
├── pages/              # Page components corresponding to routes
├── services/           # API services and data fetching
├── types/              # TypeScript type definitions
└── utils/              # Helper functions and utilities
```

## Key Features

1. **Scammer Reporting**: Users can submit reports about scammers with detailed information.
2. **Scammer Profiles**: Each reported scammer has a detailed profile page.
3. **Most Wanted List**: A curated list of the most dangerous scammers.
4. **User Profiles**: Users can create profiles and track their contributions.
5. **Leaderboard**: Shows top contributors to the platform.

## Development Guidelines

### Component Structure

Components should follow these guidelines:
- Keep components small and focused on a single responsibility
- Use TypeScript interfaces to define props
- Implement proper loading and error states
- Ensure accessibility (ARIA attributes, keyboard navigation)

### State Management

- Use React Context for global state (e.g., user profile)
- Use React Query for server state management
- Use local state for UI-specific state

### Error Handling

The application uses a comprehensive error handling system:
- Error boundaries for catching React component errors
- Structured error handling for API requests
- User-friendly error messages through toast notifications

### Testing

The testing strategy includes:
- Unit tests for utility functions and hooks
- Component tests for UI components
- Integration tests for key user flows

## Deployment

The application is built with Vite and can be deployed to any static hosting service.

## Contributing

When contributing to this project:
1. Follow the existing code style and patterns
2. Write meaningful commit messages
3. Add appropriate documentation for new features
4. Ensure all tests pass before submitting changes
