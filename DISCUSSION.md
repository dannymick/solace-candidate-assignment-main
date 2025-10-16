If I had more time, I would have explored the following improvements:

### Backend pagination and filtering:

The GET route currently supports a simple limit query parameter but with more time I'd add proper pagination (cursor/offset-based) and more query filters (city, specialty, degree, etc.) to better support large datasets and reduce payload sizes.

### Sorting and search:

Allow users to sort advocates by different fields and add more advanced search capabilities (PostgreSQL's full-text search, facets, etc.)

### Loading and empty states:

Add a small loading spinner or skeleton component (React's suspense with a fallback) during data fetches to display a better empty state experience.

### Error handling:

Display clear error messages to the user when API requests fail instead of silent console logs.

### UI polish:

With more time, I'd refine the visual design by adding more interactive states (hover, focus, etc.), consistentcy across the board, better mobile responsiveness and possibly introduce a component library like Shadcn or apply an existing design system.

### Testing:

Add unit tests around filtering and pagination. Possibly add integration tests to ensure the UI and backend are working together as expected.
