
import { PrismaClient } from '@prisma/client';

export function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  client.$use(async (params, next) => {
    const before = Date.now();
    const result = await next(params);
    const after = Date.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
    }
    
    return result;
  });

  // Handle shutdown gracefully
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
      console.log('Closing Prisma Client');
      await client.$disconnect();
      process.exit(0);
    });
  });

  return client;
}

// Database error handling utility
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public meta?: Record<string, any>
  ) {
    super(message);
    this.name = 'DatabaseError';
  }

  static isUniqueConstraintError(error: any): boolean {
    return error.code === 'P2002';
  }

  static isForeignKeyError(error: any): boolean {
    return error.code === 'P2003';
  }

  static isRecordNotFoundError(error: any): boolean {
    return error.code === 'P2001';
  }
}

// Transaction helper
export async function transaction<T>(
  client: PrismaClient,
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  try {
    return await client.$transaction(async (tx) => {
      return await callback(tx);
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new DatabaseError(
        error.message,
        (error as any).code,
        (error as any).meta
      );
    }
    throw error;
  }
}

// Pagination helper types
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Pagination helper function
export function getPaginationParams(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(100, params.pageSize || 10));
  const skip = (page - 1) * pageSize;

  return {
    skip,
    take: pageSize,
    orderBy: params.orderBy ? {
      [params.orderBy]: params.orderDirection || 'desc'
    } : undefined
  };
}