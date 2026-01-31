/**
 * Drizzle Kit configuration file
 *
 * Docs: https://orm.drizzle.team/docs/drizzle-config-file
 */

import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
    out: './migration',
    schema: './src/lib/auth/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DB!,
    },
});
