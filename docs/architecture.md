# Agency Architecture

## Overview
The application follows a clean architecture pattern with three main layers:
- Apps (Frontend/Client applications)
- API (REST/GraphQL interfaces)
- Backend (Core business logic)

## Communication Flow
```
[Apps] → [API Layer] → [Backend]
```

## Key Components
- `/apps`: Client applications
- `/apps/api`: API interfaces and endpoints
- `/backend`: Core business logic and data handling
- `/docs`: Public documentation
- `/docx`: Internal documentation and prompts

## API Endpoints

### Crews
- `POST /crews`: Create a new crew.
- `GET /crews`: List all crews.
- `GET /crews/:crewId`: Get a specific crew by ID.
- `PUT /crews/:crewId`: Update a crew.
- `DELETE /crews/:crewId`: Delete a crew.

### Agents
- `POST /agents`: Create a new agent.
- `GET /agents`: List all agents.
- `GET /agents/:agentId`: Get a specific agent by ID.
- `PUT /agents/:agentId`: Update an agent.
- `DELETE /agents/:agentId`: Delete an agent.

### Tasks
- `POST /tasks`: Create a new task.
- `GET /tasks`: List all tasks.
- `GET /tasks/:taskId`: Get a specific task by ID.
- `PUT /tasks/:taskId`: Update a task.
- `DELETE /tasks/:taskId`: Delete a task.
- `POST /tasks/:taskId/delegate`: Delegate a task to another agent.

### Conversations
- `GET /conversations/:crewId`: Get all conversations for a crew.
- `GET /conversations/:conversationId`: Get a specific conversation by ID.
- `POST /conversations/:crewId`: Add a message to a conversation.
- `POST /conversations/:crewId/broadcast`: Send a message to all agents in a crew.

## Apps Structure
- `agent-editor`: An app for creating and editing agents.
- `crew-manager`: An app for creating and managing crews.
- `task-manager`: An app for creating and managing tasks.
- `conversation-viewer`: An app for viewing and interacting with conversations.
- `test-runner`: An app for running tests on agents and crews.

## Data Models

### Crew
- `id`: (String, UUID) Unique identifier for the crew.
- `name`: (String) Name of the crew.
- `description`: (String) Description of the crew.
- `agents`: (Array of String, UUIDs) List of agent IDs associated with the crew.
- `tasks`: (Array of String, UUIDs) List of task IDs assigned to the crew.
- `created_at`: (Timestamp) Timestamp of when the crew was created.
- `updated_at`: (Timestamp) Timestamp of when the crew was last updated.

### Agent
- `id`: (String, UUID) Unique identifier for the agent.
- `name`: (String) Name of the agent.
- `role`: (String) Role of the agent.
- `goal`: (String) Goal of the agent.
- `backstory`: (String) Backstory of the agent.
- `tools`: (Array of String) List of tool names available to the agent.
- `delegation_policy`: (Object) Rules for task delegation
    - `can_delegate`: (Boolean) Whether the agent can delegate tasks
    - `allowed_delegates`: (Array of String, UUIDs) List of agent IDs this agent can delegate to
    - `delegation_criteria`: (Array of String) List of conditions that must be met for delegation
- `created_at`: (Timestamp) Timestamp of when the agent was created.
- `updated_at`: (Timestamp) Timestamp of when the agent was last updated.

### Task
- `id`: (String, UUID) Unique identifier for the task.
- `description`: (String) Description of the task.
- `agent_id`: (String, UUID) ID of the agent assigned to the task.
- `crew_id`: (String, UUID) ID of the crew the task belongs to.
- `delegated_from`: (String, UUID, Optional) ID of the agent who delegated this task
- `delegation_chain`: (Array of String, UUIDs) Historical chain of task delegation
- `status`: (String) Status of the task (e.g., "open", "in progress", "completed", "delegated").
- `created_at`: (Timestamp) Timestamp of when the task was created.
- `updated_at`: (Timestamp) Timestamp of when the task was last updated.

### Conversation
- `id`: (String, UUID) Unique identifier for the conversation.
- `crew_id`: (String, UUID) ID of the crew the conversation belongs to.
- `messages`: (Array of Objects) List of messages in the conversation.
    - `sender`: (String) Sender of the message (e.g., agent ID or user ID).
    - `content`: (String) Content of the message.
    - `timestamp`: (Timestamp) Timestamp of when the message was sent.
    - `broadcast`: (Boolean) Whether this message was sent to all agents
    - `delegated_task_id`: (String, UUID, Optional) ID of any task delegated through this message
- `created_at`: (Timestamp) Timestamp of when the conversation was created.
- `updated_at`: (Timestamp) Timestamp of when the conversation was last updated.

## Crew-wide Chat and Task Delegation

### Overview

The system supports chatting with an entire crew of AI agents and enables task delegation between agents. This section describes how these features work.

### Crew-wide Chat Flow

1. **Message Reception**
   - User sends a message to the entire crew via `/conversations/:crewId/broadcast`
   - System distributes the message to all agents in the crew

2. **Message Processing**
   - Each agent processes the message based on their role and capabilities
   - Agents can:
     - Respond directly to the conversation
     - Delegate tasks to other agents
     - Collaborate with other agents on complex tasks

3. **Response Coordination**
   - System aggregates responses from all relevant agents
   - Maintains conversation coherence through message threading
   - Handles concurrent agent responses

### Task Delegation Flow

1. **Delegation Initiation**
   - Agent identifies need for task delegation
   - Checks delegation policy and allowed delegates

2. **Delegate Selection**
   - Agent selects appropriate delegate based on:
     - Task requirements
     - Agent capabilities
     - Current workload
     - Delegation chain (to prevent circular delegation)

3. **Task Handoff**
   - Original task marked as "delegated"
   - New task created for delegate agent
   - Delegation chain updated
   - Both agents notified of the delegation

4. **Progress Tracking**
   - Original agent can monitor delegated task progress
   - Updates flow back through delegation chain
   - Final results propagate to all involved agents

### Implementation Guidelines

1. **Agent Decision Making**
   - Agents use their role, goal, and backstory to decide when to:
     - Handle a task directly
     - Delegate to another agent
     - Collaborate with other agents

2. **Delegation Rules**
   - Maximum delegation chain length to prevent infinite loops
   - Required criteria for delegation (e.g., agent expertise, workload)
   - Automatic task priority inheritance

3. **Message Handling**
   - Structured message format for clear communication
   - Built-in support for task delegation requests
   - Mechanism for agent collaboration signals

The primary purpose of this chatbot is to chat with an entire crew ai instance, enabling seamless communication and task delegation between agents for optimal problem solving.