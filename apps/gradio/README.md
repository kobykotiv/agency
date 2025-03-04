# CrewAI Gradio Interface

A Gradio-based web interface for managing and interacting with CrewAI agents and crews. This service provides a user-friendly interface for creating, configuring, and deploying AI crews.

## Features

- Interactive chat interface for crew interactions
- Dynamic crew creation and management
- Support for multiple AI providers (OpenAI, Ollama)
- Real-time task monitoring
- Integration with existing CrewAI services

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment:
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
- Set API endpoints for backend services
- Configure AI provider credentials
- Adjust server settings if needed

3. Run the service:
```bash
python main.py
```

## Docker Deployment

The service is configured to run in a Docker Swarm environment:

```bash
docker compose up gradio
```

Or deploy to swarm:

```bash
docker stack deploy -c docker-compose.yml crewai
```

## Configuration

### AI Providers

#### OpenAI
Set your API key in the environment:
```
OPENAI_API_KEY=your_key_here
```

#### Ollama
Configure the Ollama endpoint:
```
OLLAMA_BASE_URL=http://localhost:11434
```

### Crew Management

1. Create a new crew through the interface:
   - Define agents with roles and goals
   - Configure tasks and workflows
   - Set up agent interactions

2. Monitor crew activities:
   - Track task progress
   - View agent interactions
   - Review outputs

## Development

### Running Locally

1. Start development server:
```bash
pip install -r requirements.txt
python main.py
```

2. Access the interface at:
```
http://localhost:7860
```

### Testing

Run the test suite:
```bash
python -m pytest
```

## Architecture

The Gradio interface integrates with:
- FastAPI backend for API endpoints
- WebSocket service for real-time updates
- Redis for state management
- CrewAI core for agent operations

## Security

- API key management for AI providers
- Environment-based configuration
- Secure WebSocket connections
- Redis persistence for crew states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License