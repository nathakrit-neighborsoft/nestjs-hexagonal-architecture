import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/databases/schemas';
import { betterAuthConfig } from 'src/configs/better-auth.config';

type DrizzleDB = NodePgDatabase<typeof schema>;

export function createAuth(db: DrizzleDB) {
  return betterAuth({
    baseURL: betterAuthConfig.url,
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: { enabled: true },
    trustedOrigins: betterAuthConfig.trustedOrigins,
  });
}

export type Auth = ReturnType<typeof createAuth>;
