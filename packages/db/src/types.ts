import { Prisma } from '@prisma/client';

// Reusable types for database operations
export type TransactionClient = Prisma.TransactionClient;
export type ModelName = Prisma.ModelName;

// Extended types for database models with relations
export type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    crews: true;
    tasks: true;
    apiKeys: true;
  };
}>;

export type CrewWithRelations = Prisma.CrewGetPayload<{
  include: {
    agents: true;
    tasks: true;
    user: true;
  };
}>;

export type AgentWithRelations = Prisma.AgentGetPayload<{
  include: {
    crew: true;
    tools: true;
  };
}>;

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    crew: true;
    user: true;
    subtasks: true;
  };
}>;

// Database connection configuration
export interface DbConfig {
  url?: string;
  ssl?: boolean;
  maxConnections?: number;
  minConnections?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
}

// Connection pool metrics
export interface ConnectionPoolMetrics {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingClients: number;
}

// Query statistics
export interface QueryStats {
  model: ModelName;
  action: string;
  duration: number;
  timestamp: Date;
}

// Error handling types
export interface DatabaseErrorDetails {
  code: string;
  message: string;
  meta?: Record<string, any>;
  timestamp: Date;
}

// Query filters
export interface QueryFilters {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string[];
  tags?: string[];
  [key: string]: any;
}

// Sort options
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Batch operation result
export interface BatchOperationResult {
  success: boolean;
  count: number;
  errors: Error[];
}

// Migration info
export interface MigrationInfo {
  id: string;
  name: string;
  timestamp: Date;
  appliedAt?: Date;
  status: 'pending' | 'applied' | 'failed';
  error?: string;
}

// Database health check result
export interface HealthCheckResult {
  isHealthy: boolean;
  responseTime: number;
  connections: ConnectionPoolMetrics;
  lastError?: DatabaseErrorDetails;
  timestamp: Date;
}

// Backup metadata
export interface BackupMetadata {
  id: string;
  timestamp: Date;
  size: number;
  checksum: string;
  status: 'complete' | 'failed' | 'in_progress';
  error?: string;
}