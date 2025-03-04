# Sharing Platform Specification

## Overview
System for managing sharing and collaboration between different user roles within the platform.

## Core Features
1. Role Management
   - Owner (Full system control)
   - Admin (System-wide management)
   - Moderator (Content oversight)
   - Super User (Advanced privileges)
   - Regular User (Basic access)

2. Sharing Controls
   - Resource-level sharing
   - Crew sharing
   - Template sharing
   - Tool sharing
   - Batch sharing capabilities

3. Permission Management
   - Granular access controls
   - Permission inheritance
   - Time-based access
   - Sharing restrictions

4. Collaboration Features
   - Shared workspaces
   - Resource comments
   - Activity tracking
   - Version history

## Technical Requirements
- Role-based access control
- Permission system
- Sharing service
- Activity tracker

## API Endpoints
```typescript
// Sharing endpoints
POST /api/share
GET /api/share/received
GET /api/share/sent
DELETE /api/share/:id

// Permission endpoints
GET /api/permissions
PUT /api/permissions/:resourceId
GET /api/permissions/roles
PUT /api/permissions/roles/:roleId

// Collaboration endpoints
POST /api/comments
GET /api/comments/:resourceId
POST /api/workspace
GET /api/workspace/:id
```

## Database Schema
```typescript
Share {
  id: string
  resourceId: string
  resourceType: string
  shareType: "view" | "edit" | "admin"
  sharedBy: string
  sharedWith: string[]
  expiration: DateTime
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime
}

Permission {
  id: string
  roleId: string
  resourceId: string
  resourceType: string
  actions: string[]
  conditions: JSON
  createdAt: DateTime
  updatedAt: DateTime
}

Role {
  id: string
  name: string
  level: number
  permissions: JSON
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime
}

Comment {
  id: string
  resourceId: string
  resourceType: string
  userId: string
  content: string
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime
}

Workspace {
  id: string
  name: string
  members: WorkspaceMember[]
  resources: WorkspaceResource[]
  metadata: JSON
  createdAt: DateTime
  updatedAt: DateTime
}

WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: "owner" | "admin" | "member"
  joinedAt: DateTime
}

WorkspaceResource {
  id: string
  workspaceId: string
  resourceId: string
  resourceType: string
  permissions: JSON
  addedAt: DateTime
}
```

## Sharing Workflows
1. Direct Sharing
   - Email-based sharing
   - Link sharing
   - Team sharing
   - Role-based sharing

2. Workspace Sharing
   - Shared resource pools
   - Team collaboration
   - Project spaces
   - Resource libraries

3. Template Sharing
   - Public templates
   - Private templates
   - Team templates
   - Organization templates

## Security Considerations
- Access control validation
- Share link encryption
- Activity logging
- Permission verification

## Integration Requirements
- User authentication system
- Notification system
- Email system
- Logging system