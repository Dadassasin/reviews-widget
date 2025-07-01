
import { NextResponse } from 'next/server';

const localhostRegex  = /^https?:\/\/(?:localhost|127\.0\.0\.1):\d+$/;
const privateNetRegex = /^https?:\/\/(?:10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+):\d+$/;

const extraOrigins = process.env.CORS_EXTRA_ORIGINS
    ? process.env.CORS_EXTRA_ORIGINS.split(/\s+/)
    : [];

function isAllowedOrigin(origin) {
    if (!origin) return false; // нет Origin - не даём CORS
    if (localhostRegex.test(origin))  return true;
    if (privateNetRegex.test(origin)) return true;
    return extraOrigins.includes(origin);
}

function addCorsHeaders(res, origin) {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.headers.set('Vary', 'Origin');
}

export function middleware(request) {
    const origin   = request.headers.get('origin');
    const response = NextResponse.next();

    // префлайт
    if (request.method === 'OPTIONS') {
        if (isAllowedOrigin(origin)) addCorsHeaders(response, origin);
        return new NextResponse(null, { status: 204, headers: response.headers });
    }

    // обычный запрос
    if (isAllowedOrigin(origin)) addCorsHeaders(response, origin);
    return response;
}

export const config = {
    matcher: ['/api/:path*'],
};
