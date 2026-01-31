import { redis } from './redis.js';
import type { Jwk } from 'better-auth/plugins';
import { jwt } from 'better-auth/plugins';
import { randomUUID } from 'crypto';

const JWKS_KEY = 'betterauth:jwks';

export const jwtPlugin = jwt({
    adapter: {
        /**
         * Get all stored JWKs
         */
        getJwks: async () => {
            const data = await redis.lrange(JWKS_KEY, 0, -1);
            if (!data.length) return [];

            return data.map((item) => {
                const parsed = JSON.parse(item);
                if (parsed.createdAt) parsed.createdAt = new Date(parsed.createdAt);
                if (parsed.expiresAt) parsed.expiresAt = new Date(parsed.expiresAt);
                return parsed as Jwk;
            });
        },

        /**
         * Create a new JWK entry
         */
        createJwk: async (data: Omit<Jwk, 'id'>, _ctx) => {
            const jwk: Jwk = {
                id: randomUUID(),
                publicKey: data.publicKey,
                privateKey: data.privateKey,
                createdAt: data.createdAt ?? new Date(),
                expiresAt: data.expiresAt,
                alg: data.alg ?? 'EdDSA',
                crv: data.crv ?? 'Ed25519',
            };

            await redis.lpush(JWKS_KEY, JSON.stringify(jwk));
            await redis.ltrim(JWKS_KEY, 0, 4);

            return jwk;
        },
    },

    jwt: {
        expirationTime: '7d',
    },
});
