import { db, pool } from "./db.js";
import { sql } from "drizzle-orm";
import { appLogger } from "./logger.js";

/**
 * Run database migrations and verify tables exist
 */
export async function ensureDatabase(): Promise<void> {
  try {
    appLogger.info("Checking database connection...");
    
    // Test connection
    await db.execute(sql`SELECT 1`);
    appLogger.info("Database connection successful");
    
    // Check if users table exists
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tableExists = result.rows[0]?.exists;
    
    if (!tableExists) {
      appLogger.warn("Users table not found. Please ensure 'npm run db:push' has been executed.");
      appLogger.warn("The server will attempt to start but may fail if tables are missing.");
    } else {
      appLogger.info("Database tables verified");
    }
  } catch (error) {
    appLogger.error({ error }, "Database check failed");
    throw new Error("Failed to connect to database. Please check your DATABASE_URL configuration.");
  }
}

/**
 * Gracefully close database connection
 */
export async function closeDatabase(): Promise<void> {
  await pool.end();
  appLogger.info("Database connection closed");
}
