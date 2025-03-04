# CrewAI Platform Development Guide

## Development Setup

### Prerequisites
- Node.js 18 or higher
- Python 3.8 or higher
- Docker and Docker Compose
- Bun package manager
- Git

### Local Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd crewai-platform
```

2. Install dependencies:
```bash
bun install # Install JavaScript dependencies
```

3. Environment Configuration:
```bash
# Copy example environment files
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp apps/chatbot/.env.example apps/chatbot/.env
```

Configure the following environment variables:
- `POSTGRES_PASSWORD`: Database password
- `OPENAI_API_KEY`: OpenAI API key (or local Ollama endpoint)
- `JWT_SECRET`: Secret for JWT token generation
- `REDIS_URL`: Redis connection string

### Development Workflow

#### Starting the Development Environment

1. Start infrastructure services:
```bash
docker compose -f docker-compose.dev.yml up -d
```

2. Start development servers:
```bash
# In separate terminals:
bun dev:web      # Start web frontend
bun dev:api      # Start API server
bun dev:chatbot  # Start chatbot service
bun dev:worker   # Start background worker
```

#### Available Scripts

- `bun dev`: Start all development servers
- `bun build`: Build all packages and applications
- `bun test`: Run tests
- `bun lint`: Run linting
- `bun format`: Format code

### Project Structure

```
├── apps/
│   ├── web/              # Next.js frontend
│   ├── api/              # FastAPI backend
│   ├── chatbot/          # AI interaction service
│   └── worker/           # Background worker
├── packages/
│   ├── ui/              # Shared UI components
│   ├── auth/            # Authentication utilities
│   ├── db/              # Database utilities
│   └── config/          # Shared configuration
└── crews/               # Crew definitions
```

### Development Guidelines

#### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

#### Testing
- Write unit tests for new features
- Include integration tests for APIs
- Run tests before committing
- Maintain test coverage

#### Git Workflow
1. Create feature branch from `main`
2. Make changes and commit
3. Run tests and lint
4. Submit pull request
5. Address review comments
6. Merge after approval

### Database Management

#### Local Development
- PostgreSQL runs in Docker
- Default database: `crewai`
- Default user: `postgres`
- Port: 5432

#### Migrations
```bash
# Create migration
bun db:migration:create

# Run migrations
bun db:migrate

# Rollback migration
bun db:rollback
```

### API Development

#### OpenAPI Documentation
- Available at `/api/docs`
- Updated automatically
- Test endpoints directly

#### WebSocket Development
- Connect to `/ws` endpoint
- Use Socket.IO for real-time
- Test with provided client

### Frontend Development

#### Component Development
- Use Storybook for isolation
- Follow atomic design
- Maintain accessibility
- Test cross-browser

#### State Management
- Use React Query for API
- Context for global state
- Local state when possible
- Redux for complex state

### Debugging

#### Backend
- Use VS Code debugger
- Check API logs
- Monitor database queries
- Watch background jobs

#### Frontend
- Use React DevTools
- Check browser console
- Monitor network requests
- Test responsiveness

### Performance Considerations

#### Frontend
- Optimize bundle size
- Implement code splitting
- Use proper caching
- Optimize images

#### Backend
- Cache expensive operations
- Optimize database queries
- Monitor memory usage
- Profile API endpoints

### Monitoring and Logging

#### Local Monitoring
- Check Docker stats
- Watch application logs
- Monitor API responses
- Track WebSocket connections

### Troubleshooting

#### Common Issues
1. Database Connection
   - Check credentials
   - Verify port mapping
   - Ensure service is running

2. API Errors
   - Check logs
   - Verify endpoints
   - Test authentication
   - Validate payload

3. Frontend Issues
   - Clear cache
   - Check console errors
   - Verify API responses
   - Test different browsers

### Security Best Practices

1. Code Security
   - Validate inputs
   - Sanitize outputs
   - Use HTTPS
   - Implement CORS

2. Data Security
   - Encrypt sensitive data
   - Use environment variables
   - Implement rate limiting
   - Follow OWASP guidelines

### Additional Resources

- [Architecture Overview](./architecture.md)
- [API Documentation](./api.md)
- [Deployment Guide](./deployment.md)
- [Contributing Guide](./contributing.md)