interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class InMemoryRateLimit {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 3600000, maxRequests: number = 20) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  private getKey(identifier: string): string {
    return `rate_limit:${identifier}`;
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key];
      }
    });
  }

  async checkLimit(identifier: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    this.cleanup();
    
    const key = this.getKey(identifier);
    const now = Date.now();
    const resetTime = now + this.windowMs;

    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime,
      };
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime,
      };
    }

    const entry = this.store[key];
    
    // If window has expired, reset
    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = resetTime;
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime,
      };
    }

    // Check if limit exceeded
    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment counter
    entry.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  async resetLimit(identifier: string): Promise<void> {
    const key = this.getKey(identifier);
    delete this.store[key];
  }
}

// Redis-based rate limiting (optional)
class RedisRateLimit {
  private redis: any;
  private windowMs: number;
  private maxRequests: number;

  constructor(redis: any, windowMs: number = 3600000, maxRequests: number = 20) {
    this.redis = redis;
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  private getKey(identifier: string): string {
    return `rate_limit:${identifier}`;
  }

  async checkLimit(identifier: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const key = this.getKey(identifier);
    const now = Date.now();
    const windowStart = now - this.windowMs;

    try {
      // Get current count
      const count = await this.redis.zcount(key, windowStart, '+inf');
      
      if (count >= this.maxRequests) {
        // Get the oldest entry to determine reset time
        const oldest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
        const resetTime = oldest.length > 1 ? parseInt(oldest[1]) + this.windowMs : now + this.windowMs;
        
        return {
          allowed: false,
          remaining: 0,
          resetTime,
        };
      }

      // Add current request
      await this.redis.zadd(key, now, `${now}-${Math.random()}`);
      await this.redis.expire(key, Math.ceil(this.windowMs / 1000));

      return {
        allowed: true,
        remaining: this.maxRequests - count - 1,
        resetTime: now + this.windowMs,
      };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      // Fallback to allowing the request
      return {
        allowed: true,
        remaining: this.maxRequests,
        resetTime: now + this.windowMs,
      };
    }
  }

  async resetLimit(identifier: string): Promise<void> {
    const key = this.getKey(identifier);
    await this.redis.del(key);
  }
}

// Factory function to create rate limiter
export function createRateLimiter() {
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || '3600') * 1000;
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '20');
  
  // Try to use Redis if available
  if (process.env.REDIS_URL) {
    try {
      // This would require a Redis client like ioredis
      // const Redis = require('ioredis');
      // const redis = new Redis(process.env.REDIS_URL);
      // return new RedisRateLimit(redis, windowMs, maxRequests);
      console.log('Redis URL provided but Redis client not implemented yet, falling back to in-memory');
    } catch (error) {
      console.error('Failed to initialize Redis rate limiter:', error);
    }
  }
  
  // Fallback to in-memory rate limiting
  return new InMemoryRateLimit(windowMs, maxRequests);
}

// Rate limiting middleware
export async function rateLimitMiddleware(
  request: Request,
  identifier?: string
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const rateLimiter = createRateLimiter();
  
  // Get identifier from IP or provided identifier
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const id = identifier || ip;
  return await rateLimiter.checkLimit(id);
}
