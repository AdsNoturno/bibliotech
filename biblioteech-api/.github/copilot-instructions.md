# BiblioTech API - AI Agent Instructions

This guide outlines key patterns and conventions for working with the BiblioTech API codebase.

## Project Architecture

- **Express.js + TypeScript + MongoDB**: RESTful API built with strict TypeScript compilation and Mongoose ODM
- **MVC Pattern**: Routes -> Controllers -> Models architecture for clean separation of concerns
- All database operations are centralized in controllers with consistent error handling patterns

### Key Directories
```
src/
  ├── config/     # Configuration (database connection, env vars)
  ├── models/     # Mongoose schemas and TypeScript interfaces
  ├── routes/     # Express route definitions
  ├── controllers/# Business logic and request handling
  └── index.ts    # Application entry point
```

## Development Workflows

### Setup & Running
```bash
npm install        # Install dependencies
npm run dev       # Start dev server with hot-reload
npm run build     # Compile TypeScript to dist/
npm start         # Run compiled code in production
```

### Database
- MongoDB connection managed in `src/config/database.ts`
- Environment variables in `.env` file (MONGO_URI required)
- Connection automatically handled on server start

## Key Patterns

### TypeScript Conventions
- Models define both Mongoose Schema and TypeScript interfaces (see `src/models/Book.ts`)
- Strict TypeScript configuration enforced (see `tsconfig.json`)
- Express types properly used in controllers (Request, Response)

### Error Handling
```typescript
try {
  // Database operation
} catch (error) {
  if (error instanceof Error && 'code' in error && error.code === 11000) {
    // Handle duplicates (409 Conflict)
  } else if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
    // Handle validation errors (400 Bad Request)
  } else {
    // Handle server errors (500 Internal Server Error)
  }
}
```

### API Response Patterns
- 200: Successful GET/PUT/PATCH
- 201: Successful POST (resource created)
- 204: Successful DELETE
- 400: Validation errors
- 404: Resource not found
- 409: Conflicts (duplicate unique fields)
- 500: Server errors

### Model Validation
- Required fields enforced via Mongoose schema
- Custom validation rules (e.g., publishedYear constraints)
- Unique constraints (e.g., ISBN)
- Timestamps automatically added

## Common Tasks

### Adding a New Model
1. Create interface and schema in `src/models/`
2. Create controller in `src/controllers/`
3. Define routes in `src/routes/`
4. Mount routes in `src/index.ts`

### Modifying Database Schema
- Update both TypeScript interface and Mongoose schema
- Consider backwards compatibility
- Add appropriate validation rules