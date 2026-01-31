import { jwtVerify, createRemoteJWKSet } from 'jose';

const JWKS = createRemoteJWKSet(new URL('http://localhost:3000/api/auth/jwks'));

async function validateToken(token: string) {
    const { payload } = await jwtVerify(token, JWKS, {
        issuer: 'http://localhost:3000', // Auth server
        audience: 'http://localhost:3000', // তোমার API server audience
    });
    console.log(payload);

    return payload;
}


