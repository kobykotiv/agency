# CrewAI Platform

A web-based platform for dynamically creating, managing, and deploying AI crews with a user-friendly interface and Docker Swarm deployment capabilities.

## Overview

CrewAI Platform enables users to:
- Create and manage AI crews through a web interface
- Configure and deploy custom AI agents
- Manage tasks and workflows
- Monitor crew performance and resource usage
- Self-host the platform using Docker Swarm

## Architecture

The platform uses a modern microservices architecture:

```
├── apps/
│   ├── web/          # Next.js frontend application
│   ├── api/          # FastAPI backend service
│   └── chatbot/      # AI interaction service
├── packages/
│   ├── ui/           # Shared UI components
│   ├── auth/         # Authentication utilities
│   ├── db/           # Database utilities
│   └── config/       # Shared configuration
├── crews/            # Crew definitions and templates
└── docs/             # Project documentation
```

## Core Features

1. User Authentication & Management
   - JWT-based authentication
   - Role-based access control
   - User profile management

2. Crew Management
   - Create/edit/delete crews
   - Configure crew parameters
   - Crew templates

3. Agent Configuration
   - Custom agent creation
   - Role definition
   - Parameter configuration

4. Task Management
   - Task creation and assignment
   - Dependency management
   - Progress monitoring

5. Resource Management
   - API key management
   - Resource monitoring
   - Usage analytics

## Getting Started

### Prerequisites
- Docker and Docker Swarm
- Node.js 18+
- Python 3.8+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/crewai-platform.git
cd crewai-platform
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start development environment:
```bash
bun run dev
```

### Docker Deployment

1. Build images:
```bash
docker compose build
```

2. Initialize swarm:
```bash
docker swarm init
```

3. Deploy stack:
```bash
docker stack deploy -c docker-compose.yml crewai
```

## Development

### Project Structure

- `apps/web`: Frontend application
- `apps/api`: Backend API service
- `apps/chatbot`: AI interaction service
- `packages/*`: Shared utilities and components
- `crews/*`: Crew definitions and templates
- `docs/*`: Documentation

### Commands

- `bun run dev`: Start development environment
- `bun run build`: Build all packages and apps
- `bun run test`: Run tests
- `bun run lint`: Run linting
- `bun run deploy`: Deploy to Docker Swarm

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)
- [User Manual](./docs/user_manual.md)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

[MIT License](LICENSE)
